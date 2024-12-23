// src/contexts/AuthContext.tsx

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  name: string
  email: string
  role: 'user' | 'admin'
} | null

type TestStatus = {
  completed: boolean
  reattempted: boolean
  disqualified: boolean
  timeExpired: boolean
  attemptsRemaining: number
}

type AuthContextType = {
  user: User
  testStatus: TestStatus
  login: (user: User) => void
  logout: () => void
  markTestAsCompleted: () => void
  markTestAsDisqualified: () => void
  markTestAsTimeExpired: () => void
  resetTestCompletion: () => void
  initiateReattempt: () => void
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [testStatus, setTestStatus] = useState<TestStatus>({
    completed: false,
    reattempted: false,
    disqualified: false,
    timeExpired: false,
    attemptsRemaining: 1
  })
  const router = useRouter()

  useEffect(() => {
    // Check for saved user and test status in localStorage on initial load
    const savedUser = localStorage.getItem('user')
    const savedTestStatus = localStorage.getItem('testStatus')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedTestStatus) {
      const parsedTestStatus = JSON.parse(savedTestStatus)
      // Ensure all new properties are present
      setTestStatus({
        completed: parsedTestStatus.completed || false,
        reattempted: parsedTestStatus.reattempted || false,
        disqualified: parsedTestStatus.disqualified || false,
        timeExpired: parsedTestStatus.timeExpired || false,
        attemptsRemaining: parsedTestStatus.attemptsRemaining || 1
      })
    }
  }, [])

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // Ensure user is logged in before making the request
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Clone the existing headers or create new ones
    const headers = new Headers(options.headers)
    
    // Add the user's email to the headers
    headers.set('x-user-email', user.email)

    // Merge the new headers with the existing options
    return fetch(url, {
      ...options,
      headers
    })
  }

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setTestStatus({
      completed: false,
      reattempted: false,
      disqualified: false,
      timeExpired: false,
      attemptsRemaining: 1
    })
    localStorage.removeItem('user')
    localStorage.removeItem('testStatus')
    router.push('/')
  }

  const markTestAsCompleted = () => {
    const newTestStatus = {
      ...testStatus,
      completed: true
    }
    setTestStatus(newTestStatus)
    localStorage.setItem('testStatus', JSON.stringify(newTestStatus))
  }

  const markTestAsDisqualified = () => {
    const newTestStatus = {
      ...testStatus,
      disqualified: true
    }
    setTestStatus(newTestStatus)
    localStorage.setItem('testStatus', JSON.stringify(newTestStatus))
  }

  const markTestAsTimeExpired = () => {
    const newTestStatus = {
      ...testStatus,
      timeExpired: true
    }
    setTestStatus(newTestStatus)
    localStorage.setItem('testStatus', JSON.stringify(newTestStatus))
  }

  const resetTestCompletion = () => {
    const newTestStatus = {
      completed: false,
      reattempted: false,
      disqualified: false,
      timeExpired: false,
      attemptsRemaining: 1
    }
    setTestStatus(newTestStatus)
    localStorage.removeItem('testStatus')
  }

  const initiateReattempt = () => {
    if (testStatus.attemptsRemaining > 0) {
      const newTestStatus = {
        ...testStatus,
        reattempted: true,
        attemptsRemaining: testStatus.attemptsRemaining - 1
      }
      setTestStatus(newTestStatus)
      localStorage.setItem('testStatus', JSON.stringify(newTestStatus))
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      testStatus, 
      login, 
      logout, 
      markTestAsCompleted,
      markTestAsDisqualified,
      markTestAsTimeExpired,
      resetTestCompletion,
      initiateReattempt,
      fetchWithAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}