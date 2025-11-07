import { NextRequest, NextResponse } from 'next/server'
import { collections, query, getById } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')(request)

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    // Build query
    let bookingsRef: any = collections.bookings()
    
    if (status && status !== 'all') {
      bookingsRef = bookingsRef.where('status', '==', status)
    }

    // Try with ordering, fallback without
    let bookings: any[] = []
    try {
      bookings = await query(bookingsRef.orderBy('created_at', 'desc'))
    } catch (indexError: any) {
      console.warn('Composite index not found, fetching without ordering')
      bookings = await query(bookingsRef)
      // Sort in memory
      bookings.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })
    }

    // Join with user and equipment data
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking: any) => {
        const user = await getById('users', booking.user_id)
        const equipment = await getById('equipment', booking.equipment_id)

        return {
          ...booking,
          user_name: user?.name || 'Unknown',
          user_email: user?.email || '',
          user_role: user?.role || 'student',
          equipment_name: equipment?.name || 'Unknown Equipment',
          category: equipment?.category || '',
          image_url: equipment?.image_url || '',
        }
      })
    )

    return NextResponse.json({ bookings: bookingsWithDetails })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Get all bookings error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

