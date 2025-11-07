"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LandingNavbar from "@/components/landing-navbar"
import EquipmentCard from "@/components/equipment-card"
import EquipmentFilters from "@/components/equipment-filters"
import { equipmentApi } from "@/lib/api"

interface Equipment {
  id: string
  name: string
  category: string
  description: string | null
  quantity: number
  image_url: string | null
  is_available: boolean
}

export default function EquipmentPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("student")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("userRole")
    
    if (!storedUser || !storedRole) {
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(storedUser)
      if (user.role === "student" || user.role === "faculty" || user.role === "admin") {
        setUserRole(user.role)
      } else {
        router.push("/login")
      }
    } catch {
      localStorage.clear()
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    loadEquipment()
  }, [selectedCategory, searchQuery])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      setError("")
      const category = selectedCategory === "all" ? undefined : selectedCategory
      const search = searchQuery.trim() || undefined
      const response = await equipmentApi.getAll(category, search)
      setEquipment(response.equipment || [])
    } catch (err: any) {
      console.error("Error loading equipment:", err)
      setError(err.message || "Failed to load equipment")
    } finally {
      setLoading(false)
    }
  }

  // Filter equipment
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  // Sort equipment
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const categories = ["all", ...new Set(equipment.map((item) => item.category))]

  // Transform equipment for EquipmentCard component
  const transformedEquipment = sortedEquipment.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    location: "Equipment Storage",
    availability: item.is_available ? ("available" as const) : ("reserved" as const),
    image: item.image_url || "/placeholder.svg",
    description: item.description || "No description available",
    condition: "excellent" as const,
    borrowedCount: 0,
    rating: 4.5,
  }))

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      {/* Navigation */}
      <div className="relative">
        <LandingNavbar brandLabel="Indekun" brandHref="/" userRole={userRole} rightButtonLabel="Logout" />
      </div>

      {/* Main Content */}
      <main className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[#37322F] text-3xl md:text-4xl font-serif font-normal leading-tight mb-2">
              Browse Equipment
            </h1>
            <p className="text-[#605A57] text-sm md:text-base font-sans">
              {loading ? "Loading..." : `${sortedEquipment.length} item${sortedEquipment.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)] px-6 py-2.5 text-base">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Search equipment by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl px-4 py-2.5 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] bg-white text-[#37322F] placeholder:text-[#828387] font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <EquipmentFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedCondition="all"
              onConditionChange={() => {}}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#605A57] text-lg font-sans">Loading equipment...</p>
          </div>
        ) : transformedEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedEquipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#605A57] text-lg font-sans">No equipment found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="mt-4 bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium px-6 py-2.5 text-base"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
