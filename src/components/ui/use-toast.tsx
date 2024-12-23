// components/ui/use-toast.tsx
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from './toast'

interface ToastContextType {
  showToast: (message: string, variant?: 'default' | 'destructive') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; variant?: 'default' | 'destructive' }>>([])

  const showToast = useCallback((message: string, variant: 'default' | 'destructive' = 'default') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, variant }])

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}