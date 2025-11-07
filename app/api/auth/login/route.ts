import { NextRequest, NextResponse } from 'next/server'
import { getAuthAdmin } from '@/lib/firebase-admin'
import { collections, getById } from '@/lib/db'
import { verifyIdToken } from '@/lib/auth'
import { User } from '@/lib/types'

/**
 * Note: This endpoint expects an ID token from Firebase Auth.
 * The client should sign in using Firebase Auth SDK first, then send the ID token here.
 * 
 * Alternative flow:
 * 1. Client uses Firebase Auth SDK: signInWithEmailAndPassword(auth, email, password)
 * 2. Client gets ID token: await user.getIdToken()
 * 3. Client sends ID token to this endpoint
 * 4. Server verifies token and returns user data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user from Firestore
    const usersSnapshot = await collections.users().where('firebase_uid', '==', decodedToken.uid).limit(1).get()

    if (usersSnapshot.empty) {
      // Auto-provision a user document on first login
      const displayName = (decodedToken as any).name || (decodedToken.email?.split('@')[0] ?? 'User')
      const email = decodedToken.email || ''

      const newUserRef = await collections.users().add({
        firebase_uid: decodedToken.uid,
        name: displayName,
        email,
        role: 'student',
        created_at: new Date(),
        updated_at: new Date(),
      })

      const newUserSnap = await newUserRef.get()
      const newUserData = newUserSnap.data() || {}

      const user: User = {
        id: newUserRef.id,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        created_at: newUserData.created_at?.toISOString?.() || newUserData.created_at,
        updated_at: newUserData.updated_at?.toISOString?.() || newUserData.updated_at,
      }

      return NextResponse.json({ user })
    }

    const userDoc = usersSnapshot.docs[0]
    const userData = userDoc.data()

    const user: User = {
      id: userDoc.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      created_at: userData.created_at?.toDate?.()?.toISOString() || userData.created_at,
      updated_at: userData.updated_at?.toDate?.()?.toISOString() || userData.updated_at,
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
