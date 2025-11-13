"use client"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"

interface QRScannerModalProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScannerModal({ onScan, onClose }: QRScannerModalProps) {
  const [uploadMode, setUploadMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate QR code reading from image
      const mockData = JSON.stringify({ machine_id: "CNC-001" })
      onScan(mockData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Scan QR Code</h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload View */}
        <div className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload QR Code Image</h3>
            <p className="text-sm text-gray-500 mb-4">Click to select or drag and drop</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Choose File
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">Upload a clear image of the QR code</p>
        </div>
      </div>
    </div>
  )
}
