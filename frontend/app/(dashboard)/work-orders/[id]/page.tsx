"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Clock, User, Wrench, CheckCircle2, AlertCircle, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const [order] = useState({
    id: "WO-002",
    title: "Bearing Replacement",
    machine: "Conveyor B",
    location: "Floor 2",
    status: "in-progress",
    priority: "critical",
    dueDate: "2025-11-18",
    createdDate: "2025-11-10",
    assignedTo: "Jane Doe",
    description: "Emergency repair due to high vibration levels detected during routine monitoring.",
    estimatedHours: 4,
    completedHours: 2,
    attachments: ["bearing_spec.pdf", "maintenance_log.jpg"],
    activities: [
      { type: "status", message: "Changed status to In Progress", time: "2 hours ago", user: "Jane Doe" },
      { type: "comment", message: "Removed old bearing, inspecting shaft", time: "1 hour ago", user: "Jane Doe" },
      { type: "created", message: "Work order created", time: "8 hours ago", user: "System" },
    ],
  })

  const [comment, setComment] = useState("")
  const [activities, setActivities] = useState(order.activities)

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setActivities([
        {
          type: "comment",
          message: comment,
          time: "Just now",
          user: "You",
        },
        ...activities,
      ])
      setComment("")
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/work-orders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Work Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{order.title}</h1>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(order.priority)}`}
                >
                  {order.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600">ID: {order.id}</p>
            </div>
            <div className="text-right">
              <div
                className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status.replace("-", " ").toUpperCase()}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Wrench className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Machine</p>
                <p className="font-bold text-gray-900">{order.machine}</p>
                <p className="text-xs text-gray-500">{order.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Assigned To</p>
                <p className="font-bold text-gray-900">{order.assignedTo}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Due Date</p>
                <p className="font-bold text-gray-900">{order.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Progress</p>
                <p className="font-bold text-gray-900">
                  {order.completedHours}h / {order.estimatedHours}h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">{order.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Activities and Comments */}
          <div className="md:col-span-2 space-y-6">
            {/* Add Comment Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Activity & Updates
              </h3>

              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-3 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Comment
                </button>
              </form>

              {/* Activity Timeline */}
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {activity.type === "status" && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      {activity.type === "comment" && <MessageSquare className="w-5 h-5 text-blue-600" />}
                      {activity.type === "created" && <AlertCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.user}</p>
                      <p className="text-gray-600 text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attachments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-2">
                {order.attachments.map((file, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  >
                    <p className="font-medium text-gray-900 text-sm">{file}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Update Status
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300">
                  Add Attachment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
