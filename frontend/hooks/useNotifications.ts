"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

export interface Notification {
  id: string
  title: string
  message: string
  type: "anomaly" | "maintenance" | "low_stock" | "alert"
  priority: "low" | "medium" | "high" | "critical"
  timestamp: string
  read: boolean
  machine_id?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get("/notifications/")
      setNotifications(response.data)
      const unread = response.data.filter((n: Notification) => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/`, { read: true })
      setNotifications((notifs) => notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const clearAll = async () => {
    try {
      await api.post("/notifications/clear/")
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead, clearAll }
}
