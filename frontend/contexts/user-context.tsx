"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "@/lib/types"

interface UserContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (name: string, email: string, password: string, role: User["role"]) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string): boolean => {
    // Mock login - in real app, this would validate against backend
    const mockUser: User = {
      id: "1",
      name: "Demo User",
      email,
      role: email.includes("student") ? "Student" : email.includes("manager") ? "Social Media Manager" : "Normal User",
    }
    setUser(mockUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const register = (name: string, email: string, password: string, role: User["role"]): boolean => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
    }
    setUser(newUser)
    return true
  }

  return <UserContext.Provider value={{ user, login, logout, register }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
