'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProfileOverview from '@/components/dashboard/ProfileOverview'
import TestPerformance from '@/components/dashboard/TestPerformance'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundLines } from "@/components/ui/background-lines"


export default function Dashboard() {
  const { user } = useAuth()
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-foreground bg-background p-8 rounded-lg shadow-lg"
        >
          Please log in to view the dashboard.
        </motion.div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <BackgroundLines className="absolute inset-0 z-0" children={undefined} />
      <main className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-foreground text-center"
      >
        Welcome, {user.name}!
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileOverview />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-full"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <TestPerformance />
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </main>
    </div>
  )
}

