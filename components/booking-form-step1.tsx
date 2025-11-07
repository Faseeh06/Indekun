"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { equipmentApi } from "@/lib/api"

interface Equipment {
  id: string
  name: string
  category: string
  is_available: boolean
}

interface BookingFormStep1Props {
  selectedEquipmentId: string
  onEquipmentSelect: (equipmentId: string, equipmentName: string) => void
}

export default function BookingFormStep1({ selectedEquipmentId, onEquipmentSelect }: BookingFormStep1Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadEquipment()
  }, [])

  useEffect(() => {
    // Check for pre-selected equipment from URL after equipment loads
    if (equipment.length > 0 && !selectedEquipmentId) {
      const params = new URLSearchParams(window.location.search)
      const equipmentId = params.get("equipment")
      if (equipmentId) {
        const found = equipment.find((e) => e.id === equipmentId)
        if (found && found.is_available) {
          onEquipmentSelect(found.id, found.name)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment.length])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await equipmentApi.getAll()
      setEquipment(response.equipment || [])
    } catch (err: any) {
      console.error("Error loading equipment:", err)
      setError(err.message || "Failed to load equipment")
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter(
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

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Equipment List */}
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-center text-slate-500 py-8">Loading equipment...</p>
        ) : filteredEquipment.length > 0 ? (
          filteredEquipment.map((equipment) => (
              <Card
                key={equipment.id}
                onClick={() => {
                  if (equipment.is_available) {
                    onEquipmentSelect(equipment.id, equipment.name)
                  }
                }}
                className={`p-4 cursor-pointer transition-all ${
                  selectedEquipmentId === equipment.id
                    ? "border-2 border-blue-600 bg-blue-50"
                    : equipment.is_available
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
                        equipment.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.is_available ? "Available" : "Not Available"}
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
