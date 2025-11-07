"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  equipment_name: string
  start_time: string
  end_time: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  purpose: string
  notes?: string
  priority: "low" | "medium" | "high"
  created_at: string
}

interface BookingsListProps {
  bookings: Booking[]
  onRefresh?: () => void
}

export default function BookingsList({ bookings, onRefresh }: BookingsListProps) {
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

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  if (bookings.length === 0) {
    return (
      <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
        <CardContent className="py-12 text-center">
          <p className="text-[#605A57] text-lg mb-4">You don't have any bookings yet.</p>
          <a href="/bookings/new">
            <Button className="bg-[#37322F] hover:bg-[#2a2420] text-white">
              Create Your First Booking
            </Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[#37322F] text-lg">{booking.equipment_name}</h3>
                  <Badge variant="outline" className={`border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                  </Badge>
                  {booking.priority && (
                    <Badge
                      variant="outline"
                      className={`border ${
                        booking.priority === "high"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : booking.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {booking.priority} priority
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-[#605A57]">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
                    </span>
                  </div>
                  {booking.purpose && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>{booking.purpose}</span>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span>{booking.notes}</span>
                    </div>
                  )}
                  <div className="text-xs text-[#828387] mt-2">
                    Requested on {formatDate(booking.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
