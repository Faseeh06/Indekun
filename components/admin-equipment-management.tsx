"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { equipmentApi, adminApi } from "@/lib/api"

interface Equipment {
  id: string
  name: string
  category: string
  description: string | null
  quantity: number
  image_url: string | null
  is_available: boolean
}

export default function AdminEquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "1",
    image_url: "",
  })

  useEffect(() => {
    loadEquipment()
  }, [])

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

  const handleAdd = () => {
    setEditingEquipment(null)
    setFormData({
      name: "",
      category: "",
      description: "",
      quantity: "1",
      image_url: "",
    })
    setShowAddModal(true)
  }

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item)
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || "",
      quantity: item.quantity.toString(),
      image_url: item.image_url || "",
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) {
      return
    }
    try {
      await adminApi.deleteEquipment(id)
      await loadEquipment()
    } catch (err: any) {
      alert(err.message || "Failed to delete equipment")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingEquipment) {
        await adminApi.updateEquipment(editingEquipment.id, {
          name: formData.name,
          category: formData.category,
          description: formData.description || undefined,
          quantity: parseInt(formData.quantity),
          image_url: formData.image_url || undefined,
        })
      } else {
        await adminApi.createEquipment({
          name: formData.name,
          category: formData.category,
          description: formData.description || undefined,
          quantity: parseInt(formData.quantity),
          image_url: formData.image_url || undefined,
        })
      }
      setShowAddModal(false)
      await loadEquipment()
    } catch (err: any) {
      alert(err.message || "Failed to save equipment")
    }
  }

  const toggleAvailability = async (item: Equipment) => {
    try {
      await adminApi.updateEquipment(item.id, {
        is_available: !item.is_available,
      })
      await loadEquipment()
    } catch (err: any) {
      alert(err.message || "Failed to update availability")
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading equipment...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#37322F] font-sans">Equipment Management</h2>
        <Button onClick={handleAdd} className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans">
          Add Equipment
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] rounded-[6px] border border-[#E0DEDB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F5F3] border-b border-[#E0DEDB]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#37322F] font-sans">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DEDB]">
            {equipment.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#605A57] font-sans">
                  No equipment found. Add your first equipment item.
                </td>
              </tr>
            ) : (
              equipment.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F5F3]">
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#37322F] font-medium font-sans">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-[#605A57] font-sans mt-1">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-[#605A57] font-sans">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`px-3 py-1 rounded-full text-xs font-medium font-sans cursor-pointer transition-colors ${
                        item.is_available
                          ? "bg-[rgba(55,50,47,0.08)] text-[#37322F] hover:bg-[rgba(55,50,47,0.12)]"
                          : "bg-[rgba(96,90,87,0.12)] text-[#605A57] hover:bg-[rgba(96,90,87,0.18)]"
                      }`}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-[#37322F] hover:text-[#2a2420] font-medium font-sans"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 font-medium font-sans"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-sans">
                {editingEquipment ? "Edit Equipment" : "Add Equipment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                    Image URL
                  </label>
                  <Input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="font-sans"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans">
                    {editingEquipment ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
