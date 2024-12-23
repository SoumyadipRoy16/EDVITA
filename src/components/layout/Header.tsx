'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, testStatus, logout } = useAuth()

  // Function to determine if Take Test link should be disabled
  const isTestLinkDisabled = () => {
    return testStatus.completed || 
           testStatus.disqualified || 
           testStatus.timeExpired
  }

  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          TMS
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="text-foreground hover:text-primary">
            Home
          </Link>
          {!user ? (
            <>
              <Link href="/register" className="text-foreground hover:text-primary">
                Register
              </Link>
              <Link href="/login" className="text-foreground hover:text-primary">
                Login
              </Link>
            </>
          ) : user.role === 'admin' ? (
            <>
              <Link href="/admin/manage-questions" className="text-foreground hover:text-primary">
                Manage Questions
              </Link>
              <Link href="/admin/approve-applications" className="text-foreground hover:text-primary">
                Approve Applications
              </Link>
              <Link href="/admin/monitor-results" className="text-foreground hover:text-primary">
                Monitor Results
              </Link>
              <Link href="/"
                className="text-foreground hover:text-primary"
                onClick={(e) => {
                  e.preventDefault()
                  logout()
                }}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link
                href="/test"
                className={`text-foreground ${isTestLinkDisabled() 
                  ? 'text-gray-400 cursor-not-allowed pointer-events-none' 
                  : 'hover:text-primary'
                }`}
              >
                Take Test
              </Link>
              <Link
                href="/"
                className="text-foreground hover:text-primary"
                onClick={(e) => {
                  e.preventDefault()
                  logout()
                }}
              >
                Logout
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden">
          <Link href="/" className="block py-2 px-4 text-sm hover:bg-accent">
            Home
          </Link>
          {!user ? (
            <>
              <Link href="/register" className="block py-2 px-4 text-sm hover:bg-accent">
                Register
              </Link>
              <Link href="/login" className="block py-2 px-4 text-sm hover:bg-accent">
                Login
              </Link>
            </>
          ) : user.role === 'admin' ? (
            <>
              <Link href="/admin/manage-questions" className="block py-2 px-4 text-sm hover:bg-accent">
                Manage Questions
              </Link>
              <Link href="/admin/approve-applications" className="block py-2 px-4 text-sm hover:bg-accent">
                Approve Applications
              </Link>
              <Link href="/admin/monitor-results" className="block py-2 px-4 text-sm hover:bg-accent">
                Monitor Results
              </Link>
              <Link
                href="/"
                className="block w-full text-left py-2 px-4 text-sm hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault()
                  logout()
                }}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link
                href="/test"
                className={`text-foreground ${isTestLinkDisabled() 
                  ? 'text-gray-400 cursor-not-allowed pointer-events-none' 
                  : 'hover:text-primary'
                }`}
              >
                Take Test
              </Link>
              <Link
                href="/"
                className="text-foreground hover:text-primary"
                onClick={(e) => {
                  e.preventDefault()
                  logout()
                }}
              >
                Logout
              </Link>
            </>
          )}
          <div className="py-2 px-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}