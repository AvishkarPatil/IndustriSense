"use client"

import type React from "react"

import { useState } from "react"
import { QrCode, Plus, CheckCircle2, Upload, ChevronDown } from "lucide-react"
import QRScannerModal from "@/components/readings/QRScannerModal"

export default function LogReadingPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showMachineDropdown, setShowMachineDropdown] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const availableMachines = [
    { id: 1, machine_id: "CNC-001", machine_name: "CNC Milling Machine", location: "Factory Floor A" },
    { id: 2, machine_id: "PR-003", machine_name: "Press Machine", location: "Factory Floor B" },
    { id: 3, machine_id: "CV-002", machine_name: "Conveyor Belt", location: "Factory Floor A" },
    { id: 4, machine_id: "MX-004", machine_name: "Mixer Unit", location: "Factory Floor C" },
    { id: 5, machine_id: "DR-005", machine_name: "Dryer Machine", location: "Factory Floor B" },
  ]

  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    pressure: "",
    runtime: "",
    notes: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQRScan = (data: string) => {
    try {
      const qrData = JSON.parse(data)
      const machine = availableMachines.find((m) => m.machine_id === qrData.machine_id)
      if (machine) {
        setSelectedMachine(machine)
        setShowScanner(false)
      }
    } catch (error) {
      console.error("Failed to parse QR data:", error)
    }
  }

  const handleMachineSelect = (machine: any) => {
    setSelectedMachine(machine)
    setShowMachineDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSelectedMachine(null)
      setFormData({ temperature: "", vibration: "", pressure: "", runtime: "", notes: "" })
      setImage(null)
      setImagePreview("")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Log Machine Reading</h1>
          <p className="text-gray-600 text-sm md:text-base">Record machine performance metrics</p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-900 text-sm md:text-base">Success!</p>
              <p className="text-green-700 text-xs md:text-sm">Reading logged successfully</p>
            </div>
          </div>
        )}

        {/* Machine Selection */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Select Machine</h3>

          {selectedMachine ? (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm md:text-base break-words">{selectedMachine.machine_id}</p>
                <p className="text-xs md:text-sm text-gray-600">{selectedMachine.machine_name}</p>
                <p className="text-xs text-gray-500">{selectedMachine.location}</p>
              </div>
              <button
                onClick={() => setSelectedMachine(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap w-full md:w-auto"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <button
                  onClick={() => setShowMachineDropdown(!showMachineDropdown)}
                  className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-blue-50 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors duration-300 text-sm md:text-base"
                >
                  <span>Select from available machines</span>
                  <ChevronDown size={20} />
                </button>

                {showMachineDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-300 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                    {availableMachines.map((machine) => (
                      <button
                        key={machine.id}
                        onClick={() => handleMachineSelect(machine)}
                        className="w-full text-left px-4 md:px-6 py-3 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition text-xs md:text-sm"
                      >
                        <p className="font-bold text-gray-900">{machine.machine_id}</p>
                        <p className="text-xs md:text-sm text-gray-600">{machine.machine_name}</p>
                        <p className="text-xs text-gray-500">{machine.location}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* OR separator */}
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-gray-500 text-xs md:text-sm font-medium">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* QR Code Scan */}
              <button
                onClick={() => setShowScanner(true)}
                className="w-full flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-blue-50 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors duration-300 text-sm md:text-base"
              >
                <QrCode className="w-5 h-5 md:w-6 md:h-6" />
                Scan QR Code
              </button>
            </div>
          )}
        </div>

        {/* Reading Form */}
        {selectedMachine && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6 bg-white rounded-2xl border border-gray-200 p-4 md:p-6"
          >
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Inspection Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 text-center hover:border-blue-500 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-16 h-16 md:w-24 md:h-24 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-xs md:text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto text-gray-400" />
                    <p className="text-gray-600 font-medium text-xs md:text-base">Click to upload inspection photo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="75.5"
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Normal range: 60-80°C</p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Vibration Level</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vibration}
                  onChange={(e) => setFormData({ ...formData, vibration: e.target.value })}
                  placeholder="2.5"
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Normal range: 0-5</p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Oil Pressure (PSI)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                  placeholder="45"
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">Normal range: 30-60 PSI</p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Runtime Hours</label>
                <input
                  type="number"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  placeholder="1250"
                  className="w-full px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any observations or issues..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none text-sm md:text-base"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-5 h-5" />
              {submitted ? "Submitting..." : "Submit Reading"}
            </button>
          </form>
        )}

        {showScanner && <QRScannerModal onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
      </div>
    </div>
  )
}
