"use client"
import { Button } from "@/components/ui/button"

export default function AdminEquipmentManagement() {
  const equipment = [
    {
      id: 1,
      name: "Projector - Sony VPL-FHZ90",
      category: "Audio/Visual",
      status: "available",
      condition: "excellent",
      bookings: 45,
    },
    {
      id: 2,
      name: "Laptop - MacBook Pro 16",
      category: "Computers",
      status: "available",
      condition: "excellent",
      bookings: 72,
    },
    {
      id: 3,
      name: "Camera - Canon EOS R5",
      category: "Photography",
      status: "maintenance",
      condition: "fair",
      bookings: 38,
    },
    {
      id: 4,
      name: "Monitor - LG UltraWide 38",
      category: "Computers",
      status: "available",
      condition: "good",
      bookings: 42,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans">Add Equipment</Button>
      </div>

      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Condition</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DEDB]">
            {equipment.map((item) => (
              <tr key={item.id} className="hover:bg-[#F7F5F3]">
                <td className="px-6 py-4 text-sm text-[#37322F] font-medium font-sans">{item.name}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{item.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-sans ${
                      item.status === "available"
                        ? "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
                        : item.status === "maintenance"
                          ? "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
                          : "bg-[rgba(96,90,87,0.15)] text-[#605A57]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#605A57] capitalize font-sans">{item.condition}</td>
                <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{item.bookings}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-[#37322F] hover:text-[#2a2420] font-medium font-sans">Edit</button>
                  <button className="text-[#605A57] hover:text-[#37322F] font-medium font-sans">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
