// src/app/api/login/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

type SocialAuthProvider = 'google' | 'github'

interface LoginRequest {
  email: string
  password?: string
  provider?: SocialAuthProvider
  accessToken?: string // For verifying social auth tokens
}

export async function POST(request: Request) {
  await connectDB()
  const data: LoginRequest = await request.json()
  const { email, password, provider, accessToken } = data

  try {
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Account not found' },
        { status: 401 }
      )
    }

    // Social authentication login
    if (provider) {
      // Verify that the user was created with the same provider
      if (user.authProvider !== provider) {
        return NextResponse.json(
          { 
            success: false, 
            message: `This email is registered with a different authentication method. Please use ${user.authProvider || 'email/password'} to login.`
          },
          { status: 401 }
        )
      }

      // Verify social auth token if provided
      if (accessToken) {
        try {
          const isValid = await verifySocialToken(provider, accessToken, email)
          if (!isValid) {
            return NextResponse.json(
              { success: false, message: 'Invalid authentication token' },
              { status: 401 }
            )
          }
        } catch (error) {
          console.error('Social token verification error:', error)
          return NextResponse.json(
            { success: false, message: 'Authentication failed' },
            { status: 401 }
          )
        }
      }
    } 
    // Regular email/password login
    else if (password) {
      // Ensure user has a password set
      if (!user.password) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This email is registered with a social account. Please login with the appropriate social provider.'
          },
          { status: 401 }
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid login method' },
        { status: 400 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        authProvider: user.authProvider || 'email'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    )

    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        authProvider: user.authProvider
      },
      dashboardUrl: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}

// Helper function to verify social auth tokens
async function verifySocialToken(
  provider: SocialAuthProvider,
  token: string,
  email: string
): Promise<boolean> {
  try {
    if (provider === 'google') {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
      )
      const data = await response.json()
      return data.email === email && !data.error
    } else if (provider === 'github') {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      })
      const data = await response.json()
      return data.email === email && !data.message // GitHub returns error in message field
    }
    return false
  } catch (error) {
    console.error('Token verification error:', error)
    return false
  }
}