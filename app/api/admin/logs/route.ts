import { NextRequest, NextResponse } from 'next/server'
import { collections, query, getById } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')(request)

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get logs ordered by timestamp
    // Note: Firestore doesn't support offset, so we use startAfter for pagination
    let logsRef: any = collections.auditLog().orderBy('timestamp', 'desc').limit(limit)
    
    const logsSnapshot = await logsRef.get()

    const logs = await Promise.all(
      logsSnapshot.docs.map(async (doc) => {
        const logData = doc.data()
        const user = await getById('users', logData.user_id)
        
        // Parse details to extract equipment and user info
        let details = logData.details || ''
        let parsedDetails: any = {}
        try {
          parsedDetails = typeof details === 'string' ? JSON.parse(details) : details
        } catch {
          parsedDetails = { details }
        }

        return {
          id: doc.id,
          ...logData,
          user_name: user?.name || parsedDetails.user_name || 'Unknown',
          user_email: user?.email || parsedDetails.user_email || '',
          equipment_name: parsedDetails.equipment_name || 'Unknown Equipment',
          details: typeof parsedDetails === 'string' ? parsedDetails : JSON.stringify(parsedDetails),
          admin_notes: parsedDetails.admin_notes,
        }
      })
    )

    // Get total count
    const totalSnapshot = await collections.auditLog().count().get()
    const total = totalSnapshot.data().count

    return NextResponse.json({ logs, total })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
    }
    console.error('Get logs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
