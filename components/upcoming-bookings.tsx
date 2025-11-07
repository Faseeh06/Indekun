"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function UpcomingBookings() {
  const upcomingBookings = [
    {
      date: "Nov 10",
      equipment: "Projector",
      time: "2:00 PM - 5:00 PM",
    },
    {
      date: "Nov 12",
      equipment: "Laptop",
      time: "10:00 AM - 12:00 PM",
    },
    {
      date: "Nov 15",
      equipment: "Camera",
      time: "1:00 PM - 4:00 PM",
    },
  ]

  return (
    <Card className="bg-white border border-[#E0DEDB] shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[#37322F] font-serif">Upcoming</CardTitle>
        <CardDescription className="text-[#605A57]">Your next bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingBookings.map((booking, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E0DEDB] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#37322F]">{booking.equipment}</p>
                <p className="text-xs text-[#605A57]">{booking.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
