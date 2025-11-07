import { NextRequest, NextResponse } from 'next/server'
import { collections, query } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()(request)

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let equipmentRef: any = collections.equipment().where('is_available', '==', true)

    if (category) {
      equipmentRef = equipmentRef.where('category', '==', category)
    }

    const equipment = await query(equipmentRef)

    // Filter by search term if provided (Firestore doesn't support full-text search easily)
    let filteredEquipment = equipment
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEquipment = equipment.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      )
    }

    // Sort by name
    filteredEquipment.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

    console.log(`[Equipment API] Returning ${filteredEquipment.length} items`)
    return NextResponse.json({ equipment: filteredEquipment })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get equipment error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
