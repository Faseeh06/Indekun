"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LandingNavbar from "@/components/landing-navbar"

interface AuditLog {
  id: string
  timestamp: string
  action:
    | "booking_created"
    | "booking_approved"
    | "booking_rejected"
    | "booking_completed"
    | "booking_cancelled"
    | "equipment_damaged"
  user: string
  userEmail: string
  equipment: string
  details: string
  status: "success" | "warning" | "error"
  adminNotes?: string
}

export default function BookingHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const auditLogs: AuditLog[] = [
    {
      id: "AL001",
      timestamp: "2025-11-08 14:32:00",
      action: "booking_completed",
      user: "John Smith",
      userEmail: "john@university.edu",
      equipment: "Projector - Sony VPL-FHZ90",
      details: "Booking completed. Equipment returned in good condition.",
      status: "success",
      adminNotes: "No issues reported",
    },
    {
      id: "AL002",
      timestamp: "2025-11-08 10:15:00",
      action: "booking_approved",
      user: "Sarah Johnson",
      userEmail: "sarah@university.edu",
      equipment: "Laptop - MacBook Pro 16",
      details: "Booking request approved by admin. Ready for pickup.",
      status: "success",
      adminNotes: "Approved for research project",
    },
    {
      id: "AL003",
      timestamp: "2025-11-07 16:45:00",
      action: "equipment_damaged",
      user: "Mike Davis",
      userEmail: "mike@university.edu",
      equipment: "Camera - Canon EOS R5",
      details: "Equipment returned with minor damage to lens cap.",
      status: "warning",
      adminNotes: "Minor damage, within acceptable wear. No charge applied.",
    },
    {
      id: "AL004",
      timestamp: "2025-11-07 09:20:00",
      action: "booking_rejected",
      user: "Emily Wilson",
      userEmail: "emily@university.edu",
      equipment: "Drone - DJI Air 3",
      details: "Booking request rejected due to conflicting reservation.",
      status: "error",
      adminNotes: "Equipment already booked during requested dates",
    },
    {
      id: "AL005",
      timestamp: "2025-11-06 15:30:00",
      action: "booking_created",
      user: "David Brown",
      userEmail: "david@university.edu",
      equipment: "Microphone - Shure SM7B",
      details: "New booking request created. Pending review.",
      status: "success",
      adminNotes: "Awaiting approval",
    },
    {
      id: "AL006",
      timestamp: "2025-11-05 11:00:00",
      action: "booking_cancelled",
      user: "Lisa Anderson",
      userEmail: "lisa@university.edu",
      equipment: "Monitor - LG UltraWide 38",
      details: "Booking cancelled by user. No reason provided.",
      status: "success",
      adminNotes: "User self-cancelled",
    },
  ]

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesStatus = filterStatus === "all" || log.status === filterStatus

    return matchesSearch && matchesAction && matchesStatus
  })

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      booking_created: "Booking Created",
      booking_approved: "Booking Approved",
      booking_rejected: "Booking Rejected",
      booking_completed: "Booking Completed",
      booking_cancelled: "Booking Cancelled",
      equipment_damaged: "Equipment Damaged",
    }
    return labels[action] || action
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
      case "warning":
        return "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
      case "error":
        return "bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]"
      default:
        return "bg-[#F0F0F0] text-[#555555] border border-[#E0E0E0]"
    }
  }

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
              Booking History & Audit Logs
            </h1>
            <p className="text-[#605A57] font-sans text-sm md:text-base leading-relaxed">
              Complete activity log of all bookings and system events
            </p>
          </div>
          <Link href="/admin">
            <Button className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)]">
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
            <p className="text-[#605A57] text-sm font-medium font-sans mb-3">Total Logs</p>
            <p className="text-3xl md:text-4xl font-semibold text-[#37322F] font-serif">{auditLogs.length}</p>
          </div>
          <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
            <p className="text-[#605A57] text-sm font-medium font-sans mb-3">Completed</p>
            <p className="text-3xl md:text-4xl font-semibold text-[#37322F] font-serif">
              {auditLogs.filter((l) => l.status === "success").length}
            </p>
          </div>
          <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
            <p className="text-[#605A57] text-sm font-medium font-sans mb-3">Warnings</p>
            <p className="text-3xl md:text-4xl font-semibold text-[#37322F] font-serif">
              {auditLogs.filter((l) => l.status === "warning").length}
            </p>
          </div>
          <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
            <p className="text-[#605A57] text-sm font-medium font-sans mb-3">Issues</p>
            <p className="text-3xl md:text-4xl font-semibold text-[#37322F] font-serif">
              {auditLogs.filter((l) => l.status === "error").length}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Search by user, email, or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2.5 border border-[#E0DEDB] rounded-lg bg-white text-[#37322F] text-sm font-medium hover:border-[#D4CFCA] focus:outline-none focus:ring-2 focus:ring-[#37322F] font-sans"
            >
              <option value="all">All Actions</option>
              <option value="booking_created">Booking Created</option>
              <option value="booking_approved">Booking Approved</option>
              <option value="booking_rejected">Booking Rejected</option>
              <option value="booking_completed">Booking Completed</option>
              <option value="booking_cancelled">Booking Cancelled</option>
              <option value="equipment_damaged">Equipment Damaged</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-[#E0DEDB] rounded-lg bg-white text-[#37322F] text-sm font-medium hover:border-[#D4CFCA] focus:outline-none focus:ring-2 focus:ring-[#37322F] font-sans"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">Equipment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322F] font-sans">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#E0DEDB] hover:bg-[#F7F5F3] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans font-mono">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-[#37322F] font-sans font-semibold">
                    {getActionLabel(log.action)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#37322F] font-sans">{log.user}</p>
                      <p className="text-xs text-[#828387] font-sans">{log.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{log.equipment}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-sans ${getStatusColor(log.status)}`}
                    >
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB]">
            <p className="text-[#605A57] text-lg font-sans">No audit logs found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
