// src/components/dashboard/ProfileOverview.tsx

'use client'

import { User, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"

type UserData = {
  firstName: string
  lastName: string
  email: string
  education: string
  skills: string[]
  resumeLink: string
}

export default function ProfileOverview() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false)
  const { user, fetchWithAuth } = useAuth()

useEffect(() => {
  async function fetchUserData() {
    try {
      setIsLoading(true)
      const response = await fetchWithAuth('/api/user')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user data')
      }
      
      const data = await response.json()
      setUserData(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (user) {
    fetchUserData()
  }
}, [user, fetchWithAuth])

  const handleViewResume = () => {
    if (userData?.resumeLink) {
      window.open(userData.resumeLink, '_blank')
    }
  }

  if (!user) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <CardContent>Please log in to view your profile</CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-8 w-[120px] mt-4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6 text-destructive">
          {error}
        </CardContent>
      </Card>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <User size={48} className="text-primary mr-4" />
            <div>
              <p className="font-medium text-foreground">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="font-medium">Education:</span> {userData.education}
            </p>
            <p className="text-foreground">
              <span className="font-medium">Skills:</span>{' '}
              {userData.skills.length > 0 
                ? userData.skills.join(', ') 
                : 'No skills specified'}
            </p>
            <div className="flex items-center mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewResume}
                className="flex items-center"
                disabled={!userData.resumeLink}
              >
                <Eye className="mr-2 h-4 w-4" /> 
                {userData.resumeLink ? 'View Resume' : 'No Resume Available'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[600px]">
            {userData.resumeLink ? (
              <iframe 
                src={userData.resumeLink} 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Resume Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No resume available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}