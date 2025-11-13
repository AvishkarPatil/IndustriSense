export const API_ENDPOINTS = {
  MACHINES: "/api/machines",
  READINGS: "/api/readings",
  WORK_ORDERS: "/api/work-orders",
  AUTH: "/api/auth",
}

export const STATUS_COLORS = {
  healthy: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

export const MACHINE_TYPES = ["Pump", "Conveyor", "Press", "Mixer", "Dryer", "Hoist", "Motor", "Compressor"]

export const NORMAL_RANGES = {
  temperature: { min: 60, max: 80, unit: "°C" },
  vibration: { min: 0, max: 5, unit: "mm/s" },
  pressure: { min: 30, max: 60, unit: "PSI" },
}
