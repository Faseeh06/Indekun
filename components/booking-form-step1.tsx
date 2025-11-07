"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Equipment {
  id: string
  name: string
  category: string
  availability: "available" | "reserved" | "maintenance"
}

interface BookingFormStep1Props {
  selectedEquipmentId: string
  onEquipmentSelect: (equipmentId: string, equipmentName: string) => void
}

export default function BookingFormStep1({ selectedEquipmentId, onEquipmentSelect }: BookingFormStep1Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const equipmentList: Equipment[] = [
    {
      id: "1",
      name: "Projector - Sony VPL-FHZ90",
      category: "Audio/Visual",
      availability: "available",
    },
    {
      id: "2",
      name: "Laptop - MacBook Pro 16",
      category: "Computers",
      availability: "available",
    },
    {
      id: "3",
      name: "Camera - Canon EOS R5",
      category: "Photography",
      availability: "reserved",
    },
    {
      id: "4",
      name: "Microphone - Shure SM7B",
      category: "Audio",
      availability: "available",
    },
    {
      id: "7",
      name: "Monitor - LG UltraWide 38",
      category: "Computers",
      availability: "available",
    },
    {
      id: "8",
      name: "Lighting Kit - Neewer 1200W",
      category: "Photography",
      availability: "available",
    },
  ]

  const filteredEquipment = equipmentList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Search Equipment</label>
        <Input
          type="text"
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((equipment) => (
            <Card
              key={equipment.id}
              onClick={() => {
                if (equipment.availability === "available") {
                  onEquipmentSelect(equipment.id, equipment.name)
                }
              }}
              className={`p-4 cursor-pointer transition-all ${
                selectedEquipmentId === equipment.id
                  ? "border-2 border-blue-600 bg-blue-50"
                  : equipment.availability === "available"
                    ? "border border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                    : "border border-slate-200 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{equipment.name}</h3>
                  <p className="text-sm text-slate-500">{equipment.category}</p>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      equipment.availability === "available"
                        ? "bg-green-100 text-green-800"
                        : equipment.availability === "reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {equipment.availability === "available"
                      ? "Available"
                      : equipment.availability === "reserved"
                        ? "Reserved"
                        : "Maintenance"}
                  </span>
                </div>
              </div>
              {selectedEquipmentId === equipment.id && (
                <div className="mt-2 text-blue-600 text-sm font-medium">✓ Selected</div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">No equipment found</p>
        )}
      </div>
    </div>
  )
}
