"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import api from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  role: "ADMIN" | "SUPERVISOR" | "TECHNICIAN"
  first_name: string
  last_name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<User>
  signup: (data: any) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (token) {
        const response = await api.get("/auth/profile/")
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login/", { username, password })
      const { access, refresh, user } = response.data
      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: any) => {
    try {
      const response = await api.post("/auth/register/", data)
      const { access, refresh, user } = response.data
      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
