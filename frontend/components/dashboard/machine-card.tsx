"use client"

import Link from "next/link"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

interface Machine {
  id: number
  name: string
  location: string
  status: "healthy" | "warning" | "critical"
  temp: number
  vibration: number
  nextMaint: string
}

interface MachineCardProps {
  machine: Machine
}

export default function MachineCard({ machine }: MachineCardProps) {
  const statusConfig = {
    healthy: { badge: "badge-success", icon: CheckCircle2, color: "text-success" },
    warning: { badge: "badge-warning", icon: AlertTriangle, color: "text-warning" },
    critical: { badge: "badge-critical", icon: AlertCircle, color: "text-danger" },
  }

  const StatusIcon = statusConfig[machine.status].icon
  const daysUntilMaint = machine.nextMaint ? Math.ceil((new Date(machine.nextMaint).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
  const progressPercent = daysUntilMaint > 0 ? Math.max(0, 100 - (daysUntilMaint / 30) * 100) : 100

  return (
    <Link href={`/machines/${machine.id}`}>
      <div className="card p-5 h-full hover:shadow-lg transition cursor-pointer flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary">{machine.name}</h3>
            <p className="text-xs text-text-muted">{machine.location}</p>
          </div>
          <div className={statusConfig[machine.status].badge}>
            <StatusIcon size={12} />
            <span className="text-xs capitalize">{machine.status}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4 flex-1">
          <div className="flex justify-between">
            <span className="text-text-secondary">Temp:</span>
            <span className="font-semibold text-text-primary">{machine.temp}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Vibration:</span>
            <span className="font-semibold text-text-primary">{machine.vibration}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">Maintenance</span>
            <span className="text-xs font-semibold text-text-primary">{daysUntilMaint > 0 ? `${daysUntilMaint} days` : 'Overdue'}</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
