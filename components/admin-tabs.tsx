"use client"

import { useState, useEffect } from "react"
import AdminOverview from "@/components/admin-overview"
import AdminEquipmentManagement from "@/components/admin-equipment-management"
import AdminBookingsManagement from "@/components/admin-bookings-management"
import { adminApi } from "@/lib/api"

interface AdminTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "equipment", label: "Equipment Management" },
    { id: "bookings", label: "Bookings" },
    { id: "users", label: "Users" },
  ]

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-[#E0DEDB] mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors font-sans ${
              activeTab === tab.id
                ? "border-[#37322F] text-[#37322F]"
                : "border-transparent text-[#605A57] hover:text-[#37322F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "equipment" && <AdminEquipmentManagement />}
        {activeTab === "bookings" && <AdminBookingsManagement />}
        {activeTab === "users" && <AdminUsersManagement />}
      </div>
    </div>
  )
}

interface User {
  id: string
  name: string
  email: string
  role: "student" | "faculty" | "admin"
  created_at: string
  updated_at: string
}

function AdminUsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await adminApi.getUsers()
      setUsers(response.users || [])
    } catch (err: any) {
      console.error("Error loading users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return "N/A"
    }
  }

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  if (loading) {
    return (
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] p-12">
        <div className="text-center">
          <p className="text-[#605A57] text-lg font-sans">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] p-12">
        <div className="text-center">
          <p className="text-red-600 text-lg font-sans mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-[#37322F] text-white rounded-lg hover:bg-[#2a2420] font-sans"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[#37322F] text-xl font-semibold font-sans">Registered Users</h2>
          <p className="text-[#605A57] text-sm font-sans mt-1">
            Total: {users.length} user{users.length !== 1 ? "s" : ""} (Students & Faculty)
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-transparent border border-[#E0DEDB] text-[#37322F] rounded-lg hover:bg-[#F7F5F3] font-sans text-sm"
        >
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] p-12">
          <div className="text-center">
            <p className="text-[#605A57] text-lg font-sans">No users found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Registered</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DEDB]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F7F5F3]">
                    <td className="px-6 py-4 text-sm text-[#37322F] font-medium font-sans">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium font-sans capitalize ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "faculty"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getRoleDisplay(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-[rgba(55,50,47,0.08)] text-[#37322F]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
