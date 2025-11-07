"use client"

import { Button } from "@/components/ui/button"

export default function AdminOverview() {
  const recentBookings = [
    { id: "B001", equipment: "Projector", user: "John Smith", status: "active", date: "2025-11-10" },
    { id: "B002", equipment: "Laptop", user: "Sarah Johnson", status: "pending", date: "2025-11-08" },
    { id: "B003", equipment: "Camera", user: "Mike Davis", status: "completed", date: "2025-11-05" },
  ]

  const equipmentIssues = [
    { id: 1, equipment: "Projector - Sony", issue: "Lamp needs replacement", priority: "high" },
    { id: 2, equipment: "Microphone - Shure", issue: "Battery low", priority: "medium" },
  ]

  return (
    <div className="space-y-6">
      {/* Recent Bookings */}
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
        <div className="mb-4">
          <h3 className="text-[#37322F] text-lg font-normal mb-1 font-serif">Recent Bookings</h3>
          <p className="text-[#605A57] text-sm font-sans">Latest booking requests</p>
        </div>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 bg-[#F7F5F3] rounded-lg border border-[#E0DEDB]"
            >
              <div>
                <p className="font-medium text-[#37322F] font-sans">{booking.equipment}</p>
                <p className="text-sm text-[#605A57] font-sans">{booking.user}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium font-sans ${
                    booking.status === "active"
                      ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                      : booking.status === "pending"
                        ? "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                        : "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                  }`}
                >
                  {booking.status}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans"
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Issues */}
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
        <div className="mb-4">
          <h3 className="text-[#37322F] text-lg font-normal mb-1 font-serif">Equipment Issues</h3>
          <p className="text-[#605A57] text-sm font-sans">Items requiring attention</p>
        </div>
        <div className="space-y-3">
          {equipmentIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between p-3 bg-[#F7F5F3] rounded-lg border border-[#E0DEDB]"
            >
              <div>
                <p className="font-medium text-[#37322F] font-sans">{issue.equipment}</p>
                <p className="text-sm text-[#605A57] font-sans">{issue.issue}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium font-sans ${
                    issue.priority === "high"
                      ? "bg-[rgba(96,90,87,0.15)] text-[#605A57]"
                      : "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                  }`}
                >
                  {issue.priority}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans"
                >
                  Resolve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6">
        <div className="mb-4">
          <h3 className="text-[#37322F] text-lg font-normal mb-1 font-serif">System Health</h3>
          <p className="text-[#605A57] text-sm font-sans">Performance metrics</p>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#37322F] font-sans">Database</span>
              <span className="text-sm text-[#605A57] font-sans">98%</span>
            </div>
            <div className="w-full bg-[#E0DEDB] rounded-full h-2">
              <div className="bg-[#37322F] h-2 rounded-full" style={{ width: "98%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#37322F] font-sans">Storage</span>
              <span className="text-sm text-[#605A57] font-sans">65%</span>
            </div>
            <div className="w-full bg-[#E0DEDB] rounded-full h-2">
              <div className="bg-[#605A57] h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#37322F] font-sans">Response Time</span>
              <span className="text-sm text-[#605A57] font-sans">45ms</span>
            </div>
            <div className="w-full bg-[#E0DEDB] rounded-full h-2">
              <div className="bg-[#37322F] h-2 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
