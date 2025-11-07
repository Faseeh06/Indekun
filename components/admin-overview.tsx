"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api"

export default function AdminOverview() {
  const router = useRouter()
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecentBookings = async () => {
      try {
        setLoading(true)
        // Get pending bookings (most recent)
        const res = await adminApi.getPendingBookings()
        const bookings = res.bookings || []
        // Get recent bookings (last 5)
        setRecentBookings(bookings.slice(0, 5))
      } catch (error) {
        console.error("Error loading recent bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    loadRecentBookings()
  }, [])

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Recent Bookings */}
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
        <div className="mb-4">
          <h3 className="text-[#37322F] text-lg font-normal mb-1 font-serif">Recent Bookings</h3>
          <p className="text-[#605A57] text-sm font-sans">Latest booking requests</p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-[#F7F5F3] rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-[#605A57] font-sans">No recent bookings</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-[#F7F5F3] rounded-lg border border-[#E0DEDB]"
              >
                <div>
                  <p className="font-medium text-[#37322F] font-sans">{booking.equipment_name || "Unknown Equipment"}</p>
                  <p className="text-sm text-[#605A57] font-sans">
                    {booking.user_name || "Unknown User"} • {formatDate(booking.start_time)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium font-sans ${
                      booking.status === "APPROVED"
                        ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                        : booking.status === "PENDING"
                          ? "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                          : "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                    }`}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin/pending-requests")}
                    className="border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
        <div className="mb-4">
          <h3 className="text-[#37322F] text-lg font-normal mb-1 font-serif">Quick Actions</h3>
          <p className="text-[#605A57] text-sm font-sans">Common administrative tasks</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => router.push("/admin/pending-requests")}
            className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans"
          >
            Review Pending Requests
          </Button>
          <Button
            onClick={() => router.push("/admin")}
            className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans"
          >
            Manage Equipment
          </Button>
        </div>
      </div>
    </div>
  )
}
