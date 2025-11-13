"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Bell, User, LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
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

  const notifications = [
    { id: 1, message: "PR-003 maintenance overdue", type: "critical", time: "2 hours ago" },
    { id: 2, message: "CV-002 temperature alert", type: "warning", time: "1 hour ago" },
    { id: 3, message: "Work order WO-045 completed", type: "success", time: "30 minutes ago" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm z-[60] flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition md:hidden flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-base font-bold">⚙️</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">FactoryPro</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setUserMenuOpen(false)
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative flex-shrink-0"
            title="Notifications"
          >
            <Bell size={20} className="text-text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl py-2 max-h-96 overflow-y-auto z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
                <h3 className="font-semibold text-sm md:text-base">Notifications</h3>
                <button onClick={() => setNotificationsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <X size={18} />
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-gray-500 text-xs md:text-sm">No notifications</p>
                </div>
              ) : (
                <>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer text-xs md:text-sm"
                    >
                      <p className="font-medium">{notif.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                    </div>
                  ))}
                  <Link
                    href="/dashboard/notifications"
                    className="block px-4 py-3 text-center text-xs md:text-sm text-blue-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition border-t border-gray-200 dark:border-gray-700"
                  >
                    View All Notifications
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition flex-shrink-0"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-md">
              {user?.first_name?.[0] || user?.username?.[0] || "U"}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user?.first_name || user?.username || "User"}</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl py-2 z-50">
              <Link
                href="/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition"
              >
                <User size={16} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-left transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
