"use client"

import Link from "next/link"

interface EquipmentCardProps {
  equipment: {
    id: string
    name: string
    category: string
    location: string
    availability: "available" | "reserved" | "maintenance"
    image: string
    description: string
    condition: "excellent" | "good" | "fair"
    borrowedCount: number
    rating: number
  }
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[rgba(55,50,47,0.08)] text-[#37322F]"
      case "reserved":
        return "bg-[rgba(96,90,87,0.12)] text-[#605A57]"
      case "maintenance":
        return "bg-[rgba(96,90,87,0.15)] text-[#605A57]"
      default:
        return "bg-[rgba(96,90,87,0.08)] text-[#605A57]"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-[#37322F]"
      case "good":
        return "text-[#605A57]"
      case "fair":
        return "text-[#828387]"
      default:
        return "text-[#605A57]"
    }
  }

  return (
    <Link href={`/equipment/${equipment.id}`}>
      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 bg-[#F7F5F3] overflow-hidden">
          <img
            src={equipment.image || "/placeholder.svg"}
            alt={equipment.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium font-sans ${getAvailabilityColor(equipment.availability)}`}
          >
            {equipment.availability === "available"
              ? "Available"
              : equipment.availability === "reserved"
                ? "Reserved"
                : "Maintenance"}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-normal text-[#37322F] text-lg font-serif line-clamp-2 mb-2">{equipment.name}</h3>
          <p className="text-sm text-[#605A57] mb-3 font-sans">{equipment.category}</p>

          <p className="text-sm text-[#605A57] line-clamp-2 mb-4 font-sans flex-1">{equipment.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm mb-4 font-sans">
            <div className="flex items-center space-x-2">
              <span className="text-[#37322F]">⭐</span>
              <span className="font-medium text-[#37322F]">{equipment.rating}</span>
              <span className="text-[#605A57]">({equipment.borrowedCount})</span>
            </div>
            <span className={`font-medium capitalize ${getConditionColor(equipment.condition)}`}>
              {equipment.condition}
            </span>
          </div>

          {/* Location */}
          <p className="text-sm text-[#605A57] mb-4 font-sans">📍 {equipment.location}</p>

          {/* Book Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              // Handle booking logic here
            }}
            className={`w-full py-3 px-4 rounded-lg font-medium text-base transition-colors font-sans ${
              equipment.availability === "available"
                ? "bg-[#37322F] text-white hover:bg-[#2a2420]"
                : "bg-[#E0DEDB] text-[#828387] cursor-not-allowed"
            }`}
            disabled={equipment.availability !== "available"}
          >
            {equipment.availability === "available" ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </Link>
  )
}
