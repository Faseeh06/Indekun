import { getAuthAdmin } from './firebase-admin'
import { getById, collections } from './db'
import { User, UserRole } from './types'
import { DecodedIdToken } from 'firebase-admin/auth'

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken | null> {
  try {
    const auth = getAuthAdmin()
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return null
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export async function authenticateRequest(request: Request): Promise<User | null> {
  const token = getTokenFromRequest(request)
  if (!token) {
    console.error('[Auth] No token in request')
    return null
  }

  const decoded = await verifyIdToken(token)
  if (!decoded) {
    console.error('[Auth] Token verification failed')
    return null
  }

  // Find user by firebase_uid field, not by document ID
  const usersSnapshot = await collections.users().where('firebase_uid', '==', decoded.uid).limit(1).get()
  
  if (usersSnapshot.empty) {
    console.error('[Auth] User not found for firebase_uid:', decoded.uid)
    return null
  }

  const userDoc = usersSnapshot.docs[0]
  const userData = userDoc.data()

  return {
    id: userDoc.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  } as User
}

export function requireRole(requiredRole: UserRole) {
  return async (request: Request): Promise<User> => {
    const user = await authenticateRequest(request)
    if (!user) {
      throw new Error('Unauthorized')
    }
    if (user.role !== requiredRole && user.role !== 'admin') {
      throw new Error('Forbidden: Insufficient permissions')
    }
    return user
  }
}

export function requireAuth() {
  return async (request: Request): Promise<User> => {
    const user = await authenticateRequest(request)
    if (!user) {
      throw new Error('Unauthorized')
    }
    return user
  }
}

// Helper to create custom token (for testing or special use cases)
export async function createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
  const auth = getAuthAdmin()
  return auth.createCustomToken(uid, additionalClaims)
}
