import { NextRequest, NextResponse } from 'next/server'
import { collections, create, query, getById } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { Priority } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const body = await request.json()
    const { equipment_id, start_time, end_time, purpose, notes, priority } = body

    // Validation
    if (!equipment_id || !start_time || !end_time || !purpose) {
      return NextResponse.json(
        { error: 'Equipment ID, start time, end time, and purpose are required' },
        { status: 400 }
      )
    }

    // Check if equipment exists and is available
    const equipmentDoc = await collections.equipment().doc(equipment_id).get()
    if (!equipmentDoc.exists) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    }

    const equipmentData = equipmentDoc.data()
    if (!equipmentData?.is_available) {
      return NextResponse.json({ error: 'Equipment is not available' }, { status: 400 })
    }

    // Check for overlapping bookings
    const startTime = new Date(start_time)
    const endTime = new Date(end_time)

    // Get all bookings for this equipment (PENDING or APPROVED)
    // Firestore doesn't support 'in' with multiple values easily, so we query separately
    const pendingBookings = await query(
      collections.bookings().where('equipment_id', '==', equipment_id).where('status', '==', 'PENDING')
    )
    const approvedBookings = await query(
      collections.bookings().where('equipment_id', '==', equipment_id).where('status', '==', 'APPROVED')
    )
    const overlappingBookings = [...pendingBookings, ...approvedBookings]

    const hasOverlap = overlappingBookings.some((booking: any) => {
      const bookingStart = new Date(booking.start_time)
      const bookingEnd = new Date(booking.end_time)
      return (
        (startTime <= bookingStart && endTime > bookingStart) ||
        (startTime < bookingEnd && endTime >= bookingEnd) ||
        (startTime >= bookingStart && endTime <= bookingEnd)
      )
    })

    if (hasOverlap) {
      return NextResponse.json(
        { error: 'Equipment is already booked for the selected time period' },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriority: Priority = priority && ['low', 'medium', 'high'].includes(priority) ? priority : 'medium'

    // Create booking
    const bookingId = await create('bookings', {
      user_id: user.id,
      equipment_id,
      start_time: startTime,
      end_time: endTime,
      purpose,
      notes: notes || null,
      priority: validPriority,
      status: 'PENDING',
    })

    // Get created booking
    const bookingDoc = await collections.bookings().doc(bookingId).get()
    const bookingData = bookingDoc.data()

    // Create audit log (don't include timestamp, it's auto-added by create function)
    try {
      const equipment = await getById('equipment', equipment_id)
      await create('audit_log', {
        user_id: user.id,
        action: 'BOOKING_CREATED',
        details: JSON.stringify({
          booking_id: bookingId,
          equipment_id,
          equipment_name: equipment?.name || 'Unknown',
          start_time: start_time.toString(),
          end_time: end_time.toString(),
          purpose,
        }),
        timestamp: new Date(),
      })
    } catch (auditError) {
      // Log audit error but don't fail the booking creation
      console.error('Failed to create audit log:', auditError)
    }

    // Get created booking with proper timestamp conversion
    const createdBooking = await getById('bookings', bookingId)
    const booking = {
      ...createdBooking,
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create booking error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
