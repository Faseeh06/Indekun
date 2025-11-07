"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { bookingApi } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  equipment_name: string
  start_time: string
  end_time: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  purpose: string
  priority: "low" | "medium" | "high"
}

export default function BookingsOverview() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await bookingApi.getMy()
      setBookings(response.bookings || [])
    } catch (err: any) {
      console.error("Error loading bookings:", err)
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
      case "PENDING":
        return "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
      case "REJECTED":
        return "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]"
      case "CANCELLED":
        return "bg-[#F5F5F5] text-[#424242] border-[#BDBDBD]"
      default:
        return "bg-[#F5F5F5] text-[#424242] border-[#BDBDBD]"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return ""
    }
  }

  if (loading) {
    return (
      <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-[#37322F] font-serif">Your Bookings</CardTitle>
          <CardDescription className="text-[#605A57]">Loading your bookings...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-[#37322F] font-serif">Your Bookings</CardTitle>
          <CardDescription className="text-[#605A57]">Error loading bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
          <Button onClick={loadBookings} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#37322F] font-serif">Your Bookings</CardTitle>
            <CardDescription className="text-[#605A57]">Recent and upcoming equipment bookings</CardDescription>
          </div>
          <Link href="/bookings">
            <Button variant="outline" className="text-sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#605A57] mb-4">You don't have any bookings yet.</p>
            <Link href="/bookings/new">
              <Button className="bg-[#37322F] hover:bg-[#2a2420] text-white">
                Create Booking
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-start justify-between p-4 bg-[#F7F5F3] rounded-lg border border-[#E0DEDB] hover:border-[#605A57] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#37322F]">{booking.equipment_name}</h3>
                  <div className="flex items-center text-sm text-[#605A57] mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(booking.start_time)} - {formatDate(booking.end_time)}
                  </div>
                  <div className="flex items-center text-sm text-[#605A57] mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </div>
                  {booking.purpose && (
                    <p className="text-sm text-[#605A57] mt-2">{booking.purpose}</p>
                  )}
                </div>
                <Badge variant="outline" className={`ml-4 whitespace-nowrap border ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
