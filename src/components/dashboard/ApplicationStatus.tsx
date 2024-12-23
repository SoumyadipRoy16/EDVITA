// src/components/dashboard/ApplicationStatus.tsx

'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Stage = {
  name: string
  status: 'complete' | 'current' | 'upcoming'
}

export default function ApplicationStatus() {
  const [stages, setStages] = useState<Stage[]>([])

  useEffect(() => {
    async function fetchApplicationStatus() {
      const response = await fetch('/api/application-status')
      const data = await response.json()
      setStages(data)
    }
    fetchApplicationStatus()
  }, [])

  if (stages.length === 0) {
    return <div className="text-muted-foreground">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {stages.map((stage, index) => (
            <li key={index} className="flex items-center">
              {stage.status === 'complete' && (
                <CheckCircle className="text-green-500 dark:text-green-400 mr-2" />
              )}
              {stage.status === 'current' && (
                <Clock className="text-blue-500 dark:text-blue-400 mr-2" />
              )}
              {stage.status === 'upcoming' && (
                <XCircle className="text-muted-foreground mr-2" />
              )}
              <span
                className={
                  stage.status === 'current'
                    ? 'font-medium text-foreground'
                    : stage.status === 'upcoming'
                    ? 'text-muted-foreground'
                    : 'text-foreground'
                }
              >
                {stage.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}