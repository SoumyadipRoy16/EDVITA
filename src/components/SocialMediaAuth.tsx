//src/components/SocialMediaAuth.tsx

import { Button } from "@/components/ui/button"
import { Github, Mail } from 'lucide-react'
import { useState } from 'react'
import { Toast } from "@/components/ui/toast"

type SocialMediaAuthProps = {
  action: 'Register' | 'Login'
  role?: 'user' | 'admin'
  onSocialAuth?: (provider: string, data: any) => Promise<void>
}

export function SocialMediaAuth({ action, role }: SocialMediaAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
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

  const handleAuth = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/auth/${provider}${role ? `?state=${role}` : ''}`)
      const data = await response.json()
      
      if (data.url) {
        // Store role in sessionStorage for callback handling
        if (role) {
          sessionStorage.setItem('auth_role', role)
        }
        window.location.href = data.url
      }
    } catch (error) {
      showToast("Failed to initialize authentication. Please try again.", "destructive")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {toast.visible && (
          <Toast 
            message={toast.message} 
            variant={toast.variant} 
            state={toast.visible ? "visible" : "hidden"}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          />
        )}
      <p className="text-center text-sm text-muted-foreground">
        Or {action.toLowerCase()} with
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleAuth('github')}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleAuth('google')}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  )
}