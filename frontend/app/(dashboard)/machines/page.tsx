"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import api from "@/lib/api"

export default function MachinesPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchMachines()
  }, [])

  const fetchMachines = async () => {
    try {
      const response = await api.get('/machines/dashboard/')
      setMachines(response.data.machines || [])
    } catch (error) {
      console.error('Failed to fetch machines:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      GREEN: 'bg-green-100 text-green-800',
      YELLOW: 'bg-yellow-100 text-yellow-800',
      RED: 'bg-red-100 text-red-800',
      CRITICAL: 'bg-red-600 text-white'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredMachines = machines.filter(m => {
    const matchesSearch = m.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.machine_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || m.health_status === filterStatus.toUpperCase()
    return matchesSearch && matchesFilter
  })

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Machines</h1>
        <Link href="/machines/add" className="btn-primary inline-flex items-center gap-2">
          <Plus size={20} /> Add Machine
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="green">Healthy</option>
          <option value="yellow">Warning</option>
          <option value="red">Critical</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((machine) => (
          <Link key={machine.id} href={`/machines/${machine.id}`}>
            <div className="card p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{machine.machine_name}</h3>
                  <p className="text-sm text-gray-500">{machine.machine_id}</p>
                  <p className="text-xs text-gray-400 mt-1">{machine.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.health_status)}`}>
                  {machine.health_status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium">{machine.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Maintenance:</span>
                  <span className="font-medium">{machine.next_maintenance_date || 'N/A'}</span>
                </div>
                {machine.days_until_maintenance !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Until:</span>
                    <span className="font-medium">{machine.days_until_maintenance} days</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No machines found
        </div>
      )}
    </div>
  )
}
