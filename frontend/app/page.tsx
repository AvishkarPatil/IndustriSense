"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Zap,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Gauge,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Laptop,
} from "lucide-react"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-Time Dashboard",
      description: "Monitor all machines at a glance with live health status and performance metrics",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Get notified instantly when machines need attention or maintenance is due",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Readings",
      description: "Log temperature, vibration, and pressure readings with QR code scanning",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Work Orders",
      description: "Assign, track, and complete maintenance work orders efficiently",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics",
      description: "Analyze machine performance trends and generate detailed reports",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collab",
      description: "Coordinate between managers, supervisors, and technicians seamlessly",
      gradient: "from-pink-500 to-pink-600",
    },
  ]

  const benefits = [
    {
      stat: "50%",
      label: "Downtime Reduction",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      stat: "40%",
      label: "Cost Savings",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      stat: "2 Sec",
      label: "Load Time",
      icon: <Clock className="w-6 h-6" />,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-4 w-full flex justify-center z-50 transition-all duration-500 ${
          isScrolled ? "scale-95" : "scale-100"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
          <div className="flex items-center space-x-1">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700 mr-6 cursor-pointer flex items-center gap-2"
              >
                <Gauge className="w-6 h-6 text-blue-600" />
                IndustriSense
              </motion.div>
            </Link>

            <div className="flex items-center space-x-1">
              <Link href="#features">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Features
                </motion.div>
              </Link>
              <Link href="#benefits">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Benefits
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center gap-3 ml-2">
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary font-medium hover:text-primary-dark transition-colors duration-200 text-sm"
                >
                  Sign In
                </motion.div>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div
            className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 inline-block animate-fade-in-up">
            <div className="glass-effect px-4 py-2 rounded-full text-sm font-medium text-primary">
              🚀 Smart Factory Management
            </div>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-tight text-text-primary"
            style={{ animationDelay: "0.1s" }}
          >
            Predict Breakdowns,
            <span className="gradient-text"> Prevent Losses</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed animate-fade-in-up max-w-2xl mx-auto"
            style={{ animationDelay: "0.2s" }}
          >
            Real-time machine monitoring, intelligent alerts, and predictive maintenance to keep your factory running
            24/7
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/signup"
              className="btn-primary inline-flex items-center justify-center gap-2 py-4 px-8 text-lg"
            >
              <ArrowRight size={22} />
              Get Started
            </Link>
            <Link
              href="#features"
              className="btn-outline inline-flex items-center justify-center gap-2 py-4 px-8 text-lg"
            >
              <Laptop size={22} />
              Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize factory maintenance operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="card-hover p-8 cursor-pointer group transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div
                  className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">Proven Results</h2>
            <p className="text-xl text-gray-600">Join hundreds of factories optimizing their maintenance operations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="card-hover p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <div className="text-5xl font-bold gradient-text mb-2">{item.stat}</div>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to optimize your factory?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join leading manufacturers using IndustriSense to reduce downtime and increase efficiency
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <ArrowRight size={22} />
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">IndustriSense</span>
              </div>
              <p className="text-gray-400 text-sm">Smart maintenance for modern factories</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#benefits" className="hover:text-white transition">
                    Benefits
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 IndustriSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
