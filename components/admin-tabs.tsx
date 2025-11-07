"use client"

import AdminOverview from "@/components/admin-overview"
import AdminEquipmentManagement from "@/components/admin-equipment-management"
import AdminBookingsManagement from "@/components/admin-bookings-management"

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

function AdminUsersManagement() {
  const users = [
    { id: 1, name: "John Smith", email: "john@university.edu", role: "Student", status: "active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@university.edu", role: "Faculty", status: "active" },
    { id: 3, name: "Mike Davis", email: "mike@university.edu", role: "Student", status: "inactive" },
    { id: 4, name: "Emily Wilson", email: "emily@university.edu", role: "Faculty", status: "active" },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DEDB]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#F7F5F3]">
                <td className="px-6 py-4 text-sm text-[#37322F] font-medium font-sans">{user.name}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{user.email}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{user.role}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-sans ${
                      user.status === "active"
                        ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                        : "bg-[rgba(96,90,87,0.08)] text-[#605A57]"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-[#37322F] hover:text-[#2a2420] font-medium font-sans">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
