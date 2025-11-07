"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Booking {
  id: string
  equipment: string
  startDate: string
  endDate: string
  status: "confirmed" | "pending" | "completed"
  location: string
}

export default function BookingsOverview() {
  const bookings: Booking[] = [
    {
      id: "1",
      equipment: "Projector - Sony VPL-FHZ90",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      status: "confirmed",
      location: "Room 101",
    },
    {
      id: "2",
      equipment: "Laptop - MacBook Pro 16",
      startDate: "2025-11-08",
      endDate: "2025-11-09",
      status: "pending",
      location: "Tech Lab",
    },
    {
      id: "3",
      equipment: "Camera - Canon EOS R5",
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      status: "completed",
      location: "Media Center",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
      case "pending":
        return "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
      case "completed":
        return "bg-[#F5F5F5] text-[#424242] border-[#BDBDBD]"
      default:
        return "bg-[#F5F5F5] text-[#424242] border-[#BDBDBD]"
    }
  }

  return (
    <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[#37322F] font-serif">Your Bookings</CardTitle>
        <CardDescription className="text-[#605A57]">Recent and upcoming equipment bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start justify-between p-4 bg-[#F7F5F3] rounded-lg border border-[#E0DEDB] hover:border-[#605A57] transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-[#37322F]">{booking.equipment}</h3>
                <div className="flex items-center text-sm text-[#605A57] mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {booking.location}
                </div>
                <div className="flex items-center text-sm text-[#605A57]">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {booking.startDate} to {booking.endDate}
                </div>
              </div>
              <Badge variant="outline" className={`ml-4 whitespace-nowrap border ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
