"use client"

import { Card, CardContent } from "@/components/ui/card"

interface QuickStatsProps {
  userRole: "student" | "faculty"
}

export default function QuickStats({ userRole }: QuickStatsProps) {
  const stats = [
    {
      label: "Active Bookings",
      value: "2",
      icon: (
        <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 10v10l8 4m8-4l-8 4"
          />
        </svg>
      ),
    },
    {
      label: "Pending Requests",
      value: "1",
      icon: (
        <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Available Equipment",
      value: "156",
      icon: (
        <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Total Borrowed",
      value: "8",
      icon: (
        <svg className="w-6 h-6 text-[#37322f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#605A57] font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-[#37322F] mt-2">{stat.value}</p>
              </div>
              <div>{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
