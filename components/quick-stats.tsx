"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { bookingApi, equipmentApi } from "@/lib/api"

interface QuickStatsProps {
  userRole: "student" | "faculty" | "admin"
}

export default function QuickStats({ userRole }: QuickStatsProps) {
  const [activeBookings, setActiveBookings] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)
  const [availableEquipment, setAvailableEquipment] = useState(0)
  const [totalBorrowed, setTotalBorrowed] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        // My bookings
        const my = await bookingApi.getMy()
        const now = Date.now()
        setActiveBookings(
          (my.bookings || []).filter((b: any) => b.status === 'APPROVED' && new Date(b.end_time).getTime() >= now).length
        )
        setPendingRequests((my.bookings || []).filter((b: any) => b.status === 'PENDING').length)
        setTotalBorrowed((my.bookings || []).length)
      } catch {}
      try {
        // Equipment (available count)
        const eq = await equipmentApi.getAll()
        setAvailableEquipment((eq.equipment || []).filter((e: any) => e.is_available !== false).length)
      } catch {}
    }
    load()
  }, [])

  const stats = [
    { label: "Active Bookings", value: String(activeBookings) },
    { label: "Pending Requests", value: String(pendingRequests) },
    { label: "Available Equipment", value: String(availableEquipment) },
    { label: "Total Borrowed", value: String(totalBorrowed) },
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
