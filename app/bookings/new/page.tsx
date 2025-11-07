"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import LandingNavbar from "@/components/landing-navbar"
import BookingFormStep1 from "@/components/booking-form-step1"
import BookingFormStep2 from "@/components/booking-form-step2"
import BookingFormStep3 from "@/components/booking-form-step3"
import { bookingApi } from "@/lib/api"

export default function NewBookingPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"student" | "faculty">("student")
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    equipmentId: "",
    equipmentName: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    purpose: "",
    additionalNotes: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("userRole")
    
    if (!storedUser || !storedRole) {
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(storedUser)
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "student" || user.role === "faculty") {
        setUserRole(user.role)
      } else {
        router.push("/login")
      }
    } catch {
      localStorage.clear()
      router.push("/login")
    }

    // Check for equipment ID in URL params
    const params = new URLSearchParams(window.location.search)
    const equipmentId = params.get("equipment")
    if (equipmentId && !formData.equipmentId) {
      setFormData((prev) => ({
        ...prev,
        equipmentId,
      }))
      // Skip step 1 if equipment is pre-selected
      setCurrentStep(2)
    }
  }, [router])

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
    setError("")
  }

  const handleFormDataChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.equipmentId || !formData.startDate || !formData.endDate || !formData.purpose) {
      setError("Please fill in all required fields")
      return
    }

    // Validate dates
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

    if (endDateTime <= startDateTime) {
      setError("End date/time must be after start date/time")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await bookingApi.create({
        equipment_id: formData.equipmentId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        purpose: formData.purpose,
        notes: formData.additionalNotes || undefined,
        priority: formData.priority,
      })

      // Show success message and redirect
      alert("Booking request submitted successfully!")
      router.push("/bookings")
    } catch (err: any) {
      console.error("Booking error:", err)
      setError(err.message || "Failed to submit booking request")
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, label: "Select Equipment", completed: formData.equipmentId !== "" },
    { number: 2, label: "Choose Dates & Time", completed: formData.startDate !== "" && formData.endDate !== "" },
    { number: 3, label: "Add Details", completed: formData.purpose !== "" },
  ]

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
              New Booking
            </h1>
            <p className="text-[#605A57] font-sans text-sm md:text-base leading-relaxed">
              Create a new equipment booking request
            </p>
          </div>
          <Link href="/equipment">
            <Button className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium shadow-[0px_1px_2px_rgba(55,50,47,0.12)]">
              Cancel
            </Button>
          </Link>
        </div>
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.completed || step.number <= currentStep) {
                      handleStepChange(step.number)
                    }
                  }}
                  disabled={step.number > currentStep && !step.completed}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-colors font-sans ${
                    step.number < currentStep
                      ? "bg-[#37322F] text-white"
                      : step.number === currentStep
                        ? "bg-[#37322F] text-white"
                        : "bg-[#E0DEDB] text-[#605A57]"
                  } ${step.number <= currentStep || step.completed ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
                >
                  {step.number < currentStep ? "✓" : step.number}
                </button>
                <span
                  className={`ml-2 text-sm font-medium font-sans ${
                    step.number <= currentStep ? "text-[#37322F]" : "text-[#605A57]"
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded ${
                      step.number < currentStep ? "bg-[#37322F]" : "bg-[#E0DEDB]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Select Equipment"}
              {currentStep === 2 && "Choose Dates and Time"}
              {currentStep === 3 && "Add Booking Details"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Choose the equipment you want to book"}
              {currentStep === 2 && "Select the dates and time for your booking"}
              {currentStep === 3 && "Provide details about your booking purpose"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <BookingFormStep1
                selectedEquipmentId={formData.equipmentId}
                onEquipmentSelect={(equipmentId, equipmentName) => {
                  handleFormDataChange("equipmentId", equipmentId)
                  handleFormDataChange("equipmentName", equipmentName)
                }}
              />
            )}

            {currentStep === 2 && (
              <BookingFormStep2
                startDate={formData.startDate}
                endDate={formData.endDate}
                startTime={formData.startTime}
                endTime={formData.endTime}
                onStartDateChange={(date) => handleFormDataChange("startDate", date)}
                onEndDateChange={(date) => handleFormDataChange("endDate", date)}
                onStartTimeChange={(time) => handleFormDataChange("startTime", time)}
                onEndTimeChange={(time) => handleFormDataChange("endTime", time)}
              />
            )}

            {currentStep === 3 && (
              <BookingFormStep3
                purpose={formData.purpose}
                additionalNotes={formData.additionalNotes}
                onPurposeChange={(purpose) => handleFormDataChange("purpose", purpose)}
                onNotesChange={(notes) => handleFormDataChange("additionalNotes", notes)}
                priority={formData.priority}
                onPriorityChange={(priority) => handleFormDataChange("priority", priority)}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isLoading}
              className="bg-transparent border border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F5F3] font-sans font-medium"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => handleStepChange(currentStep + 1)}
                disabled={currentStep === 1 && !formData.equipmentId}
                className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans font-medium disabled:opacity-50"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#37322F] hover:bg-[#2a2420] text-white font-sans font-medium disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Booking"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Summary */}
        {formData.equipmentId && (
          <Card className="mt-6 bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.08)] border border-[#E0DEDB]">
            <CardHeader>
              <CardTitle className="text-base text-[#37322F] font-sans font-semibold">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-[#605A57]">Equipment:</span>
                  <span className="font-medium text-[#37322F]">{formData.equipmentName || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#605A57]">Start Date:</span>
                  <span className="font-medium text-[#37322F]">{formData.startDate || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#605A57]">End Date:</span>
                  <span className="font-medium text-[#37322F]">{formData.endDate || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#605A57]">Time:</span>
                  <span className="font-medium text-[#37322F]">
                    {formData.startTime} - {formData.endTime}
                  </span>
                </div>
                {formData.purpose && (
                  <div className="flex justify-between">
                    <span className="text-[#605A57]">Purpose:</span>
                    <span className="font-medium text-[#37322F]">{formData.purpose}</span>
                  </div>
                )}
                {formData.priority && (
                  <div className="flex justify-between">
                    <span className="text-[#605A57]">Priority:</span>
                    <span className="font-medium text-[#37322F] capitalize">{formData.priority}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
