import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Factory Maintenance Tracker",
  description: "Monitor machine health, log readings, and manage work orders",
  openGraph: {
    title: "Smart Factory Maintenance Tracker",
    description: "Monitor machine health, log readings, and manage work orders",
    type: "website",
  },
    generator: 'avi'
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
