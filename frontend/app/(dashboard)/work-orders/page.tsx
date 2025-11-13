"use client"

import { useState, useEffect } from "react"
import { Plus, Clock, CheckCircle2, AlertCircle, Filter, Search, X } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function WorkOrdersPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [machines, setMachines] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    work_order_id: "",
    machine: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    assigned_to: "",
    scheduled_date: ""
  })

  useEffect(() => {
    fetchMachines()
    fetchUsers()
  }, [])

  const fetchMachines = async () => {
    try {
      const response = await api.get('/machines/')
      setMachines(response.data.results || response.data || [])
    } catch (error) {
      console.error('Failed to fetch machines:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/profile/')
      setUsers([response.data])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/work-orders/', formData)
      alert('Work order created successfully!')
      setShowAddModal(false)
      setFormData({
        work_order_id: "",
        machine: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        assigned_to: "",
        scheduled_date: ""
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to create work order:', error)
      alert('Failed to create work order')
    }
  }

  const [workOrders] = useState([
    {
      id: "WO-001",
      title: "Replace Oil Filter",
      machine: "Pump Unit A",
      status: "pending",
      priority: "high",
      dueDate: "2025-11-15",
      assignedTo: "John Smith",
      description: "Scheduled preventive maintenance",
      estimatedHours: 2,
    },
    {
      id: "WO-002",
      title: "Bearing Replacement",
      machine: "Conveyor B",
      status: "in-progress",
      priority: "critical",
      dueDate: "2025-11-18",
      assignedTo: "Jane Doe",
      description: "Emergency repair due to high vibration",
      estimatedHours: 4,
    },
    {
      id: "WO-003",
      title: "Valve Inspection",
      machine: "Pump Unit A",
      status: "completed",
      priority: "medium",
      dueDate: "2025-11-10",
      assignedTo: "John Smith",
      description: "Regular inspection and testing",
      estimatedHours: 1,
    },
    {
      id: "WO-004",
      title: "Motor Alignment",
      machine: "Press C",
      status: "pending",
      priority: "high",
      dueDate: "2025-11-20",
      assignedTo: "Mike Johnson",
      description: "Precision alignment required",
      estimatedHours: 3,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600 w-5 h-5" />
      case "in-progress":
        return <AlertCircle className="text-blue-600 w-5 h-5" />
      case "completed":
        return <CheckCircle2 className="text-green-600 w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200"
      case "in-progress":
        return "bg-blue-50 border-blue-200"
      case "completed":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const filteredOrders = workOrders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Work Orders</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage and track maintenance tasks</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg w-fit text-sm md:text-base"
          >
            <Plus className="w-5 h-5" />
            New Work Order
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, title, or machine..."
                className="w-full pl-12 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm md:text-base"
              />
            </div>

            {/* Filter Button */}
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 font-medium text-sm md:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-3 md:p-6">
            <p className="text-blue-100 text-xs md:text-sm font-medium">Total Orders</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{workOrders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-3 md:p-6">
            <p className="text-yellow-100 text-xs md:text-sm font-medium">Pending</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
              {workOrders.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-3 md:p-6">
            <p className="text-orange-100 text-xs md:text-sm font-medium">In Progress</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
              {workOrders.filter((o) => o.status === "in-progress").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-3 md:p-6">
            <p className="text-green-100 text-xs md:text-sm font-medium">Completed</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
              {workOrders.filter((o) => o.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="space-y-3 md:space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm md:text-base">No work orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`card p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-2 ${getStatusColor(order.status)}`}
              >
                <div className="flex flex-col gap-4 md:gap-6">
                  {/* Left Section */}
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <div className="mt-1 flex-shrink-0">{getStatusIcon(order.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h3 className="font-bold text-base md:text-lg text-gray-900 break-words">{order.title}</h3>
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getPriorityColor(order.priority)}`}
                        >
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm mb-3 break-words">{order.description}</p>
                      <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
                        <div>
                          <p className="text-gray-500 font-medium">Machine</p>
                          <p className="text-gray-900 font-semibold">{order.machine}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Assigned To</p>
                          <p className="text-gray-900 font-semibold">{order.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Est. Hours</p>
                          <p className="text-gray-900 font-semibold">{order.estimatedHours}h</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 pt-4 md:pt-0 md:border-t md:border-gray-200 md:pt-4">
                    <div className="md:text-right">
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Due Date</p>
                      <p className="text-gray-900 font-bold">{order.dueDate}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link
                        href={`/work-orders/${order.id}`}
                        className="flex-1 md:flex-initial px-3 md:px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors duration-300 text-xs md:text-sm text-center"
                      >
                        View Details
                      </Link>
                      {order.status !== "completed" && (
                        <button className="flex-1 md:flex-initial px-3 md:px-4 py-2 bg-green-50 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition-colors duration-300 text-xs md:text-sm">
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Work Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-xl font-bold">New Work Order</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Work Order ID</label>
                  <input
                    type="text"
                    required
                    value={formData.work_order_id}
                    onChange={(e) => setFormData({ ...formData, work_order_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="WO-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Machine</label>
                  <select
                    required
                    value={formData.machine}
                    onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Machine</option>
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>{m.machine_name} ({m.machine_id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Routine Maintenance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe the work to be done..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Assign To</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Create Work Order
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
