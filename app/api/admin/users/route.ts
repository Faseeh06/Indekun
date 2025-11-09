import { NextRequest, NextResponse } from 'next/server'
import { collections, query } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')(request)

    // Get all users, excluding admins, ordered by created_at
    let users: any[] = []
    try {
      // Fetch users with role != 'admin'
      users = await query(collections.users().where('role', '!=', 'admin').orderBy('created_at', 'desc'))
    } catch (indexError: any) {
      console.warn('Composite index not found for users, fetching without ordering')
      // If composite index doesn't exist, fetch all and filter in memory
      const allUsers = await query(collections.users())
      // Filter out admins and sort
      users = allUsers
        .filter((user: any) => user.role !== 'admin')
        .sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
    }

    return NextResponse.json({ users })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Get users error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

