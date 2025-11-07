"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PendingRequest {
  id: string
  equipment: string
  user: string
  requestDate: string
  startDate: string
  endDate: string
  purpose: string
  priority: "low" | "medium" | "high"
  userRole: "student" | "faculty"
}

interface PendingRequestsTableProps {
  requests: PendingRequest[]
  onRequestSelect: (request: PendingRequest) => void
  sortBy: string
}

export default function PendingRequestsTable({ requests, onRequestSelect, sortBy }: PendingRequestsTableProps) {
  const sortedRequests = [...requests].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case "user":
        return a.user.localeCompare(b.user)
      case "date":
      default:
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getDaysUntilNeeded = (startDate: string) => {
    const start = new Date(startDate)
    const now = new Date()
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="space-y-4">
      {sortedRequests.length > 0 ? (
        sortedRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{request.equipment}</h3>
                      <p className="text-sm text-slate-500">
                        Requested by {request.user} ({request.userRole})
                      </p>
                    </div>
                    <Badge className={`whitespace-nowrap ${getPriorityColor(request.priority)}`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                    <div>
                      <p className="text-slate-500">Requested</p>
                      <p className="font-medium text-slate-900">{request.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Needed</p>
                      <p className="font-medium text-slate-900">{request.startDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Until</p>
                      <p className="font-medium text-slate-900">{request.endDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Purpose</p>
                      <p className="font-medium text-slate-900">{request.purpose}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-slate-500 line-clamp-1">{request.notes}</p>
                  </div>
                </div>

                {/* Right Content - Days Until Needed */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Days until needed</p>
                    <p
                      className={`font-semibold text-lg ${
                        getDaysUntilNeeded(request.startDate) <= 3 ? "text-red-600" : "text-slate-900"
                      }`}
                    >
                      {getDaysUntilNeeded(request.startDate)} days
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onRequestSelect(request)}>
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-slate-600 text-lg">No pending requests</p>
            <p className="text-slate-500 text-sm mt-1">All booking requests have been processed</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
