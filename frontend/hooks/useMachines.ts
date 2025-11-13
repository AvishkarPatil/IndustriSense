"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

export interface Machine {
  id: number
  machine_id: string
  machine_name: string
  machine_type: string
  location: string
  status: string
  health_status: "GREEN" | "YELLOW" | "RED" | "CRITICAL"
  next_maintenance_date: string
  days_until_maintenance: number | null
}

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMachines = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/machines/dashboard/")
      setMachines(response.data.machines || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  return { machines, loading, error, refetch: fetchMachines }
}
