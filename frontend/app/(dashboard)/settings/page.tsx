"use client"

import { useState } from "react"
import { Settings, Bell, Lock, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    maintenanceReminders: true,
    weeklyReports: false,
    twoFactorAuth: false,
    darkMode: false,
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = [
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { key: "emailNotifications", label: "Email Notifications", description: "Receive alerts via email" },
        { key: "pushNotifications", label: "Push Notifications", description: "Get browser notifications" },
        { key: "criticalAlerts", label: "Critical Alerts", description: "Notify for critical issues only" },
        { key: "maintenanceReminders", label: "Maintenance Reminders", description: "Scheduled maintenance alerts" },
        { key: "weeklyReports", label: "Weekly Reports", description: "Receive summary reports every week" },
      ],
    },
    {
      title: "Security",
      icon: Lock,
      settings: [{ key: "twoFactorAuth", label: "Two-Factor Authentication", description: "Extra layer of security" }],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-gray-600">Manage your preferences and account settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>

                {/* Settings Items */}
                <div className="divide-y divide-gray-200">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.key}
                      className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[setting.key as keyof typeof settings]}
                          onChange={() => handleToggle(setting.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden shadow-sm">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Delete Account</p>
                <p className="text-gray-600 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-6 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors duration-300">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 justify-end">
            <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300">
              Cancel
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
