"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UserRole = "student" | "faculty" | "admin"

const DEMO_CREDENTIALS = {
  student: {
    email: "student@university.edu",
    password: "student123",
  },
  faculty: {
    email: "faculty@university.edu",
    password: "faculty123",
  },
  admin: {
    email: "admin@university.edu",
    password: "admin123",
  },
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("LoginPage useEffect triggered.")
    if (auth) {
      console.log("Auth object exists, subscribing to onAuthStateChanged.")
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log("onAuthStateChanged fired. User:", user ? user.uid : null)
        if (user) {
          const storedRole = localStorage.getItem("userRole")
          console.log("User is authenticated, redirecting. Role:", storedRole)
          if (storedRole === "admin") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        } else {
          console.log("User is not authenticated. Staying on login page.")
        }
      })
      return () => {
        console.log("Cleaning up onAuthStateChanged subscription.")
        unsubscribe()
      }
    } else {
      console.warn("Auth object does not exist on login page.")
    }
  }, [router])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[#605A57]">Loading...</p>
        </div>
      </div>
    )
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setEmail(DEMO_CREDENTIALS[role].email)
    setPassword(DEMO_CREDENTIALS[role].password)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!auth) {
      setError("Firebase is not configured. Please set up Firebase environment variables.")
      setIsLoading(false)
      return
    }

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()

      // Store token
      localStorage.setItem('idToken', idToken)

      // Get user data from API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to login')
      }

      const data = await response.json()
      const user = data.user

      // Store user data
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userName', user.name)

        // Route based on role
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      let errorMessage = 'Invalid email or password'
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute left-4 sm:left-6 md:left-8 lg:left-[50%] lg:transform lg:-translate-x-[530px] top-0 w-[1px] h-full bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>
      <div className="absolute right-4 sm:right-6 md:right-8 lg:right-[50%] lg:transform lg:translate-x-[530px] top-0 w-[1px] h-full bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#37322F] text-4xl md:text-5xl font-serif font-semibold leading-tight mb-2">Indekun</h1>
          <p className="text-[#605A57] text-base md:text-lg font-sans leading-relaxed">
            Campus Equipment Booking System
          </p>
        </div>

        {/* Login Card */}
        <div className="px-6 sm:px-8 py-8 sm:py-10 bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] border border-[#E0DEDB]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#37322F] mb-3 font-sans">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387] disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#37322F] mb-3 font-sans">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387] disabled:opacity-50"
              />
            </div>

            {!auth && (
              <div className="p-3 bg-[#FFF4E6] border border-[#FFD699] rounded-lg text-[#8B4513] text-sm font-sans">
                <p className="font-semibold mb-1">Firebase Not Configured</p>
                <p className="text-xs">Please set NEXT_PUBLIC_FIREBASE_* environment variables. See FIREBASE_SETUP.md for details.</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-[#FFE8E8] border border-[#FFB3B3] rounded-lg text-[#7D2C2C] text-sm font-sans">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#37322F] hover:bg-[#2a2420] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 font-sans disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0DEDB]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#605A57] font-sans">Or</span>
              </div>
            </div>

            {/* SSO Login Button - Placeholder */}
            <Button
              type="button"
              disabled={isLoading}
              className="w-full bg-white border-2 border-[#37322F] text-[#37322F] hover:bg-[#F7F5F3] font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 font-sans disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with SSO (Coming Soon)
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0DEDB]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#605A57] font-sans">Quick fill (demo)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                onClick={() => handleRoleSelect("student")}
                disabled={isLoading}
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium disabled:opacity-50 ${
                  selectedRole === "student"
                    ? "bg-[#37322F] text-white hover:bg-[#2a2420]"
                    : "text-[#37322F] hover:bg-[#F7F5F3] bg-transparent"
                }`}
              >
                Student
              </Button>
              <Button
                type="button"
                onClick={() => handleRoleSelect("faculty")}
                disabled={isLoading}
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium disabled:opacity-50 ${
                  selectedRole === "faculty"
                    ? "bg-[#37322F] text-white hover:bg-[#2a2420]"
                    : "text-[#37322F] hover:bg-[#F7F5F3] bg-transparent"
                }`}
              >
                Faculty
              </Button>
              <Button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                disabled={isLoading}
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium disabled:opacity-50 ${
                  selectedRole === "admin"
                    ? "bg-[#37322F] text-white hover:bg-[#2a2420]"
                    : "text-[#37322F] hover:bg-[#F7F5F3] bg-transparent"
                }`}
              >
                Admin
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4 border-t border-[#E0DEDB] pt-6">
            <p className="text-sm text-[#605A57] font-sans">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#37322F] hover:text-[#2a2420] font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-white border border-[#E0DEDB] rounded-lg shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-semibold text-[#37322F] mb-3 font-sans">Demo Credentials:</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-[#37322F] mb-1 font-sans">Student:</p>
              <p className="text-xs text-[#605A57] font-mono">Email: {DEMO_CREDENTIALS.student.email}</p>
              <p className="text-xs text-[#605A57] font-mono">Password: {DEMO_CREDENTIALS.student.password}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#37322F] mb-1 font-sans">Faculty:</p>
              <p className="text-xs text-[#605A57] font-mono">Email: {DEMO_CREDENTIALS.faculty.email}</p>
              <p className="text-xs text-[#605A57] font-mono">Password: {DEMO_CREDENTIALS.faculty.password}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#37322F] mb-1 font-sans">Admin:</p>
              <p className="text-xs text-[#605A57] font-mono">Email: {DEMO_CREDENTIALS.admin.email}</p>
              <p className="text-xs text-[#605A57] font-mono">Password: {DEMO_CREDENTIALS.admin.password}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
