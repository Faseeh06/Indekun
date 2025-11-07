"use client"

interface EquipmentFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedCondition: string
  onConditionChange: (condition: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function EquipmentFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedCondition,
  onConditionChange,
  sortBy,
  onSortChange,
}: EquipmentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "all" ? "All Categories" : category}
          </option>
        ))}
      </select>

      {/* Condition Filter */}
      <select
        value={selectedCondition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Conditions</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
        <option value="fair">Fair</option>
      </select>

      {/* Sort Filter */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="popular">Most Popular</option>
        <option value="rating">Highest Rated</option>
        <option value="availability">Availability</option>
      </select>
    </div>
  )
}
