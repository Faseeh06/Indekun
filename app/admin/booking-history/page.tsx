"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LandingNavbar from "@/components/landing-navbar"
import { adminApi } from "@/lib/api"

interface AuditLog {
  id: string
  timestamp: string
  action: string
  user: string
  userEmail: string
  equipment: string
  details: string
  status: "success" | "warning" | "error"
  adminNotes?: string
}

export default function BookingHistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
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
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const res = await adminApi.getLogs(100, 0)
      // Transform audit logs to match our interface
      const logs = (res.logs || []).map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString() : "Unknown",
        action: log.action || "unknown",
        user: log.user_name || "Unknown",
        userEmail: log.user_email || "",
        equipment: log.equipment_name || "Unknown Equipment",
        details: log.details || "",
        status: determineStatus(log.action),
        adminNotes: log.admin_notes,
      }))
      setAuditLogs(logs)
    } catch (error) {
      console.error("Error loading audit logs:", error)
      setAuditLogs([])
    } finally {
      setLoading(false)
    }
  }

  const determineStatus = (action: string): "success" | "warning" | "error" => {
    if (action.includes("approved") || action.includes("completed") || action.includes("created")) {
      return "success"
    }
    if (action.includes("rejected") || action.includes("cancelled")) {
      return "error"
    }
    if (action.includes("damaged") || action.includes("warning")) {
      return "warning"
    }
    return "success"
  }

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
    return labels[action] || action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
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
        {loading ? (
          <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] p-6">
            <p className="text-[#605A57] font-sans">Loading audit logs...</p>
          </div>
        ) : (
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
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#605A57] font-sans">
                      No audit logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
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
                  ))
                )}
            </tbody>
          </table>
          </div>
        )}
      </main>
    </div>
  )
}
