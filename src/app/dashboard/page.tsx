// app/dashboard/page.tsx

'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProfileOverview from '@/components/dashboard/ProfileOverview'
import TestPerformance from '@/components/dashboard/TestPerformance'
import ApplicationStatus from '@/components/dashboard/ApplicationStatus'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return <div className="text-center text-foreground">Please log in to view the dashboard.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Welcome, {user.name}!</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileOverview />
        <TestPerformance />
        <ApplicationStatus />
      </div>
    </div>
  )
}