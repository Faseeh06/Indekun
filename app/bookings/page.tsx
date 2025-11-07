"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import LandingNavbar from "@/components/landing-navbar"
import BookingsList from "@/components/bookings-list"
import BookingFilters from "@/components/booking-filters"
import { bookingApi } from "@/lib/api"

export default function BookingsPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"student" | "faculty">("student")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("userRole")
    
    if (!storedUser || !storedRole) {
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(storedUser)
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "student" || user.role === "faculty") {
        setUserRole(user.role)
      } else {
        router.push("/login")
      }
    } catch {
      localStorage.clear()
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    loadBookings()
  }, [statusFilter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError("")
      const status = statusFilter === "all" ? undefined : statusFilter
      const response = await bookingApi.getMy(status)
      setBookings(response.bookings || [])
    } catch (err: any) {
      console.error("Error loading bookings:", err)
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      {/* Navigation */}
      <div className="relative">
        <LandingNavbar brandLabel="Indekun" brandHref="/" userRole={userRole} rightButtonLabel="Logout" />
      </div>

      {/* Main Content */}
      <main className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[#37322F] text-3xl md:text-4xl font-serif font-normal leading-tight mb-2">
              My Bookings
            </h1>
            <p className="text-[#605A57] font-sans text-sm md:text-base leading-relaxed">
              View and manage your equipment bookings
            </p>
          </div>
          <Link href="/bookings/new">
            <Button className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)]">
              New Booking
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
        </div>

        {/* Bookings List */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
            <Button onClick={loadBookings} variant="outline" className="ml-4">
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#605A57] text-lg font-sans">Loading bookings...</p>
          </div>
        ) : (
          <BookingsList bookings={bookings} onRefresh={loadBookings} />
        )}
      </main>
    </div>
  )
}
