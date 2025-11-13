"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, QrCode, Clipboard, BarChart3, History, Settings, X } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { use } from "react"

export default function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [machine, setMachine] = useState<any>(null)
  const [readings, setReadings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showQR, setShowQR] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false)

  useEffect(() => {
    fetchMachine()
  }, [id])

  const fetchMachine = async () => {
    try {
      const [machineRes, readingsRes] = await Promise.all([
        api.get(`/machines/${id}/`),
        api.get(`/readings/?machine=${id}`)
      ])
      setMachine(machineRes.data)
      setReadings(readingsRes.data.results?.slice(0, 10) || [])
    } catch (error) {
      console.error('Failed to fetch machine:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      const response = await api.get(`/machines/${id}/report/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${machine.machine_id}_report.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report')
    }
  }

  const handleShowQR = async () => {
    try {
      const response = await api.get(`/machines/${id}/qr/`)
      setQrUrl(response.data.qr_code_url)
      setShowQR(true)
    } catch (error) {
      console.error('Failed to generate QR:', error)
      alert('Failed to generate QR code')
    }
  }

  const handleCreateWorkOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await api.post('/work-orders/', {
        work_order_id: `WO-${Date.now()}`,
        machine: id,
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        scheduled_date: formData.get('scheduled_date')
      })
      alert('Work order created successfully!')
      setShowWorkOrderModal(false)
    } catch (error) {
      console.error('Failed to create work order:', error)
      alert('Failed to create work order')
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!machine) return <div className="p-6 text-center">Machine not found</div>

  const latestReading = machine.latest_reading || {}
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "readings", label: `Readings (${readings.length})`, icon: BarChart3 },
    { id: "maintenance", label: "Maintenance History", icon: History },
    { id: "specs", label: "Specifications", icon: Settings },
  ]

  return (
    <div className="p-4 md:p-6">
      <Link href="/machines" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6">
        <ArrowLeft size={20} /> Back to Machines
      </Link>

      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{machine.machine_name}</h1>
            <p className="text-blue-100 text-lg mt-1">{machine.machine_id}</p>
            <p className="text-blue-100 text-sm mt-1">{machine.location}</p>
          </div>
          <div className="px-4 py-2 bg-white text-primary rounded-lg font-semibold">
            {machine.health_status}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowWorkOrderModal(true)} className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            <Clipboard size={18} className="inline mr-2" /> Create Work Order
          </button>
          <button onClick={handleDownloadReport} className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition">
            <Download size={18} className="inline mr-2" /> Download Report
          </button>
          <button onClick={handleShowQR} className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition">
            <QrCode size={18} className="inline mr-2" /> Show QR Code
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Temperature</p>
                    <p className="text-3xl font-bold">{latestReading.temperature || 'N/A'}</p>
                    {latestReading.temperature && <p className="text-xs text-success mt-1">°C</p>}
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Vibration</p>
                    <p className="text-3xl font-bold">{latestReading.vibration_level || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Oil Pressure</p>
                    <p className="text-3xl font-bold">{latestReading.oil_pressure || 'N/A'}</p>
                    {latestReading.oil_pressure && <p className="text-xs text-success mt-1">PSI</p>}
                  </div>
                </div>
              </div>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Readings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Temp</th>
                    <th className="px-4 py-2 text-left">Vibration</th>
                    <th className="px-4 py-2 text-left">Pressure</th>
                    <th className="px-4 py-2 text-left">Anomaly</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((reading) => (
                    <tr key={reading.id} className="border-b hover:bg-background">
                      <td className="px-4 py-3">{new Date(reading.timestamp).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{reading.temperature || 'N/A'}</td>
                      <td className="px-4 py-3">{reading.vibration_level || 'N/A'}</td>
                      <td className="px-4 py-3">{reading.oil_pressure || 'N/A'}</td>
                      <td className="px-4 py-3">
                        {reading.is_anomaly ? (
                          <span className="text-red-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-green-600">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              </div>
            </>
          )}

          {activeTab === "readings" && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">All Readings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Date & Time</th>
                      <th className="px-4 py-2 text-left">Temp</th>
                      <th className="px-4 py-2 text-left">Vibration</th>
                      <th className="px-4 py-2 text-left">Pressure</th>
                      <th className="px-4 py-2 text-left">Anomaly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.map((reading) => (
                      <tr key={reading.id} className="border-b hover:bg-background">
                        <td className="px-4 py-3">{new Date(reading.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3">{reading.temperature || 'N/A'}</td>
                        <td className="px-4 py-3">{reading.vibration_level || 'N/A'}</td>
                        <td className="px-4 py-3">{reading.oil_pressure || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {reading.is_anomaly ? <span className="text-red-600 font-semibold">Yes</span> : <span className="text-green-600">No</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
              <div className="space-y-4">
                {[
                  { date: machine.last_maintenance_date || '2025-06-15', type: 'Preventive', status: 'Completed', cost: '₹500' },
                  { date: '2025-03-20', type: 'Emergency', status: 'Completed', cost: '₹1,200' },
                  { date: '2024-12-10', type: 'Preventive', status: 'Completed', cost: '₹500' },
                ].map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div>
                      <p className="font-medium">{record.type} Maintenance</p>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{record.status}</p>
                      <p className="text-sm text-gray-500">{record.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Machine Specifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Machine Type', value: machine.machine_type },
                  { label: 'Model', value: machine.model_number || 'N/A' },
                  { label: 'Manufacturer', value: machine.manufacturer || 'N/A' },
                  { label: 'Install Date', value: machine.installation_date },
                  { label: 'Location', value: machine.location },
                  { label: 'Status', value: machine.status },
                ].map((spec, idx) => (
                  <div key={idx} className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">{spec.label}</p>
                    <p className="font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Machine Type</p>
                <p className="font-semibold">{machine.machine_type}</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold">{machine.status}</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Next Maintenance</p>
                <p className="font-semibold">{machine.next_maintenance_date || 'Not scheduled'}</p>
                {machine.days_until_maintenance !== null && (
                  <p className="text-xs text-gray-500 mt-1">in {machine.days_until_maintenance} days</p>
                )}
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Maintenance</p>
                <p className="font-semibold">{machine.last_maintenance_date || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">QR Code</h3>
              <button onClick={() => setShowQR(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <img src={`http://localhost:8000${qrUrl}`} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-center text-sm text-gray-600">Scan this QR code to access machine details</p>
          </div>
        </div>
      )}

      {/* Work Order Modal */}
      {showWorkOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Create Work Order</h3>
              <button onClick={() => setShowWorkOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateWorkOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input name="title" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea name="description" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Priority</label>
                <select name="priority" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Scheduled Date</label>
                <input name="scheduled_date" type="date" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition">
                Create Work Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
