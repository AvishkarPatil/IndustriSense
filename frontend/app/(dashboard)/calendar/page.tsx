"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarEvent {
  id: number
  date: string
  machine: string
  status: "healthy" | "warning" | "critical"
  type: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 13))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, date: "2025-11-15", machine: "CNC-001", status: "healthy", type: "Routine" },
    { id: 2, date: "2025-11-18", machine: "PR-003", status: "critical", type: "Urgent" },
    { id: 3, date: "2025-11-20", machine: "CV-002", status: "warning", type: "Routine" },
    { id: 4, date: "2025-11-25", machine: "MX-004", status: "healthy", type: "Oil Change" },
    { id: 5, date: "2025-11-15", machine: "MX-005", status: "warning", type: "Check" },
  ])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const selectedDateStr = selectedDate ? new Date(selectedDate).toLocaleDateString() : null
  const selectedDateEvents = selectedDate ? getEventsForDate(new Date(selectedDate).getDate()) : []

  return (
    <div className="p-3 md:p-4 max-w-6xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Maintenance Calendar</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Visual schedule of all machine maintenance</p>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-primary text-white gap-2">
          <button onClick={prevMonth} className="p-1.5 hover:bg-primary-dark rounded-lg transition">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base md:text-lg font-bold">{monthName}</h2>
          <button onClick={nextMonth} className="p-1.5 hover:bg-primary-dark rounded-lg transition">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 md:p-3">
          <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-2 md:mb-3">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div key={`day-${idx}`} className="text-center font-semibold text-text-secondary text-xs py-1.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 md:gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}

            {days.map((day) => {
              const dayEvents = getEventsForDate(day)
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isSelected = selectedDate === dateStr
              const highestPriorityStatus =
                dayEvents.length > 0
                  ? dayEvents.some((e) => e.status === "critical")
                    ? "critical"
                    : dayEvents.some((e) => e.status === "warning")
                      ? "warning"
                      : "healthy"
                  : null

              const statusBgColor = highestPriorityStatus
                ? highestPriorityStatus === "critical"
                  ? "bg-red-100 border-red-300"
                  : highestPriorityStatus === "warning"
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-green-100 border-green-300"
                : ""

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square border rounded-lg p-1 md:p-2 transition cursor-pointer text-xs md:text-sm font-semibold ${
                    isSelected
                      ? "bg-primary text-white border-primary ring-2 ring-primary ring-offset-1"
                      : dayEvents.length > 0
                        ? `${statusBgColor} text-gray-900 border-2 hover:shadow-md`
                        : "border-border hover:bg-background"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="border-t border-border p-3 md:p-4 bg-background">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Maintenance for {selectedDateStr}</h3>
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-2 md:p-3 rounded-lg border-l-4 text-xs md:text-sm ${
                    event.status === "critical"
                      ? "bg-red-50 border-red-500"
                      : event.status === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-green-50 border-green-500"
                  }`}
                >
                  <p className="font-semibold text-text-primary">{event.machine}</p>
                  <p className="text-text-secondary">{event.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 p-3 md:p-4 bg-background border-t border-border text-center">
          <div>
            <p className="text-lg md:text-xl font-bold text-green-600">
              {events.filter((e) => e.status === "healthy").length}
            </p>
            <p className="text-xs text-text-secondary">Healthy</p>
          </div>
          <div>
            <p className="text-lg md:text-xl font-bold text-yellow-600">
              {events.filter((e) => e.status === "warning").length}
            </p>
            <p className="text-xs text-text-secondary">Due Soon</p>
          </div>
          <div>
            <p className="text-lg md:text-xl font-bold text-red-600">
              {events.filter((e) => e.status === "critical").length}
            </p>
            <p className="text-xs text-text-secondary">Critical</p>
          </div>
        </div>
      </div>
    </div>
  )
}
