"use client"

import { BarChart3, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const performanceData = [
    { month: "Jan", uptime: 98.5, efficiency: 92, maintenance: 3200 },
    { month: "Feb", uptime: 97.8, efficiency: 90, maintenance: 4100 },
    { month: "Mar", uptime: 99.1, efficiency: 94, maintenance: 2800 },
    { month: "Apr", uptime: 98.9, efficiency: 93, maintenance: 3500 },
    { month: "May", uptime: 99.5, efficiency: 95, maintenance: 2200 },
    { month: "Jun", uptime: 99.2, efficiency: 94, maintenance: 4250 },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics & Reports</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Average Uptime</h3>
            <TrendingUp className="text-success" size={24} />
          </div>
          <p className="text-3xl font-bold text-text-primary">99.2%</p>
          <p className="text-sm text-success mt-2">↑ 0.5% from last month</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Total Runtime</h3>
            <BarChart3 className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold text-text-primary">12,450 hrs</p>
          <p className="text-sm text-text-muted mt-2">Across all machines</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Maintenance Cost</h3>
            <BarChart3 className="text-warning" size={24} />
          </div>
          <p className="text-3xl font-bold text-text-primary">₹4,250</p>
          <p className="text-sm text-text-muted mt-2">This month</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#10b981"
                strokeWidth={2}
                name="Uptime (%)"
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Efficiency (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
