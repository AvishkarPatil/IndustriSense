"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Info, Trash2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "anomaly" | "maintenance" | "alert" | "info"
  priority: "low" | "medium" | "high" | "critical"
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Critical Temperature Alert",
      message: "Machine CNC-001 temperature exceeded safe limits (95°C)",
      type: "anomaly",
      priority: "critical",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: "2",
      title: "Maintenance Due",
      message: "Preventive maintenance scheduled for Machine PUMP-02",
      type: "maintenance",
      priority: "high",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
    },
    {
      id: "3",
      title: "Low Stock Alert",
      message: "Oil filter stock is running low (5 units remaining)",
      type: "alert",
      priority: "medium",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: "4",
      title: "Work Order Completed",
      message: "Work order WO-2025-001 has been marked complete",
      type: "info",
      priority: "low",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
  ])

  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "anomaly":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "maintenance":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />
      case "alert":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "critical") return n.priority === "critical"
    return true
  })

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600 text-sm md:text-base">Stay updated with your factory alerts</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
              filter === "unread"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
              filter === "critical"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300"
            }`}
          >
            Critical
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm md:text-base">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 md:p-5 rounded-xl border-2 transition-all duration-300 flex flex-col md:flex-row md:items-start gap-4 ${
                  notif.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-md hover:shadow-lg"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">{getTypeIcon(notif.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base break-words">{notif.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm mt-1 break-words">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getPriorityColor(notif.priority)}`}
                    >
                      {notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
