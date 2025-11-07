"use client"

interface BookingFormStep3Props {
  purpose: string
  additionalNotes: string
  priority?: "low" | "medium" | "high"
  onPurposeChange: (purpose: string) => void
  onNotesChange: (notes: string) => void
  onPriorityChange?: (priority: "low" | "medium" | "high") => void
}

export default function BookingFormStep3({
  purpose,
  additionalNotes,
  priority = "medium",
  onPurposeChange,
  onNotesChange,
  onPriorityChange,
}: BookingFormStep3Props) {
  const purposeOptions = ["Class/Lecture", "Research", "Project", "Event", "Training", "Personal Study", "Other"]

  return (
    <div className="space-y-6">
      {/* Purpose Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Booking Purpose <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {purposeOptions.map((option) => (
            <button
              key={option}
              onClick={() => onPurposeChange(option)}
              className={`p-3 rounded-lg border-2 text-left font-medium transition-all ${
                purpose === option
                  ? "border-blue-600 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Selection */}
      {onPriorityChange && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                onClick={() => onPriorityChange(level)}
                className={`flex-1 p-3 rounded-lg border-2 text-center font-medium transition-all capitalize ${
                  priority === level
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
        <textarea
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any special requirements or notes about your booking..."
          rows={5}
          maxLength={500}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-slate-500 mt-2">{additionalNotes.length}/500 characters</p>
      </div>

      {/* Terms */}
      <div className="p-4 bg-slate-100 rounded-lg">
        <h4 className="font-semibold text-slate-900 mb-2">Important Information</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Equipment must be returned by the end date and time specified</li>
          <li>• Late returns may result in additional charges</li>
          <li>• You are responsible for the equipment during the rental period</li>
          <li>• Any damage must be reported immediately</li>
        </ul>
      </div>
    </div>
  )
}
