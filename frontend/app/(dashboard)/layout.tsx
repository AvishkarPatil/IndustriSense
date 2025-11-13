"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import AIChatbot from "@/components/ai-chatbot"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="ml-0 md:ml-64 p-6">{children}</main>
      <AIChatbot />
    </div>
  )
}
