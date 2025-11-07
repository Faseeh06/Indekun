"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  userRole: "student" | "faculty"
}

export default function DashboardHeader({ userRole }: DashboardHeaderProps) {
  return (
    <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3] sticky top-0 z-40">
      <div className="max-w-[1060px] mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-[#37322f] font-semibold text-lg">
              Indekun
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/equipment" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                Equipment
              </Link>
              <Link href="/bookings" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                My Bookings
              </Link>
              {userRole === "faculty" && (
                <Link href="/admin" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-[#37322f] hover:text-[#37322f]/80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#37322f] rounded-full"></span>
            </button>

            <Button variant="ghost" size="sm" className="text-[#37322f] hover:text-[#37322f]/80 hover:bg-[#37322f]/5">
              Profile
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
