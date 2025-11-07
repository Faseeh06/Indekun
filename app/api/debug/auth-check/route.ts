import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth'
import { collections } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'No auth header',
        headers: Object.fromEntries(request.headers.entries())
      }, { status: 401 })
    }

    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Invalid auth header format',
        authHeader 
      }, { status: 401 })
    }

    const idToken = authHeader.substring(7)
    
    if (!idToken) {
      return NextResponse.json({ 
        error: 'No token in header',
        authHeader 
      }, { status: 401 })
    }

    // Verify token
    const decodedToken = await verifyIdToken(idToken)
    
    if (!decodedToken) {
      return NextResponse.json({ 
        error: 'Token verification failed',
        tokenLength: idToken.length 
      }, { status: 401 })
    }

    // Try to find user by firebase_uid
    const usersSnapshot = await collections.users().where('firebase_uid', '==', decodedToken.uid).limit(1).get()
    
    return NextResponse.json({
      success: true,
      decodedToken: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
      userFound: !usersSnapshot.empty,
      userCount: usersSnapshot.size,
      userData: usersSnapshot.empty ? null : {
        id: usersSnapshot.docs[0].id,
        ...usersSnapshot.docs[0].data()
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Exception occurred',
      message: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

