'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'

type PerformanceData = {
  name: string
  score: number
}

export default function TestPerformance() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    async function fetchPerformanceData() {
      const response = await fetch('/api/test-performance')
      const data = await response.json()
      setPerformanceData(data)
    }
    fetchPerformanceData()
  }, [])

  const isTestLinkDisabled = () => {
    // Add your condition here for disabling the link
    return false // Example: return true to disable
  }

  if (performanceData.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent>Loading...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-foreground">Test Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mt-4">
          <Link
            href="/test"
            className={`text-foreground ${isTestLinkDisabled()
              ? 'text-gray-400 cursor-not-allowed pointer-events-none'
              : 'hover:text-primary'
            }`}
          >
            Take Test
          </Link>
          <Link href="/view-schedule" className="text-foreground hover:text-primary">View Schedule</Link>
          <Link href="/view-exam-seat" className="text-foreground hover:text-primary">View Exam Seat</Link>
        </div>
      </CardContent>
    </Card>
  )
}