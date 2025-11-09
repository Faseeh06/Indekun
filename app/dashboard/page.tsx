"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import LandingNavbar from "@/components/landing-navbar"
import BookingsOverview from "@/components/bookings-overview"
import UpcomingBookings from "@/components/upcoming-bookings"
import QuickStats from "@/components/quick-stats"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("student")

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("userRole")
    
    if (!storedUser || !storedRole) {
      // Not logged in, redirect to login
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(storedUser)
      if (user.role === "student" || user.role === "faculty" || user.role === "admin") {
        setUserRole(user.role)
      } else {
        router.push("/login")
      }
    } catch {
      // Invalid user data
      localStorage.clear()
      router.push("/login")
    }
  }, [router])

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      {/* Navigation */}
      <div className="relative">
        <LandingNavbar brandLabel="Indekun" brandHref="/" userRole={userRole} rightButtonLabel="Logout" />
      </div>

      {/* Main Content */}
      <main className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-[#37322F] text-3xl md:text-4xl font-serif font-normal leading-tight mb-2">
            Welcome back!
          </h1>
          <p className="text-[#605A57] font-sans text-base md:text-lg leading-relaxed">
            Here's your equipment booking overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <QuickStats userRole={userRole} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bookings Overview */}
          <div className="lg:col-span-2">
            <BookingsOverview />
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
              <h3 className="text-[#37322F] text-lg font-semibold mb-4 font-sans">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/equipment" className="w-full block">
                  <Button className="w-full justify-start bg-[#37322F] hover:bg-[#2a2420] text-white font-sans font-medium">
                    Browse Equipment
                  </Button>
                </Link>
                <Link href="/bookings/new" className="w-full block">
                  <Button className="w-full justify-start bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium">
                    New Booking
                  </Button>
                </Link>
                {userRole === "admin" && (
                  <Link href="/admin" className="w-full block">
                    <Button className="w-full justify-start bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium">
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <UpcomingBookings />
          </div>
        </div>
      </main>
    </div>
  )
}
