"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import {
  LayoutDashboard,
  Gauge,
  FileText,
  Clipboard,
  Box,
  BarChart3,
  AlertCircle,
  Calendar,
  LogOut,
  Bell,
  User,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ open, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile/")
        setUser(response.data)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [])

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Gauge, label: "Machines", href: "/machines" },
    { icon: FileText, label: "Log Reading", href: "/readings" },
    { icon: Clipboard, label: "Work Orders", href: "/work-orders" },
    { icon: Box, label: "Spare Parts", href: "/parts" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: AlertCircle, label: "Alerts", href: "/alerts" },
    { icon: Calendar, label: "Maintenance Calendar", href: "/calendar" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    router.push("/")
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40 md:translate-x-0 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Project Name */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-base font-bold text-white">⚙️</span>
            </div>
            <span className="font-bold text-lg">IndustriSense</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 pt-2 pb-4 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
                  isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto space-y-2">
          <Link
            href="/profile"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          <Link
            href="/notifications"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
          >
            <Bell size={20} />
            <span>Notifications</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 transition text-sm font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
