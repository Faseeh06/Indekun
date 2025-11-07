import { NextRequest, NextResponse } from 'next/server'
import { collections, query, getById } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    let bookingsRef: any = collections.bookings().where('user_id', '==', user.id)

    if (status) {
      bookingsRef = bookingsRef.where('status', '==', status)
    }

    // Try to get bookings with ordering, fallback to unordered if index doesn't exist
    let bookings: any[] = []
    try {
      bookings = await query(bookingsRef.orderBy('created_at', 'desc'))
    } catch (indexError: any) {
      // If composite index doesn't exist, get bookings without ordering
      console.warn('Composite index not found, fetching without ordering:', indexError.message)
      bookings = await query(bookingsRef)
      // Sort in memory instead
      bookings.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })
    }

    // Join with equipment data
    const bookingsWithEquipment = await Promise.all(
      bookings.map(async (booking: any) => {
        const equipment = await getById('equipment', booking.equipment_id)
        return {
          ...booking,
          equipment_name: equipment?.name || 'Unknown Equipment',
          category: equipment?.category || '',
          image_url: equipment?.image_url || '',
        }
      })
    )

    return NextResponse.json({ bookings: bookingsWithEquipment })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get my bookings error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
