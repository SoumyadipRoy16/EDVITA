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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/manage-questions" className="text-primary hover:underline">
              Go to Manage Questions
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monitor Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/monitor-results" className="text-primary hover:underline">
              Go to Monitor Results
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approve Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/approve-applications" className="text-primary hover:underline">
              Go to Approve Applications
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}