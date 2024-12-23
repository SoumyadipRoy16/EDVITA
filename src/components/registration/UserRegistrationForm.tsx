// src/components/registration/UserRegistrationForm.tsx
'use client'

import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserFormData, RegistrationFormProps } from '@/types/registration'

export function UserRegistrationForm({ onSubmit }: RegistrationFormProps<UserFormData>) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<UserFormData>()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const submitHandler = async (data: UserFormData) => {
    if (onSubmit) {
      setIsSubmitting(true)
      try {
        if (!otpSent) {
          // Ensure resume link is provided
          if (!data.resumeLink) {
            alert('Please provide a resume link from Google Drive or Dropbox')
            setIsSubmitting(false)
            return
          }
        }

        await onSubmit(data)
        
        if (!otpSent) {
          setOtpSent(true)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderInitialRegistrationForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>
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
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          {...register('education', { required: 'Education is required' })}
          placeholder="e.g., Computer Science, B.S."
        />
        {errors.education && (
          <p className="text-sm text-destructive">{errors.education.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          {...register('skills', { required: 'Skills are required' })}
          placeholder="e.g., JavaScript, React, Node.js"
        />
        {errors.skills && (
          <p className="text-sm text-destructive">{errors.skills.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeLink">Resume Link</Label>
        <Input
          id="resumeLink"
          placeholder="Paste Google Drive or Dropbox link"
          {...register('resumeLink', { 
            required: 'Resume link is required',
            pattern: {
              value: /^(https?:\/\/)?(drive\.google\.com|www\.dropbox\.com|docs\.google\.com)\/.*$/i,
              message: 'Please provide a valid Google Drive or Dropbox link'
            }
          })}
        />
        {errors.resumeLink && (
          <p className="text-sm text-destructive">{errors.resumeLink.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Accepted: Google Drive or Dropbox share links
        </p>
      </div>
    </>
  )

  const renderOTPVerificationForm = () => (
    <div className="space-y-2">
      <Label htmlFor="otp">Enter OTP</Label>
      <Input
        id="otp"
        type="text"
        {...register('otp', { 
          required: 'OTP is required',
          minLength: {
            value: 6,
            message: 'OTP must be 6 digits'
          },
          maxLength: {
            value: 6,
            message: 'OTP must be 6 digits'
          }
        })}
        placeholder="Enter 6-digit OTP"
      />
      {errors.otp && (
        <p className="text-sm text-destructive">{errors.otp.message}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {!otpSent ? renderInitialRegistrationForm() : renderOTPVerificationForm()}

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full"
        >
          {isSubmitting 
            ? otpSent 
              ? 'Verifying OTP...' 
              : 'Sending OTP...'
            : otpSent 
              ? 'Verify OTP' 
              : 'Send OTP'
          }
        </Button>
      </form>
    </div>
  )
}