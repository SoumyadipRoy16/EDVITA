import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    // Ensure database connection
    await connectMongoDB()

    // Get the email from the request headers (you'll need to implement this in your authentication middleware)
    const email = req.headers.get('x-user-email')

    // Check if email is present
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user by email 
    const user = await User.findOne({ email }).select(
      'firstName lastName email education skills resumeLink'
    )

    // If no user found
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform skills from string to array if needed
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      education: user.education || 'Not specified',
      skills: user.skills ? user.skills.split(',').map((skill: string) => skill.trim()) : [],
      resumeLink: user.resumeLink
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}