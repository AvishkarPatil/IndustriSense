"use client"

import { useState, useEffect } from "react"
import { Plus, Package, AlertTriangle, X } from "lucide-react"
import api from "@/lib/api"

export default function PartsPage() {
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [selectedPart, setSelectedPart] = useState<any>(null)

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts/')
      setParts(response.data.results || response.data || [])
    } catch (error) {
      console.error('Failed to fetch parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await api.post('/parts/', {
        part_id: formData.get('part_id'),
        part_name: formData.get('part_name'),
        description: formData.get('description'),
        quantity_in_stock: parseInt(formData.get('quantity_in_stock') as string),
        minimum_stock_level: parseInt(formData.get('minimum_stock_level') as string),
        unit_cost: parseFloat(formData.get('unit_cost') as string),
        supplier_name: formData.get('supplier_name')
      })
      alert('Part added successfully!')
      setShowAddModal(false)
      fetchParts()
    } catch (error) {
      console.error('Failed to add part:', error)
      alert('Failed to add part')
    }
  }

  const handleRestock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await api.post(`/parts/${selectedPart.id}/restock/`, {
        quantity: parseInt(formData.get('quantity') as string)
      })
      alert('Part restocked successfully!')
      setShowRestockModal(false)
      setSelectedPart(null)
      fetchParts()
    } catch (error) {
      console.error('Failed to restock:', error)
      alert('Failed to restock part')
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Spare Parts</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={20} /> Add Part
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part) => (
          <div key={part.id} className="card p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">{part.part_name}</h3>
                  <p className="text-sm text-gray-500">{part.part_id}</p>
                </div>
              </div>
              {part.is_low_stock && (
                <AlertTriangle className="text-warning" size={20} />
              )}
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">In Stock:</span>
                <span className={`font-semibold ${part.is_low_stock ? 'text-red-600' : 'text-green-600'}`}>
                  {part.quantity_in_stock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min Level:</span>
                <span className="font-medium">{part.minimum_stock_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unit Cost:</span>
                <span className="font-medium">₹{parseFloat(part.unit_cost).toFixed(2)}</span>
              </div>
              {part.supplier_name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Supplier:</span>
                  <span className="font-medium">{part.supplier_name}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedPart(part)
                setShowRestockModal(true)
              }}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition mt-auto"
            >
              Restock
            </button>
          </div>
        ))}
      </div>

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add Spare Part</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPart} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Part ID</label>
                <input name="part_id" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Part Name</label>
                <input name="part_name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea name="description" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <input name="quantity_in_stock" type="number" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Min Level</label>
                  <input name="minimum_stock_level" type="number" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Unit Cost (₹)</label>
                <input name="unit_cost" type="number" step="0.01" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Supplier Name</label>
                <input name="supplier_name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition">
                Add Part
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Restock Part</h3>
              <button onClick={() => { setShowRestockModal(false); setSelectedPart(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">{selectedPart.part_name}</p>
              <p className="text-sm text-gray-500">Current Stock: {selectedPart.quantity_in_stock}</p>
            </div>
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity to Add</label>
                <input name="quantity" type="number" min="1" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition">
                Restock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
