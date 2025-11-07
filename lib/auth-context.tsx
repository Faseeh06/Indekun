'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase-client'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'faculty' | 'admin'
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    if (!firebaseUser) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const idToken = await firebaseUser.getIdToken()
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.name)
      } else {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        await refreshUser()
      } else {
        setUser(null)
        setLoading(false)
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        localStorage.removeItem('idToken')
      }
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
      localStorage.clear()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

