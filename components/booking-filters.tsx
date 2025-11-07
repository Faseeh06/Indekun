"use client"

interface BookingFiltersProps {
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function BookingFilters({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}: BookingFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3">
      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Bookings</option>
        <option value="active">Active</option>
        <option value="pending">Pending Approval</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Sort Filter */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="recent">Most Recent</option>
        <option value="upcoming">Upcoming First</option>
        <option value="ending-soon">Ending Soon</option>
      </select>
    </div>
  )
}
