import type React from "react"
interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: "blue" | "green" | "yellow" | "orange"
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-100 text-primary",
    green: "bg-green-100 text-success",
    yellow: "bg-yellow-100 text-warning",
    orange: "bg-orange-100 text-orange-600",
  }

  return (
    <div className="card p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-2">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
