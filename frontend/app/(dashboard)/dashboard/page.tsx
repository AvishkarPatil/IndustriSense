"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import StatCard from "@/components/dashboard/stat-card"
import MachineCard from "@/components/dashboard/machine-card"
import { AlertCircle, CheckCircle2, Zap, Wrench } from "lucide-react"
import api from "@/lib/api"

export default function DashboardPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, operational: 0, warnings: 0, workOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const [machinesRes, analyticsRes] = await Promise.all([
        api.get('/machines/dashboard/'),
        api.get('/analytics/dashboard/')
      ])
      
      const machineData = machinesRes.data.machines || []
      const machinesWithReadings = await Promise.all(
        machineData.map(async (m: any) => {
          try {
            const readingsRes = await api.get(`/machines/${m.id}/`)
            const latestReading = readingsRes.data.latest_reading
            return {
              id: m.id,
              name: m.machine_name,
              location: m.location,
              status: m.health_status === 'GREEN' ? 'healthy' : m.health_status === 'YELLOW' ? 'warning' : 'critical',
              temp: latestReading?.temperature || 0,
              vibration: latestReading?.vibration_level || 0,
              nextMaint: m.next_maintenance_date
            }
          } catch (error) {
            return {
              id: m.id,
              name: m.machine_name,
              location: m.location,
              status: m.health_status === 'GREEN' ? 'healthy' : m.health_status === 'YELLOW' ? 'warning' : 'critical',
              temp: 0,
              vibration: 0,
              nextMaint: m.next_maintenance_date
            }
          }
        })
      )
      setMachines(machinesWithReadings)
      
      const analytics = analyticsRes.data
      setStats({
        total: analytics.total_machines || 0,
        operational: analytics.operational || 0,
        warnings: (analytics.health_status?.yellow || 0) + (analytics.health_status?.red || 0),
        workOrders: analytics.pending_work_orders || 0
      })
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Machines" value={stats.total.toString()} icon={<Zap className="w-6 h-6" />} color="blue" />
        <StatCard title="Operational" value={stats.operational.toString()} icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
        <StatCard title="Warnings" value={stats.warnings.toString()} icon={<AlertCircle className="w-6 h-6" />} color="yellow" />
        <StatCard title="Pending Work Orders" value={stats.workOrders.toString()} icon={<Wrench className="w-6 h-6" />} color="orange" />
      </div>

      {/* Machine Status Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Machine Status</h2>
          <Link href="/machines" className="text-primary hover:text-primary-dark font-semibold">
            See All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {machines.slice(0, 4).map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {[
            { machine: "Press C", alert: "Critical temperature detected", time: "2 min ago" },
            { machine: "Conveyor B", alert: "Unusual vibration levels", time: "15 min ago" },
            { machine: "Pump Unit A", alert: "Maintenance due in 10 days", time: "1 hour ago" },
          ].map((alert, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
              <AlertCircle className="text-warning flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="font-medium text-text-primary">{alert.machine}</p>
                <p className="text-sm text-text-secondary">{alert.alert}</p>
              </div>
              <span className="text-xs text-text-muted">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
