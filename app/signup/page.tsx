"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UserRole = "student" | "faculty" | "admin"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!selectedRole) {
      setError("Please select your role")
      return
    }

    setIsLoading(true)

    try {
      // Simulate signup process
      console.log("Signup attempt:", { name, email, password, role: selectedRole })

      // Store user data in localStorage (for demo purposes)
      localStorage.setItem("userRole", selectedRole)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", name)

      // Route based on role
      if (selectedRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
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

        {/* Signup Card */}
        <div className="px-6 sm:px-8 py-8 sm:py-10 bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] border border-[#E0DEDB]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#37322F] mb-3 font-sans">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387]"
              />
            </div>

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
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387]"
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
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#37322F] mb-3 font-sans">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387]"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#FFE8E8] border border-[#FFB3B3] rounded-lg text-[#7D2C2C] text-sm font-sans">
                {error}
              </div>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0DEDB]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#605A57] font-sans">Select your role</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium ${
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
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium ${
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
                className={`border border-[#E0DEDB] py-2.5 px-3 rounded-lg transition-colors font-sans font-medium ${
                  selectedRole === "admin"
                    ? "bg-[#37322F] text-white hover:bg-[#2a2420]"
                    : "text-[#37322F] hover:bg-[#F7F5F3] bg-transparent"
                }`}
              >
                Admin
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#37322F] hover:bg-[#2a2420] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 font-sans"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2 border-t border-[#E0DEDB] pt-6">
            <p className="text-sm text-[#605A57] font-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-[#37322F] hover:text-[#2a2420] font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

