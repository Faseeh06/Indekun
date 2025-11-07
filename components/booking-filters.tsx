"use client"

interface BookingFiltersProps {
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export default function BookingFilters({ statusFilter, onStatusFilterChange }: BookingFiltersProps) {
  return (
    <div className="flex gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-4 py-2.5 border border-[#E0DEDB] rounded-lg bg-white text-[#37322F] text-sm font-medium hover:border-[#D4CFCA] focus:outline-none focus:ring-2 focus:ring-[#37322F] font-sans"
      >
        <option value="all">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  )
}
