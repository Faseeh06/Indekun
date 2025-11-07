import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

// Firebase configuration - these should be in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined

if (typeof window !== 'undefined') {
  try {
    // Only initialize on client side
    if (getApps().length === 0) {
      // Check if config is valid
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig)
      } else {
        console.warn('Firebase config is missing. Please set NEXT_PUBLIC_FIREBASE_* environment variables.')
      }
    } else {
      app = getApps()[0]
    }
    
    if (app) {
      auth = getAuth(app)
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export { auth }

