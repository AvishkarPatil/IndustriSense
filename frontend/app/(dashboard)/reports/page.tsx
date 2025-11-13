"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Download, Calendar, FileText } from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ start: "2025-01-01", end: "2025-01-31" })

  const reports = [
    {
      id: 1,
      title: "Monthly Performance Report",
      description: "Complete overview of machine performance metrics",
      date: "2025-01-31",
      type: "performance",
    },
    {
      id: 2,
      title: "Maintenance History",
      description: "All maintenance activities and work orders completed",
      date: "2025-01-31",
      type: "maintenance",
    },
    {
      id: 3,
      title: "Anomaly Detection Report",
      description: "All detected anomalies and their resolutions",
      date: "2025-01-31",
      type: "anomaly",
    },
    {
      id: 4,
      title: "Cost Analysis",
      description: "Maintenance costs and ROI metrics",
      date: "2025-01-31",
      type: "cost",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and download factory maintenance reports</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Select Date Range
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {report.type === "performance" && <BarChart3 className="w-6 h-6 text-blue-600" />}
                    {report.type === "maintenance" && <FileText className="w-6 h-6 text-green-600" />}
                    {report.type === "anomaly" && <TrendingUp className="w-6 h-6 text-red-600" />}
                    {report.type === "cost" && <BarChart3 className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{report.title}</h3>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">{report.description}</p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors duration-300">
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
            <p className="text-blue-100 text-sm font-medium mb-2">Total Readings</p>
            <p className="text-3xl font-bold">1,247</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
            <p className="text-green-100 text-sm font-medium mb-2">Anomalies Detected</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
            <p className="text-orange-100 text-sm font-medium mb-2">Work Orders</p>
            <p className="text-3xl font-bold">34</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <p className="text-purple-100 text-sm font-medium mb-2">Uptime</p>
            <p className="text-3xl font-bold">98.5%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
