"use client"

import { useEffect, useState } from "react"
import { adminApi, equipmentApi } from "@/lib/api"

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeBookings: 0,
    pendingApprovals: 0,
    systemUsers: 0,
    equipmentIssues: 0,
    overdueReturns: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        // Load equipment count
        const equipmentRes = await equipmentApi.getAll()
        const equipment = equipmentRes.equipment || []
        const totalEquipment = equipment.length
        const equipmentIssues = equipment.filter((e: any) => !e.is_available).length

        // Load pending bookings
        const pendingRes = await adminApi.getPendingBookings()
        const pendingBookings = pendingRes.bookings || []
        const pendingApprovals = pendingBookings.length

        // Load all bookings for active count
        const allBookingsRes = await adminApi.getAllBookings()
        const allBookings = allBookingsRes.bookings || []
        const activeBookings = allBookings.filter((b: any) => b.status === 'APPROVED' || b.status === 'PENDING').length

        // Load users count (excludes admins)
        const usersRes = await adminApi.getUsers()
        const systemUsers = usersRes.users?.length || 0

        setStats({
          totalEquipment,
          activeBookings,
          pendingApprovals,
          systemUsers,
          equipmentIssues,
          overdueReturns: 0, // TODO: Calculate from bookings based on end_time
        })
      } catch (error) {
        console.error("Error loading admin stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statsData = [
    {
      label: "Total Equipment",
      value: String(stats.totalEquipment),
      change: `${stats.totalEquipment} items`,
      icon: "📦",
    },
    {
      label: "Active Bookings",
      value: String(stats.activeBookings),
      change: "Currently active",
      icon: "📅",
    },
    {
      label: "Pending Approvals",
      value: String(stats.pendingApprovals),
      change: stats.pendingApprovals > 0 ? "Needs attention" : "All clear",
      icon: "⏳",
    },
    {
      label: "System Users",
      value: String(stats.systemUsers),
      change: `${stats.systemUsers} registered`,
      icon: "👥",
    },
    {
      label: "Equipment Issues",
      value: String(stats.equipmentIssues),
      change: stats.equipmentIssues > 0 ? "Needs maintenance" : "All available",
      icon: "🔧",
    },
    {
      label: "Overdue Returns",
      value: String(stats.overdueReturns),
      change: stats.overdueReturns > 0 ? "Action required" : "On time",
      icon: "⚠️",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#605A57] font-medium font-sans">{stat.label}</p>
              <p className="text-3xl font-normal text-[#37322F] mt-2 font-serif">{stat.value}</p>
              <p className="text-xs text-[rgba(96,90,87,0.70)] mt-2 font-sans">{stat.change}</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
