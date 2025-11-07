"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LandingNavbar from "@/components/landing-navbar"
import PendingRequestsTable from "@/components/pending-requests-table"
import RequestDetailModal from "@/components/request-detail-modal"

interface PendingRequest {
  id: string
  equipment: string
  user: string
  userEmail: string
  requestDate: string
  startDate: string
  endDate: string
  purpose: string
  notes: string
  priority: "low" | "medium" | "high"
  userRole: "student" | "faculty"
}

export default function PendingRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null)
  const [sortBy, setSortBy] = useState("date")

  const pendingRequests: PendingRequest[] = [
    {
      id: "PR001",
      equipment: "Projector - Sony VPL-FHZ90",
      user: "John Smith",
      userEmail: "john@university.edu",
      requestDate: "2025-11-07",
      startDate: "2025-11-15",
      endDate: "2025-11-17",
      purpose: "Class Presentation",
      notes: "Will be used for undergraduate lecture on digital marketing",
      priority: "medium",
      userRole: "faculty",
    },
    {
      id: "PR002",
      equipment: "Laptop - MacBook Pro 16",
      user: "Sarah Johnson",
      userEmail: "sarah@university.edu",
      requestDate: "2025-11-06",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      purpose: "Research Project",
      notes: "Needed for data analysis and video editing for thesis project",
      priority: "high",
      userRole: "student",
    },
    {
      id: "PR003",
      equipment: "Camera - Canon EOS R5",
      user: "Mike Davis",
      userEmail: "mike@university.edu",
      requestDate: "2025-11-05",
      startDate: "2025-11-20",
      endDate: "2025-11-25",
      purpose: "Event Coverage",
      notes: "Covering university annual gala and networking event",
      priority: "medium",
      userRole: "student",
    },
    {
      id: "PR004",
      equipment: "Drone - DJI Air 3",
      user: "Emily Wilson",
      userEmail: "emily@university.edu",
      requestDate: "2025-11-08",
      startDate: "2025-11-12",
      endDate: "2025-11-14",
      purpose: "Aerial Photography",
      notes: "Campus documentation for annual report photography",
      priority: "low",
      userRole: "faculty",
    },
  ]

  const stats = [
    { label: "Pending Requests", value: pendingRequests.length, color: "#37322F" },
    { label: "High Priority", value: "1", color: "#D97706" },
    { label: "Average Wait Time", value: "2.3 days", color: "#059669" },
  ]

  const [userRole] = useState<"student" | "faculty">("faculty")

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
        <PendingRequestsTable requests={pendingRequests} onRequestSelect={setSelectedRequest} sortBy={sortBy} />
      </main>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => {
            alert("Request approved!")
            setSelectedRequest(null)
          }}
          onReject={() => {
            alert("Request rejected!")
            setSelectedRequest(null)
          }}
        />
      )}
    </div>
  )
}
