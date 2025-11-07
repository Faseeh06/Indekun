"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api"

export default function AdminBookingsManagement() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadBookings()
  }, [statusFilter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const status = statusFilter !== "all" ? statusFilter : undefined
      const res = await adminApi.getAllBookings(status)
      setBookings(res.bookings || [])
    } catch (error) {
      console.error("Error loading bookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDateRange = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime)
      const end = new Date(endTime)
      const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      return `${startStr} - ${endStr}`
    } catch {
      return "Invalid dates"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "active"
      case "PENDING":
        return "pending"
      case "REJECTED":
      case "CANCELLED":
        return "completed"
      default:
        return status.toLowerCase()
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
          <div className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#37322F] font-sans">All Bookings</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-[#E0DEDB] rounded-lg bg-white text-[#37322F] text-sm font-medium hover:border-[#D4CFCA] focus:outline-none focus:ring-2 focus:ring-[#37322F] font-sans"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Booking ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Dates</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DEDB]">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#605A57] font-sans">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F7F5F3]">
                  <td className="px-6 py-4 text-sm font-mono text-[#37322F] font-sans">{booking.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-[#37322F] font-medium font-sans">
                    {booking.equipment_name || "Unknown Equipment"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{booking.user_name || "Unknown User"}</td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans">
                    {formatDateRange(booking.start_time, booking.end_time)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium font-sans ${
                        booking.status === "APPROVED"
                          ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                          : booking.status === "PENDING"
                            ? "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                            : "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                      }`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => router.push(`/admin/pending-requests`)}
                      className="text-[#37322F] hover:text-[#2a2420] font-medium font-sans"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
