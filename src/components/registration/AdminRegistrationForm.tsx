//src/components/registration/AdminRegistrationForm.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { AdminFormData, RegistrationFormProps } from '@/types/registration'

export function AdminRegistrationForm({ onSubmit }: RegistrationFormProps<AdminFormData>) {
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultOnSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'admin' }),
      })
      if (response.ok) {
        const userData = await response.json()
        login(userData)
        router.push('/login')
      } else {
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
    setIsSubmitting(false)
  }

  const submitHandler = onSubmit || defaultOnSubmit

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminFirstName">First Name</Label>
            <Input
              id="adminFirstName"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminLastName">Last Name</Label>
            <Input
              id="adminLastName"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email</Label>
          <Input
            id="adminEmail"
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
          <Label htmlFor="adminPassword">Password</Label>
          <Input
            id="adminPassword"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminCode">Admin Code</Label>
          <Input
            id="adminCode"
            type="password"
            {...register('adminCode', { required: 'Admin code is required' })}
          />
          {errors.adminCode && (
            <p className="text-sm text-destructive">{errors.adminCode.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Registering...' : 'Register as Admin'}
        </Button>
      </form>
    </div>
  )
}