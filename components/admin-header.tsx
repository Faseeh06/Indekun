"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold text-slate-900 hidden sm:inline">Admin</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Overview
              </Link>
              <Link href="/admin/equipment" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Equipment
              </Link>
              <Link href="/admin/bookings" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Bookings
              </Link>
              <Link href="/admin/users" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Users
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
