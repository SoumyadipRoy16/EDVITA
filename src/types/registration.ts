// src/types/registration.ts

export interface UserFormData {
  firstName?: string
  lastName?: string
  email: string
  password: string
  education?: string
  skills?: string
  resumeLink?: string
  otp?: string
  role?: 'user' | 'admin'
}

export interface AdminFormData extends UserFormData {
  adminCode?: string
}

export interface OTPVerificationResponse {
  success: boolean
  message?: string
  user?: any
  otpRequired?: boolean
  registrationData?: Partial<UserFormData | AdminFormData>
}

export interface RegistrationFormProps<T extends UserFormData | AdminFormData> {
  onSubmit?: (data: T) => Promise<void>
}