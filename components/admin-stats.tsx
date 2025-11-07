"use client"

export default function AdminStats() {
  const stats = [
    {
      label: "Total Equipment",
      value: "156",
      change: "+5 this month",
      icon: "📦",
    },
    {
      label: "Active Bookings",
      value: "43",
      change: "+12 today",
      icon: "📅",
    },
    {
      label: "Pending Approvals",
      value: "8",
      change: "3 urgent",
      icon: "⏳",
    },
    {
      label: "System Users",
      value: "487",
      change: "+23 this month",
      icon: "👥",
    },
    {
      label: "Equipment Issues",
      value: "5",
      change: "2 maintenance",
      icon: "🔧",
    },
    {
      label: "Overdue Returns",
      value: "2",
      change: "Action required",
      icon: "⚠️",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] border border-[#E0DEDB] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#605A57] font-medium font-sans">{stat.label}</p>
              <p className="text-3xl font-normal text-[#37322F] mt-2 font-serif">{stat.value}</p>
              <p className="text-xs text-[rgba(96,90,87,0.70)] mt-2 font-sans">{stat.change}</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
