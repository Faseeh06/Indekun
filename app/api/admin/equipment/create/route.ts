import { NextRequest, NextResponse } from 'next/server'
import { collections, create } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await requireRole('admin')(request)
    const body = await request.json()
    const { name, category, description, quantity, image_url } = body

    if (!name || !category || !quantity) {
      return NextResponse.json({ error: 'Name, category, and quantity are required' }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    const equipmentId = await create('equipment', {
      name,
      category,
      description: description || null,
      quantity: parseInt(quantity),
      image_url: image_url || null,
      is_available: true,
    })

    const equipment = await collections.equipment().doc(equipmentId).get()
    const equipmentData = equipment.data()

    return NextResponse.json(
      {
        equipment: {
          id: equipmentId,
          ...equipmentData,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Create equipment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

