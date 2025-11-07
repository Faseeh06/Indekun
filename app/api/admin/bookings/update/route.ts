import { NextRequest, NextResponse } from 'next/server'
import { collections, update, getById, create } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireRole('admin')(request)
    const { booking_id, status, admin_notes } = await request.json()

    if (!booking_id || !status) {
      return NextResponse.json({ error: 'booking_id and status are required' }, { status: 400 })
    }

    const validStatuses = ['APPROVED', 'REJECTED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get booking details before update
    const booking = await getById('bookings', booking_id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Get equipment and user details
    const equipment = await getById('equipment', booking.equipment_id)
    const user = await getById('users', booking.user_id)

    // Update booking
    await update('bookings', booking_id, {
      status,
      admin_notes: admin_notes || null,
    })

    // Create audit log
    const actionMap: Record<string, string> = {
      APPROVED: 'BOOKING_APPROVED',
      REJECTED: 'BOOKING_REJECTED',
      CANCELLED: 'BOOKING_CANCELLED',
    }

    await create('audit_log', {
      user_id: adminUser.id,
      action: actionMap[status] || 'BOOKING_UPDATED',
      details: JSON.stringify({
        booking_id,
        equipment_id: booking.equipment_id,
        equipment_name: equipment?.name || 'Unknown',
        user_id: booking.user_id,
        user_name: user?.name || 'Unknown',
        previous_status: booking.status,
        new_status: status,
        admin_notes,
      }),
      timestamp: new Date(),
    })

    const updated = await getById('bookings', booking_id)
    return NextResponse.json({ booking: updated })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
