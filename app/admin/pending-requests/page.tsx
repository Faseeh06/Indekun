"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import LandingNavbar from "@/components/landing-navbar"
import PendingRequestsTable from "@/components/pending-requests-table"
import RequestDetailModal from "@/components/request-detail-modal"
import { adminApi } from "@/lib/api"

interface PendingRequest {
  id: string
  equipment_name: string
  user_name: string
  user_email: string
  user_role: "student" | "faculty"
  start_time: string
  end_time: string
  purpose: string
  notes: string | null
  priority: "low" | "medium" | "high"
  created_at: string
}

export default function PendingRequestsPage() {
  const router = useRouter()
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null)
  const [sortBy, setSortBy] = useState("date")
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<"admin">("admin")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("userRole")
    
    if (!storedUser || !storedRole) {
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(storedUser)
      if (user.role !== "admin") {
        router.push("/dashboard")
      }
    } catch {
      localStorage.clear()
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    loadPendingRequests()
  }, [])

  const loadPendingRequests = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await adminApi.getPendingBookings()
      setPendingRequests(response.bookings || [])
    } catch (err: any) {
      console.error("Error loading pending requests:", err)
      setError(err.message || "Failed to load pending requests")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string, adminNotes?: string) => {
    try {
      await adminApi.updateBooking(requestId, "APPROVED", adminNotes)
      await loadPendingRequests()
      setSelectedRequest(null)
      alert("Booking approved successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to approve booking")
    }
  }

  const handleReject = async (requestId: string, adminNotes?: string) => {
    try {
      await adminApi.updateBooking(requestId, "REJECTED", adminNotes)
      await loadPendingRequests()
      setSelectedRequest(null)
      alert("Booking rejected")
    } catch (err: any) {
      alert(err.message || "Failed to reject booking")
    }
  }

  // Transform for table component
  const transformedRequests = pendingRequests.map((req) => ({
    id: req.id,
    equipment: req.equipment_name,
    user: req.user_name,
    userEmail: req.user_email,
    requestDate: new Date(req.created_at).toISOString().split("T")[0],
    startDate: new Date(req.start_time).toISOString().split("T")[0],
    endDate: new Date(req.end_time).toISOString().split("T")[0],
    purpose: req.purpose,
    notes: req.notes || "",
    priority: req.priority,
    userRole: req.user_role,
  }))

  const stats = [
    { label: "Pending Requests", value: pendingRequests.length, color: "#37322F" },
    {
      label: "High Priority",
      value: pendingRequests.filter((r) => r.priority === "high").length.toString(),
      color: "#D97706",
    },
    { label: "Average Wait Time", value: "2.3 days", color: "#059669" },
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
              Pending Requests
            </h1>
            <p className="text-[#605A57] font-sans text-sm md:text-base leading-relaxed">
              Review and approve booking requests from users
            </p>
          </div>
          <Link href="/admin">
            <Button className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)]">
              Back to Admin
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
            <Button onClick={loadPendingRequests} variant="outline" className="ml-4">
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6"
            >
              <p className="text-[#605A57] text-sm font-medium font-sans mb-3">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-semibold text-[#37322F] font-serif">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-[#E0DEDB] rounded-lg bg-white text-[#37322F] text-sm font-medium hover:border-[#D4CFCA] focus:outline-none focus:ring-2 focus:ring-[#37322F] font-sans"
          >
            <option value="date">Newest First</option>
            <option value="priority">Priority</option>
            <option value="user">User Name</option>
          </select>
        </div>

        {/* Pending Requests Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#605A57] text-lg">Loading pending requests...</p>
          </div>
        ) : (
          <PendingRequestsTable
            requests={transformedRequests}
            onRequestSelect={(req) => {
              const original = pendingRequests.find((r) => r.id === req.id)
              if (original) setSelectedRequest(original)
            }}
            sortBy={sortBy}
          />
        )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
            request={{
              id: selectedRequest.id,
              equipment: selectedRequest.equipment_name,
              user: selectedRequest.user_name,
              userEmail: selectedRequest.user_email,
              requestDate: new Date(selectedRequest.created_at).toISOString().split("T")[0],
              startDate: new Date(selectedRequest.start_time).toISOString().split("T")[0],
              endDate: new Date(selectedRequest.end_time).toISOString().split("T")[0],
              purpose: selectedRequest.purpose,
              notes: selectedRequest.notes || "",
              priority: selectedRequest.priority,
              userRole: selectedRequest.user_role,
            }}
          onClose={() => setSelectedRequest(null)}
            onApprove={(adminNotes) => handleApprove(selectedRequest.id, adminNotes)}
            onReject={(adminNotes) => handleReject(selectedRequest.id, adminNotes)}
        />
      )}
      </main>
    </div>
  )
}
