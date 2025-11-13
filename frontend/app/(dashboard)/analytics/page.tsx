"use client"

import { BarChart3, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
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
          <p className="text-3xl font-bold text-text-primary">$4,250</p>
          <p className="text-sm text-text-muted mt-2">This month</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="flex items-center justify-center h-64 bg-background rounded-lg">
          <p className="text-text-muted">Chart visualization placeholder</p>
        </div>
      </div>
    </div>
  )
}
