// src/app/test/page.tsx

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import CodeEditor from '@/components/test/CodeEditor'
import ProblemStatement from '@/components/test/ProblemStatement'
import TestCaseValidation from '@/components/test/TestCaseValidation'
import Timer from '@/components/test/Timer'
import { useToast, ToastProvider } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type Question = {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  testCases: Array<{
    input: string
    output: string
  }>
  examples?: Array<{
    input: string
    output: string
    explanation: string
  }>
}

function TestContent() {
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isCameraAllowed, setIsCameraAllowed] = useState(false)
  const { showToast } = useToast()
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(false)
  
  const { user, testStatus, initiateReattempt, markTestAsCompleted } = useAuth()

  // New state for tab switching
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [isTabSwitchWarningOpen, setIsTabSwitchWarningOpen] = useState(false)

  // Stored code for reattempt
  const [storedCode, setStoredCode] = useState<string | null>(null)

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      router.push('/mobile-test-restriction')
    }
  }, [router])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTestStarted) {
        // Increment tab switch count
        setTabSwitchCount(prev => {
          const newCount = prev + 1
          
          if (newCount > 3) {
            // End test after 3 warnings
            handleTestFailure()
            return newCount
          }
          
          // Open warning dialog
          setIsTabSwitchWarningOpen(true)
          return newCount
        })
      }
    }

    const handleFullScreenChange = () => {
      if (isTestStarted && !document.fullscreenElement) {
        // Treat exiting full-screen as tab switch
        handleVisibilityChange()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullScreenChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [isTestStarted])

  const handleTestFailure = async () => {
    try {
      await fetch('/api/test/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Excessive tab switching',
          status: 'disqualified'
        })
      })
      
      router.push('/test-disqualified')
    } catch (error) {
      showToast("Failed to end test", "destructive")
    }
  }

  const autoSaveProgress = useCallback(async () => {
    // Implement auto-save logic here
    try {
      await fetch('/api/test/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: question?.id,
          // Include other necessary data like code, current state
        })
      })
    } catch (error) {
      showToast("Auto-save failed", "destructive")
    }
  }, [question])

  useEffect(() => {
    if (isTestStarted) {
      const autoSaveInterval = setInterval(autoSaveProgress, 2 * 60 * 1000) // Every 2 minutes
      return () => clearInterval(autoSaveInterval)
    }
  }, [isTestStarted, autoSaveProgress])

  const fetchQuestion = async (currentQuestionId?: string) => {
    try {
      setIsLoading(true)
      const url = '/api/coding-problem' + (currentQuestionId ? `?currentQuestionId=${currentQuestionId}` : '')
      const response = await fetch(url)
      
      if (!response.ok) {
        const data = await response.json()
        if (response.status === 404) {
          setIsComplete(true)
          return
        }
        throw new Error(data.error || 'Failed to fetch question')
      }

      const data = await response.json()
      setQuestion(data)
    } catch (error) {
      showToast("Failed to load question. Please refresh the page.", "destructive")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestion()
  }, [])

  const handleFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      } else if ((document.documentElement as any).mozRequestFullScreen) { // Firefox
        await (document.documentElement as any).mozRequestFullScreen()
      } else if ((document.documentElement as any).webkitRequestFullscreen) { // Chrome, Safari and Opera
        await (document.documentElement as any).webkitRequestFullscreen()
      } else if ((document.documentElement as any).msRequestFullscreen) { // IE/Edge
        await (document.documentElement as any).msRequestFullscreen()
      }
      setShowFullScreenDialog(true)
    } catch (error) {
      showToast("Could not enter full-screen mode", "destructive")
    }
  }

  const handleCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setIsCameraAllowed(true)
    } catch (error) {
      showToast("Camera access denied. Please allow camera for the test.", "destructive")
    }
  }

  const startTest = () => {
    setIsTestStarted(true)
  }

  const handleQuestionChange = (newQuestion: Question) => {
    setQuestion(newQuestion)
  }

  const handleTestComplete = async (shouldReattempt: boolean, previousCode?: string, isTimeExpired: boolean = false) => {
    try {
      // Send test completion data to backend
      await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isTimeExpired,
          status: isTimeExpired ? 'time_expired' : 'completed'
        })
      })

      if (shouldReattempt && testStatus.attemptsRemaining > 0) {
        // Store the previous code for reattempt
        setStoredCode(previousCode || null)
        
        // Mark the test as reattempted
        initiateReattempt()
        
        // Reset and fetch first question
        fetchQuestion()
        setIsTestStarted(false)
        showToast("Starting your final attempt", "default")
      } else {
        // Redirect to test complete page
        router.push('/test-complete')
      }
    } catch (error) {
      showToast("Failed to submit test", "destructive")
    }
  }

  const handleQuestionTimeExpired = async (questionIndex: number) => {
    try {
      // Submit the current question when time expires
      const response = await fetch('/api/coding-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question?.id,
          code: '', // No code submitted
          language: 'python', // Default language
          timeExpired: true
        }),
      })
  
      const data = await response.json()
  
      if (data.nextQuestion) {
        // Move to next question
        setQuestion(data.nextQuestion)
      }
    } catch (error) {
      showToast("Failed to process question expiration", "destructive")
    }
  }

  const handleTestFullyExpired = async () => {
    try {
      await fetch('/api/test/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Total test time expired',
          status: 'time_expired'
        })
      })
      
      // Mark test as completed
      markTestAsCompleted()
      
      // Redirect to test complete page
      router.push('/test-complete')
    } catch (error) {
      showToast("Failed to end test", "destructive")
    }
  }

  const handleTimeExpired = (questionIndex: number) => {
    // Implement time expiration logic
    handleTestFailure()
  }

  if (isComplete) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/95">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Test Completed</h1>
          <p className="text-muted-foreground text-lg">
            Please wait for us to review your code(s). Till then head back to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="text-center text-foreground">Please log in to take the test.</div>
  }

  // Guidelines Page
  if (!isTestStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Test Guidelines</h1>
          
          {testStatus.reattempted && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Final Attempt</p>
              <p>This is your last chance to take the test.</p>
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl font-bold text-primary">1</span>
              <p>There will be <strong>5 questions</strong> on mixed topics related to Data Structures and Algorithms.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl font-bold text-primary">2</span>
              <p>You can use any of the following languages: <strong>Python, Java, JavaScript, C/C++</strong>.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl font-bold text-primary">3</span>
              <p>You will have <strong>exactly 1 hour</strong> to finish the test.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl font-bold text-primary">4</span>
              <p>You will have <strong>1 reattempt chance</strong> for each question.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl font-bold text-primary">5</span>
              <p><strong>Do not use any unfair means</strong>. This includes but is not limited to: 
                external help, copying code, or using unauthorized resources.</p>
            </div>
          </div>
          
          {testStatus.completed ? (
            <div className="text-center text-red-500">
              You have already completed the test.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Button 
                  onClick={handleFullScreen} 
                  className="w-full"
                  variant="outline"
                >
                  Enter Full Screen Mode
                </Button>
              </div>

              <AlertDialog open={showFullScreenDialog} onOpenChange={setShowFullScreenDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Full Screen Enabled</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are now in full-screen mode. Next, we'll request camera access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={handleCameraPermission}>
                      Allow Camera Access
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {isCameraAllowed && (
                <div className="mt-4">
                  <Button 
                    onClick={startTest} 
                    className="w-full"
                    disabled={!isCameraAllowed}
                  >
                    Start Test
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Coding Test</h1>
          <Timer 
            onTimeExpired={handleQuestionTimeExpired}
            onMoveToNextQuestion={(questionIndex) => {
              // This can be a direct call to handleQuestionTimeExpired 
              // or a simplified version of moving to the next question
              fetchQuestion(question?.id)
            }}
            onTestFullyExpired={handleTestFullyExpired}
            totalQuestions={3} 
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProblemStatement
              title={question?.title ?? ''}
              description={question?.description ?? ''}
              examples={question?.examples}
              isLoading={isLoading}
            />
            <TestCaseValidation
              testCases={question?.testCases ?? []}
              isLoading={isLoading}
            />
          </div>
          <div>
            <CodeEditor
              currentQuestionId={question?.id ?? ''}
              onQuestionChange={handleQuestionChange}
              onTestComplete={handleTestComplete}
            />
          </div>
        </div>
      </div>
      <AlertDialog 
        open={isTabSwitchWarningOpen} 
        onOpenChange={setIsTabSwitchWarningOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Tab Switching Detected</AlertDialogTitle>
            <AlertDialogDescription>
              {tabSwitchCount < 3 
                ? `You have ${3 - tabSwitchCount} warnings left. Multiple tab switches may result in test disqualification.`
                : "You have been disqualified from the test due to excessive tab switching."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsTabSwitchWarningOpen(false)}>
              Continue Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function Test() {
  return (
    <ToastProvider>
      <TestContent />
    </ToastProvider>
  )
}