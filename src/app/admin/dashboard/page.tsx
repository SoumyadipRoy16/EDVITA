

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if the user is an admin using AuthContext
    if (!user || user.role !== 'admin') {
      router.push('/login')
    }
  }, [user, router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gradient">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="transition-transform transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
          <CardHeader>
            <CardTitle className="text-white">Manage Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/manage-schedules" className="text-white hover:underline transition-colors duration-300">
              Go to Manage Schedule
            </Link>
          </CardContent>
        </Card>
        <Card className="transition-transform transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-green-500 to-teal-500">
          <CardHeader>
            <CardTitle className="text-white">Publish Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/publish-results" className="text-white hover:underline transition-colors duration-300">
              Go to Publish Results
            </Link>
          </CardContent>
        </Card>
        <Card className="transition-transform transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-red-500 to-orange-500">
          <CardHeader>
            <CardTitle className="text-white">Make Exam Allotment</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/exam-allotment" className="text-white hover:underline transition-colors duration-300">
              Make Examination Seat Allotments
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

