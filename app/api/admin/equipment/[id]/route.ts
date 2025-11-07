import { NextRequest, NextResponse } from 'next/server'
import { collections, getById, update, deleteDoc } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole('admin')(request)
    const { id } = params
    const body = await request.json()

    const equipment = await getById('equipment', id)
    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    }

    await update('equipment', id, {
      name: body.name || equipment.name,
      category: body.category || equipment.category,
      description: body.description !== undefined ? body.description : equipment.description,
      quantity: body.quantity !== undefined ? parseInt(body.quantity) : equipment.quantity,
      image_url: body.image_url !== undefined ? body.image_url : equipment.image_url,
      is_available: body.is_available !== undefined ? body.is_available : equipment.is_available,
    })

    const updatedEquipment = await getById('equipment', id)

    return NextResponse.json({ equipment: updatedEquipment })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Update equipment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole('admin')(request)
    const { id } = params

    const equipment = await getById('equipment', id)
    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    }

    await deleteDoc('equipment', id)

    return NextResponse.json({ message: 'Equipment deleted successfully' })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Delete equipment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

