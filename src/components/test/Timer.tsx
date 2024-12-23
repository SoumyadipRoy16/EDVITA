// src/components/test/Timer.tsx

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast } from "@/components/ui/toast"

type TimerProps = {
  onTimeExpired: (questionIndex: number) => void
  onMoveToNextQuestion: (questionIndex: number) => void
  onTestFullyExpired: () => void
  totalQuestions: number
}

export default function Timer({ 
  onTimeExpired, 
  onMoveToNextQuestion,
  onTestFullyExpired, 
  totalQuestions 
}: TimerProps) {
  const [toast, setToast] = useState<{
    message: string, 
    variant?: "default" | "destructive", 
    visible: boolean
  }>({
    message: "",
    variant: "default",
    visible: false
  })

  const showToast = (message: string, variant: "default" | "destructive" = "destructive") => {
    setToast({ message, variant, visible: true })
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 3000)
  }

  const TOTAL_TEST_TIME = 3600 // 1 hour total
  const TIME_PER_QUESTION = Math.floor(TOTAL_TEST_TIME / totalQuestions)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(TIME_PER_QUESTION)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(TOTAL_TEST_TIME)
  
  // Track warning states to show only once
  const [hasShownQuestionWarning, setHasShownQuestionWarning] = useState(false)
  const [hasShownTotalTestWarning, setHasShownTotalTestWarning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      // Question time warning (5 minutes left)
      if (timeRemaining <= 300 && !hasShownQuestionWarning) {
        showToast("5 minutes left for current question", "default")
        setHasShownQuestionWarning(true)
      }

      // Total test time warning (5 minutes left)
      if (totalTimeRemaining <= 300 && !hasShownTotalTestWarning) {
        showToast("5 minutes left for entire test", "destructive")
        setHasShownTotalTestWarning(true)
      }

      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Trigger time expired for current question
          onTimeExpired(currentQuestionIndex)
          
          // Determine next question index
          const nextQuestionIndex = currentQuestionIndex + 1
          
          // If more questions exist, move to next question
          if (nextQuestionIndex < totalQuestions) {
            // Move to next question
            onMoveToNextQuestion(nextQuestionIndex)
            
            // Update current question index
            setCurrentQuestionIndex(nextQuestionIndex)
            
            // Reset question-specific warning
            setHasShownQuestionWarning(false)
            
            // Reset time for next question
            return TIME_PER_QUESTION
          } else {
            // No more questions, fully expire the test
            onTestFullyExpired()
            return 0
          }
        }
        return prev - 1
      })

      // Handle total time remaining
      setTotalTimeRemaining(prev => {
        if (prev <= 1) {
          // Fully expire the test when total time is up
          onTestFullyExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [
    currentQuestionIndex, 
    timeRemaining, 
    totalTimeRemaining, 
    hasShownQuestionWarning, 
    hasShownTotalTestWarning, 
    onTimeExpired, 
    onMoveToNextQuestion,
    onTestFullyExpired, 
    totalQuestions
  ])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  // Determine time color based on remaining time
  const getTimeColor = (seconds: number, isTotal: boolean) => {
    if (isTotal) {
      return seconds <= 300 ? 'text-red-500' : (seconds <= 900 ? 'text-yellow-500' : 'text-primary')
    }
    return seconds <= 60 ? 'text-red-500' : (seconds <= 300 ? 'text-yellow-500' : 'text-primary')
  }

  return (
      <Card className="mb-6">
        {toast.visible && (
          <Toast 
            message={toast.message} 
            variant={toast.variant} 
            state={toast.visible ? "visible" : "hidden"}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          />
        )}
        <CardHeader>
          <CardTitle>Time Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-lg">
              Current Question Time: <span className={`font-bold ${getTimeColor(timeRemaining, false)}`}>
                {formatTime(timeRemaining)}
              </span>
            </p>
            <p className="text-lg">
              Total Test Time: <span className={`font-bold ${getTimeColor(totalTimeRemaining, true)}`}>
                {formatTime(totalTimeRemaining)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
  )
}