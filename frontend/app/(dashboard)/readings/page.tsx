"use client"

import { useState, useEffect } from "react"
import { QrCode, Search, X } from "lucide-react"
import api from "@/lib/api"
import QRScannerModal from "@/components/readings/QRScannerModal"

export default function ReadingsPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [showMachineList, setShowMachineList] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    temperature: "",
    vibration_level: "",
    oil_pressure: "",
    runtime_hours: "",
    notes: "",
    is_anomaly: false,
    anomaly_reason: ""
  })
  const [inspectionPhoto, setInspectionPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMachines()
  }, [])

  const fetchMachines = async () => {
    try {
      const response = await api.get('/machines/')
      setMachines(response.data.results || response.data || [])
    } catch (error) {
      console.error('Failed to fetch machines:', error)
    }
  }

  const handleQRScan = (data: string) => {
    try {
      const parsed = JSON.parse(data)
      const machineId = parsed.machine_id
      const machine = machines.find(m => m.machine_id === machineId)
      if (machine) {
        setSelectedMachine(machine)
      }
    } catch (error) {
      console.error('Invalid QR code:', error)
    }
    setShowScanner(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMachine) {
      alert('Please select a machine')
      return
    }

    setLoading(true)
    try {
      await api.post('/readings/log/', {
        machine_id: selectedMachine.machine_id,
        ...formData
      })
      alert('Reading logged successfully!')
      setFormData({ temperature: "", vibration_level: "", oil_pressure: "", runtime_hours: "", notes: "", is_anomaly: false, anomaly_reason: "" })
      setInspectionPhoto(null)
      setSelectedMachine(null)
    } catch (error) {
      console.error('Failed to log reading:', error)
      alert('Failed to log reading')
    } finally {
      setLoading(false)
    }
  }

  const filteredMachines = machines.filter(m =>
    m.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.machine_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Log Reading</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Machine Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Select Machine</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMachineList(true)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-left hover:border-primary transition"
              >
                {selectedMachine ? (
                  <div>
                    <p className="font-semibold">{selectedMachine.machine_name}</p>
                    <p className="text-sm text-gray-500">{selectedMachine.machine_id}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Click to select machine</p>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
              >
                <QrCode size={20} />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>
          </div>

          {/* Reading Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="72.5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Vibration Level</label>
              <input
                type="number"
                step="0.1"
                value={formData.vibration_level}
                onChange={(e) => setFormData({ ...formData, vibration_level: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1.2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Oil Pressure (PSI)</label>
              <input
                type="number"
                step="0.1"
                value={formData.oil_pressure}
                onChange={(e) => setFormData({ ...formData, oil_pressure: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="45.0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Runtime Hours</label>
              <input
                type="number"
                value={formData.runtime_hours}
                onChange={(e) => setFormData({ ...formData, runtime_hours: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Inspection Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setInspectionPhoto(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_anomaly"
              checked={formData.is_anomaly}
              onChange={(e) => setFormData({ ...formData, is_anomaly: e.target.checked })}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary rounded"
            />
            <label htmlFor="is_anomaly" className="text-sm font-semibold">Mark as Anomaly</label>
          </div>

          {formData.is_anomaly && (
            <div>
              <label className="block text-sm font-semibold mb-2">Anomaly Reason</label>
              <textarea
                value={formData.anomaly_reason}
                onChange={(e) => setFormData({ ...formData, anomaly_reason: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="Describe the anomaly..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Any additional observations..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedMachine}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Log Reading'}
          </button>
        </form>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Machine List Modal */}
      {showMachineList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Select Machine</h3>
              <button onClick={() => setShowMachineList(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredMachines.map((machine) => (
                  <button
                    key={machine.id}
                    onClick={() => {
                      setSelectedMachine(machine)
                      setShowMachineList(false)
                    }}
                    className="w-full p-4 border rounded-lg hover:border-primary hover:bg-blue-50 transition text-left"
                  >
                    <p className="font-semibold">{machine.machine_name}</p>
                    <p className="text-sm text-gray-500">{machine.machine_id} • {machine.location}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
