// src/components/dashboard/TestPerformance.tsx

'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  if (performanceData.length === 0) {
    return <Card className="w-full h-[400px] flex items-center justify-center"><CardContent>Loading...</CardContent></Card>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-foreground">Test Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
              <XAxis 
                dataKey="name" 
                stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
                tick={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
              />
              <YAxis 
                stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
                tick={{ fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}
                itemStyle={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                strokeWidth={2}
                dot={{ fill: theme === 'dark' ? '#3b82f6' : '#2563eb', r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}