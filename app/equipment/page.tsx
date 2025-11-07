"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LandingNavbar from "@/components/landing-navbar"
import EquipmentCard from "@/components/equipment-card"
import EquipmentFilters from "@/components/equipment-filters"

interface Equipment {
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

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const equipmentData: Equipment[] = [
    {
      id: "1",
      name: "Projector - Sony VPL-FHZ90",
      category: "Audio/Visual",
      location: "Room 101, Tech Lab",
      availability: "available",
      image: "/professional-projector.jpg",
      description: "4K laser projector with 5000 lumens brightness",
      condition: "excellent",
      borrowedCount: 45,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Laptop - MacBook Pro 16",
      category: "Computers",
      location: "Tech Lab A",
      availability: "available",
      image: "/modern-laptop.png",
      description: "M3 Max, 36GB RAM, 1TB SSD - Perfect for development",
      condition: "excellent",
      borrowedCount: 72,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Camera - Canon EOS R5",
      category: "Photography",
      location: "Media Center",
      availability: "reserved",
      image: "/professional-camera.png",
      description: "45MP mirrorless camera with 4K video capabilities",
      condition: "excellent",
      borrowedCount: 38,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Microphone - Shure SM7B",
      category: "Audio",
      location: "Recording Studio",
      availability: "available",
      image: "/microphone-studio.jpg",
      description: "Professional recording microphone, industry standard",
      condition: "good",
      borrowedCount: 64,
      rating: 4.6,
    },
    {
      id: "5",
      name: "Drone - DJI Air 3",
      category: "Photography",
      location: "Equipment Storage",
      availability: "maintenance",
      image: "/drone-quadcopter.jpg",
      description: "4K camera drone with 46-minute flight time",
      condition: "good",
      borrowedCount: 28,
      rating: 4.5,
    },
    {
      id: "6",
      name: "Printer - Xerox ColorQube",
      category: "Office",
      location: "Office Suite B",
      availability: "available",
      image: "/color-printer.jpg",
      description: "High-speed color printing, 110 ppm",
      condition: "fair",
      borrowedCount: 156,
      rating: 3.8,
    },
    {
      id: "7",
      name: "Monitor - LG UltraWide 38",
      category: "Computers",
      location: "Tech Lab B",
      availability: "available",
      image: "/ultrawide-monitor-setup.png",
      description: "38-inch ultrawide, 3840x1600 resolution",
      condition: "excellent",
      borrowedCount: 42,
      rating: 4.7,
    },
    {
      id: "8",
      name: "Lighting Kit - Neewer 1200W",
      category: "Photography",
      location: "Media Center",
      availability: "available",
      image: "/studio-lighting-kit.png",
      description: "Complete lighting kit with softboxes and stands",
      condition: "good",
      borrowedCount: 51,
      rating: 4.4,
    },
  ]

  // Filter equipment
  const filteredEquipment = equipmentData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesCondition = selectedCondition === "all" || item.condition === selectedCondition

    return matchesSearch && matchesCategory && matchesCondition
  })

  // Sort equipment
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.borrowedCount - a.borrowedCount
      case "rating":
        return b.rating - a.rating
      case "availability":
        return a.availability === "available" ? -1 : 1
      default:
        return 0
    }
  })

  const categories = ["all", ...new Set(equipmentData.map((item) => item.category))]
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("student")

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("userRole") as "student" | "faculty" | "admin" | null
    if (storedRole && (storedRole === "student" || storedRole === "faculty" || storedRole === "admin")) {
      setUserRole(storedRole)
    }
  }, [])

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
            <p className="text-[#605A57] text-sm md:text-base font-sans">{sortedEquipment.length} items available</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)] px-6 py-2.5 text-base">
              Back to Dashboard
            </Button>
          </Link>
        </div>

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
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {sortedEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEquipment.map((equipment) => (
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
                setSelectedCondition("all")
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
