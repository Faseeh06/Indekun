"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import BookingDetailModal from "@/components/booking-detail-modal"

interface Booking {
  id: string
  equipment: string
  category: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: "active" | "pending" | "completed" | "cancelled"
  location: string
  purpose: string
  bookedDate: string
  pickupInstructions: string
  equipmentCondition: "excellent" | "good" | "fair"
}

interface BookingsListProps {
  statusFilter: string
  sortBy: string
}

export default function BookingsList({ statusFilter, sortBy }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const bookings: Booking[] = [
    {
      id: "B001",
      equipment: "Projector - Sony VPL-FHZ90",
      category: "Audio/Visual",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      startTime: "09:00",
      endTime: "17:00",
      status: "active",
      location: "Room 101, Tech Lab",
      purpose: "Class Presentation",
      bookedDate: "2025-11-05",
      pickupInstructions: "Available at Tech Lab A front desk",
      equipmentCondition: "excellent",
    },
    {
      id: "B002",
      equipment: "Laptop - MacBook Pro 16",
      category: "Computers",
      startDate: "2025-11-08",
      endDate: "2025-11-09",
      startTime: "10:00",
      endTime: "16:00",
      status: "pending",
      location: "Tech Lab B",
      purpose: "Project Work",
      bookedDate: "2025-11-06",
      pickupInstructions: "Please arrive 15 minutes early for device handoff",
      equipmentCondition: "excellent",
    },
    {
      id: "B003",
      equipment: "Camera - Canon EOS R5",
      category: "Photography",
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      startTime: "13:00",
      endTime: "18:00",
      status: "completed",
      location: "Media Center",
      purpose: "Documentary Shoot",
      bookedDate: "2025-11-01",
      pickupInstructions: "Available in equipment cage, requires ID",
      equipmentCondition: "excellent",
    },
    {
      id: "B004",
      equipment: "Microphone - Shure SM7B",
      category: "Audio",
      startDate: "2025-10-28",
      endDate: "2025-10-30",
      startTime: "10:00",
      endTime: "17:00",
      status: "completed",
      location: "Recording Studio",
      purpose: "Podcast Recording",
      bookedDate: "2025-10-20",
      pickupInstructions: "Sign out at studio reception",
      equipmentCondition: "good",
    },
    {
      id: "B005",
      equipment: "Monitor - LG UltraWide 38",
      category: "Computers",
      startDate: "2025-11-15",
      endDate: "2025-11-20",
      startTime: "08:00",
      endTime: "17:00",
      status: "pending",
      location: "Tech Lab C",
      purpose: "Research Project",
      bookedDate: "2025-11-07",
      pickupInstructions: "Requires IT department approval before pickup",
      equipmentCondition: "excellent",
    },
  ]

  // Filter bookings
  let filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true
    return booking.status === statusFilter
  })

  // Sort bookings
  filteredBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.bookedDate).getTime() - new Date(a.bookedDate).getTime()
      case "upcoming":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      case "ending-soon":
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTimeRemaining = (endDate: string, endTime: string) => {
    const end = new Date(`${endDate}T${endTime}`)
    const now = new Date()
    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  return (
    <>
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{booking.equipment}</h3>
                        <p className="text-sm text-slate-500">{booking.category}</p>
                      </div>
                      <Badge className={`whitespace-nowrap ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-slate-500">Start Date</p>
                        <p className="font-medium text-slate-900">{booking.startDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">End Date</p>
                        <p className="font-medium text-slate-900">{booking.endDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Time</p>
                        <p className="font-medium text-slate-900">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Purpose</p>
                        <p className="font-medium text-slate-900">{booking.purpose}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <p className="text-slate-500">📍 {booking.location}</p>
                    </div>
                  </div>

                  {/* Right Content - Time Remaining */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Time remaining</p>
                      <p
                        className={`font-semibold text-lg ${
                          booking.status === "active"
                            ? getTimeRemaining(booking.endDate, booking.endTime).includes("Overdue")
                              ? "text-red-600"
                              : "text-green-600"
                            : "text-slate-900"
                        }`}
                      >
                        {booking.status === "active"
                          ? getTimeRemaining(booking.endDate, booking.endTime)
                          : booking.status === "pending"
                            ? "Awaiting approval"
                            : "N/A"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBooking(booking)
                        }}
                      >
                        View Details
                      </Button>
                      {booking.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle cancellation
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-slate-600 text-lg">No bookings found</p>
              <p className="text-slate-500 text-sm mt-1">Create a new booking to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </>
  )
}
