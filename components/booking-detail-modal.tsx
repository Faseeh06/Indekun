"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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

interface BookingDetailModalProps {
  booking: Booking
  onClose: () => void
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{booking.equipment}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Booking ID: {booking.id}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-xl">
              ✕
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status */}
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Status</p>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Category</p>
                <p className="text-slate-900 font-medium mt-1">{booking.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Start Date & Time</p>
                <p className="text-slate-900 font-medium mt-1">
                  {booking.startDate} at {booking.startTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">End Date & Time</p>
                <p className="text-slate-900 font-medium mt-1">
                  {booking.endDate} at {booking.endTime}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Purpose</p>
                <p className="text-slate-900 font-medium mt-1">{booking.purpose}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Condition</p>
                <p className="text-slate-900 font-medium mt-1 capitalize">{booking.equipmentCondition}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Booked On</p>
                <p className="text-slate-900 font-medium mt-1">{booking.bookedDate}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Location</p>
            <p className="text-slate-900 font-medium mt-1">📍 {booking.location}</p>
          </div>

          {/* Pickup Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 uppercase mb-2">Pickup Instructions</p>
            <p className="text-blue-800 text-sm">{booking.pickupInstructions}</p>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-900 uppercase mb-2">Important</p>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Please arrive on time for pickup and return</li>
              <li>• Equipment must be in good condition upon return</li>
              <li>• Report any damage immediately to the equipment office</li>
              <li>• Late returns may incur additional charges</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {booking.status === "active" && (
            <>
              <Button variant="outline" className="text-orange-600 hover:text-orange-700 bg-transparent">
                Extend Booking
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">Cancel Booking</Button>
            </>
          )}
          {booking.status === "pending" && <Button className="bg-blue-600 hover:bg-blue-700">View Status</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
