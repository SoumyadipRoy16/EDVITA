// api/login/route.ts

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  await connectDB()

  const { email, password } = await request.json()

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
    )

    // Set the token in a cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    // Determine the dashboard URL based on user role
    const dashboardUrl = user.role === 'admin' ? '/admin/dashboard' : '/dashboard'

    return NextResponse.json({ 
      success: true, 
      user: { 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      dashboardUrl: dashboardUrl
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 })
  }
}