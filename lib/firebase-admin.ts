import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'

let app: App | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    app = getApps()[0]
    return app
  }

  // Check if we have service account credentials
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  const projectId = process.env.FIREBASE_PROJECT_ID
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (serviceAccount) {
    // If service account key is provided as JSON string
    try {
      const serviceAccountJson = JSON.parse(serviceAccount)
      app = initializeApp({
        credential: cert(serviceAccountJson),
        projectId: serviceAccountJson.project_id,
      })
    } catch (error) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. It should be a valid JSON string.')
    }
  } else if (privateKey && clientEmail && projectId) {
    // If individual credentials are provided
    const privateKeyFormatted = privateKey.replace(/\\n/g, '\n')
    app = initializeApp({
      credential: cert({
        projectId,
        privateKey: privateKeyFormatted,
        clientEmail,
      }),
      projectId,
    })
  } else {
    // Try to use default credentials (for local development with Firebase CLI)
    try {
      app = initializeApp({
        projectId: projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    } catch (error) {
      throw new Error(
        'Firebase Admin initialization failed. Please provide FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in your environment variables.'
      )
    }
  }

  return app
}

export function getFirestoreAdmin(): Firestore {
  if (!app) {
    app = initializeFirebaseAdmin()
  }
  if (!db) {
    db = getFirestore(app)
  }
  return db
}

export function getAuthAdmin(): Auth {
  if (!app) {
    app = initializeFirebaseAdmin()
  }
  if (!auth) {
    auth = getAuth(app)
  }
  return auth
}

// Don't initialize on module load - let it initialize lazily when first used
// This prevents issues with Next.js client-side bundling

