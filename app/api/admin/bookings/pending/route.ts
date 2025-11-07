import { NextRequest, NextResponse } from 'next/server'
import { collections, query, getById } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')(request)

    // Try to get bookings with ordering, fallback to unordered if index doesn't exist
    let bookings: any[] = []
    try {
      bookings = await query(collections.bookings().where('status', '==', 'PENDING').orderBy('created_at', 'asc'))
    } catch (indexError: any) {
      console.warn('Composite index not found for pending bookings, fetching without ordering')
      bookings = await query(collections.bookings().where('status', '==', 'PENDING'))
    }

    // Join with user and equipment data
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking: any) => {
        const user = await getById('users', booking.user_id)
        const equipment = await getById('equipment', booking.equipment_id)

        // Sort by priority (high, medium, low)
        const priorityOrder = { high: 1, medium: 2, low: 3 }
        const priorityValue = priorityOrder[booking.priority as keyof typeof priorityOrder] || 2

        return {
          ...booking,
          user_name: user?.name || 'Unknown',
          user_email: user?.email || '',
          user_role: user?.role || 'student',
          equipment_name: equipment?.name || 'Unknown Equipment',
          category: equipment?.category || '',
          image_url: equipment?.image_url || '',
          priority_value: priorityValue,
        }
      })
    )

    // Sort by priority then by created_at
    bookingsWithDetails.sort((a: any, b: any) => {
      if (a.priority_value !== b.priority_value) {
        return a.priority_value - b.priority_value
      }
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateA - dateB
    })

    return NextResponse.json({ bookings: bookingsWithDetails })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Get pending bookings error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
