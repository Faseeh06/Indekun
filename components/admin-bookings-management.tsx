"use client"

export default function AdminBookingsManagement() {
  const bookings = [
    {
      id: "B001",
      equipment: "Projector",
      user: "John Smith",
      dates: "Nov 10-12",
      status: "active",
      actions: ["Extend", "Cancel"],
    },
    {
      id: "B002",
      equipment: "Laptop",
      user: "Sarah Johnson",
      dates: "Nov 8-9",
      status: "pending",
      actions: ["Approve", "Reject"],
    },
    {
      id: "B003",
      equipment: "Camera",
      user: "Mike Davis",
      dates: "Nov 5-6",
      status: "completed",
      actions: ["View", "Archive"],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Booking ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Dates</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DEDB]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-[#F7F5F3]">
                <td className="px-6 py-4 text-sm font-mono text-[#37322F] font-sans">{booking.id}</td>
                <td className="px-6 py-4 text-sm text-[#37322F] font-medium font-sans">{booking.equipment}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{booking.user}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{booking.dates}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-sans ${
                      booking.status === "active"
                        ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                        : booking.status === "pending"
                          ? "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                          : "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {booking.actions.map((action) => (
                    <button key={action} className="text-[#37322F] hover:text-[#2a2420] font-medium font-sans">
                      {action}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
