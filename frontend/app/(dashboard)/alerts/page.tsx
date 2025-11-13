"use client"

import { AlertCircle, AlertTriangle, Zap } from "lucide-react"

export default function AlertsPage() {
  const alerts = [
    { id: 1, machine: "Press C", type: "critical", title: "Critical temperature detected", time: "2 min ago" },
    { id: 2, machine: "Conveyor B", type: "warning", title: "Unusual vibration levels", time: "15 min ago" },
    { id: 3, machine: "Pump Unit A", type: "info", title: "Maintenance due in 10 days", time: "1 hour ago" },
    { id: 4, machine: "Mixer D", type: "warning", title: "Oil pressure below normal", time: "3 hours ago" },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="text-danger" size={24} />
      case "warning":
        return <AlertTriangle className="text-warning" size={24} />
      default:
        return <Zap className="text-primary" size={24} />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-4 border-danger"
      case "warning":
        return "border-l-4 border-warning"
      default:
        return "border-l-4 border-primary"
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Alerts & Notifications</h1>
            <p className="text-text-secondary mt-1 text-sm md:text-base">Monitor system alerts and notifications</p>
          </div>
          <select className="px-4 py-2 border border-border rounded-lg text-text-secondary text-sm md:text-base">
            <option>All Alerts</option>
            <option>Critical</option>
            <option>Warning</option>
            <option>Info</option>
          </select>
        </div>

        <div className="space-y-3 md:space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`card p-4 md:p-6 flex flex-col md:flex-row md:items-start gap-4 ${getAlertColor(alert.type)}`}
            >
              <div className="flex-shrink-0 flex-none">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm md:text-base break-words">{alert.title}</h3>
                    <p className="text-text-secondary text-xs md:text-sm mt-1">Machine: {alert.machine}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">{alert.time}</span>
                </div>
              </div>
              <button className="w-full md:w-auto px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary-light transition text-xs md:text-sm font-semibold mt-2 md:mt-0">
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
