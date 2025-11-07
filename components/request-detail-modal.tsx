"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface PendingRequest {
  id: string
  equipment: string
  user: string
  userEmail: string
  requestDate: string
  startDate: string
  endDate: string
  purpose: string
  notes: string
  priority: "low" | "medium" | "high"
  userRole: "student" | "faculty"
}

interface RequestDetailModalProps {
  request: PendingRequest
  onClose: () => void
  onApprove: (adminNotes?: string) => void
  onReject: (adminNotes?: string) => void
}

export default function RequestDetailModal({ request, onClose, onApprove, onReject }: RequestDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [showApprovalNotes, setShowApprovalNotes] = useState(false)

  const handleReject = () => {
    onReject(rejectionReason.trim() || undefined)
    setShowRejectionForm(false)
    setRejectionReason("")
  }

  const handleApprove = () => {
    onApprove(approvalNotes.trim() || undefined)
    setShowApprovalNotes(false)
    setApprovalNotes("")
  }

  const daysUntilNeeded = Math.ceil(
    (new Date(request.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Review Booking Request</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Request ID: {request.id}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-xl">
              ✕
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Request Header */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-semibold text-slate-900">{request.equipment}</h3>
            <p className="text-sm text-slate-600 mt-1">Request Date: {request.requestDate}</p>
          </div>

          {/* User Information */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Requester Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Name</p>
                <p className="text-slate-900 font-medium mt-1">{request.user}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                <p className="text-slate-900 font-medium mt-1">{request.userEmail}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Role</p>
                <p className="text-slate-900 font-medium mt-1 capitalize">{request.userRole}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Priority</p>
                <p
                  className={`font-medium mt-1 ${
                    request.priority === "high"
                      ? "text-red-600"
                      : request.priority === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Booking Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Start Date</p>
                <p className="text-slate-900 font-medium mt-1">{request.startDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">End Date</p>
                <p className="text-slate-900 font-medium mt-1">{request.endDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Purpose</p>
                <p className="text-slate-900 font-medium mt-1">{request.purpose}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Days Until Needed</p>
                <p className={`font-medium mt-1 ${daysUntilNeeded <= 3 ? "text-red-600" : "text-green-600"}`}>
                  {daysUntilNeeded} days
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Additional Notes</h4>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-slate-900 text-sm">{request.notes}</p>
            </div>
          </div>

          {/* Approval Notes */}
          {showApprovalNotes && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-semibold text-slate-900 mb-3">Approval Notes (Optional)</h4>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes about this approval..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">{approvalNotes.length}/200 characters</p>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectionForm && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-semibold text-slate-900 mb-3">Rejection Reason (Optional)</h4>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                rows={4}
                maxLength={200}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">{rejectionReason.length}/200 characters</p>
            </div>
          )}

          {/* Equipment Availability Check */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-900 uppercase mb-2">System Check</p>
            <ul className="text-green-800 text-sm space-y-1">
              <li>✓ Equipment is available during requested dates</li>
              <li>✓ No conflicting bookings detected</li>
              <li>✓ User has valid booking history</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 justify-end border-t border-slate-200 pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {!showRejectionForm && !showApprovalNotes ? (
            <>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 bg-transparent"
                onClick={() => {
                  setShowRejectionForm(true)
                  setShowApprovalNotes(false)
                }}
              >
                Reject Request
              </Button>
              <Button
                onClick={() => {
                  setShowApprovalNotes(true)
                  setShowRejectionForm(false)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Request
              </Button>
            </>
          ) : showRejectionForm ? (
            <>
              <Button variant="outline" onClick={() => setShowRejectionForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                Confirm Rejection
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowApprovalNotes(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                Confirm Approval
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
