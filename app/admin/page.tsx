"use client"

import { useState, useEffect } from "react"
import LandingNavbar from "@/components/landing-navbar"
import AdminStats from "@/components/admin-stats"
import AdminTabs from "@/components/admin-tabs"

export default function AdminPage() {
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("admin")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("userRole") as "student" | "faculty" | "admin" | null
    if (storedRole && (storedRole === "student" || storedRole === "faculty" || storedRole === "admin")) {
      setUserRole(storedRole)
    }
  }, [])

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
            Admin Dashboard
          </h1>
          <p className="text-[#605A57] font-sans text-base md:text-lg leading-relaxed">
            Manage equipment, bookings, and users
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <AdminStats />
        </div>

        {/* Tabs Section */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  )
}
