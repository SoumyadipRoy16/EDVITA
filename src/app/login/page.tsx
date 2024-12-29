'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
//import { SocialMediaAuth } from "@/components/SocialMediaAuth"
import { useAuth } from '@/contexts/AuthContext'
import { Toast } from "@/components/ui/toast"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"

type LoginFormData = {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  // Handle URL parameters for social auth errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      const errorMessages: { [key: string]: string } = {
        auth_failed: 'Authentication failed. Please try again.',
        invalid_provider: 'Invalid authentication provider.',
        no_email: 'Email access is required for authentication.',
        configuration: 'Authentication service is not properly configured.',
        unknown: 'An unexpected error occurred during authentication.'
      }
      setLoginError(errorMessages[error] || 'Authentication failed')
    }
  }, [])

  const processLogin = async (responseData: any) => {
    if (responseData.user) {
      login({
        name: `${responseData.user.firstName} ${responseData.user.lastName}`.trim(),
        role: responseData.user.role,
        email: responseData.user.email,
        authProvider: responseData.user.authProvider
      })

      // Redirect based on user role
      if (responseData.dashboardUrl) {
        router.push(responseData.dashboardUrl)
      } else if (responseData.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (responseData.user.role === 'user') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } else {
      throw new Error('Invalid response data')
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setLoginError(null)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      })
      
      const responseData = await response.json()
      
      if (response.ok) {
        await processLogin(responseData)
      } else {
        setLoginError(responseData.message || 'Login failed')
      }
    } catch (error) {
      console.error('Error during login:', error)
      setLoginError('An unexpected error occurred')
    }
    setIsSubmitting(false)
  }

  // Handle social auth callback
  const handleSocialAuth = async (provider: string, data: any) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          provider,
          accessToken: data.accessToken
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        await processLogin(responseData)
      } else {
        setLoginError(responseData.message || 'Social authentication failed')
      }
    } catch (error) {
      console.error('Error during social login:', error)
      setLoginError('An unexpected error occurred during social authentication')
    }
  }

  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        setLoginError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loginError])

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0">
        {undefined}
      </BackgroundBeamsWithCollision>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {loginError && (
          <Toast 
            message={loginError} 
            variant="destructive"
            state={loginError ? "visible" : "hidden"}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          />
        )}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}