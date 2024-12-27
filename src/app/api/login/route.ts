// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  await connectDB()
  const { email, password, provider } = await request.json()

  try {
    // For social login email verification
    if (provider) {
      const user = await User.findOne({ email })
      if (!user) {
        return NextResponse.json({ success: false, message: 'Email not registered' }, { status: 401 })
      }
      // Create JWT token for social login
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret'
      )

      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })

      return NextResponse.json({
        success: true,
        user: {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        dashboardUrl: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      })
    }

    // Regular email/password login
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret'
    )

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      dashboardUrl: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 })
  }
}