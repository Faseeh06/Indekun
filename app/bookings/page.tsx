"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LandingNavbar from "@/components/landing-navbar"
import BookingsList from "@/components/bookings-list"
import BookingFilters from "@/components/booking-filters"

export default function BookingsPage() {
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("student")

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("userRole") as "student" | "faculty" | "admin" | null
    if (storedRole && (storedRole === "student" || storedRole === "faculty" || storedRole === "admin")) {
      setUserRole(storedRole)
    }
  }, [])
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const stats = [
    { label: "Active Bookings", value: "2", color: "text-[#37322F]" },
    { label: "Pending Approval", value: "1", color: "text-[#605A57]" },
    { label: "Completed", value: "8", color: "text-[#37322F]" },
    { label: "Cancelled", value: "0", color: "text-[#828387]" },
  ]

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
              View and manage all your equipment bookings
            </p>
          </div>
          <Link href="/bookings/new">
            <Button className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)]">
              Create New Booking
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6"
            >
              <p className="text-[#605A57] text-sm font-medium font-sans">{stat.label}</p>
              <p className={`text-3xl font-semibold mt-2 font-sans ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Bookings List */}
        <BookingsList statusFilter={statusFilter} sortBy={sortBy} />
      </main>
    </div>
  )
}
