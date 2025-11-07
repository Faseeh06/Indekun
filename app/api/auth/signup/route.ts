import { NextRequest, NextResponse } from 'next/server'
import { getAuthAdmin } from '@/lib/firebase-admin'
import { collections, create } from '@/lib/db'
import { UserRole } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await collections.users().where('email', '==', email).limit(1).get()
    if (!existingUsers.empty) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Validate role
    const validRole: UserRole = role && ['student', 'faculty', 'admin'].includes(role) ? role : 'student'

    const auth = getAuthAdmin()

    try {
      // Create user in Firebase Auth
      const firebaseUser = await auth.createUser({
        email,
        password,
        displayName: name,
      })

      // Create user document in Firestore
      const userId = await create('users', {
        name,
        email,
        role: validRole,
        firebase_uid: firebaseUser.uid,
      })

      // Get the created user
      const userDoc = await collections.users().doc(userId).get()
      const userData = userDoc.data()

      // Create custom token
      const customToken = await auth.createCustomToken(firebaseUser.uid)

      const user = {
        id: userId,
        name: userData?.name,
        email: userData?.email,
        role: userData?.role,
        created_at: userData?.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: userData?.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      }

      return NextResponse.json(
        {
          token: customToken,
          user,
        },
        { status: 201 }
      )
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
