import { NextResponse } from 'next/server';
import { getGoogleUserData, getGithubUserData } from '@/lib/authUtils';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const role = searchParams.get('role') || 'user';

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    await connectDB();

    let userData;
    if (params.provider === 'google') {
      userData = await getGoogleUserData(code);
    } else if (params.provider === 'github') {
      userData = await getGithubUserData(code);
    } else {
      return NextResponse.redirect(new URL('/login?error=invalid_provider', request.url));
    }

    if (!userData?.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url));
    }

    // Check if user exists
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      // Create new user
      user = new User({
        email: userData.email,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        role: role,
        authProvider: params.provider
      });
      await user.save();
    }

    // Generate JWT token
    const token = sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Determine redirect path
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    const redirectUrl = new URL(redirectPath, baseUrl);

    // Create response with redirect
    const response = NextResponse.redirect(redirectUrl);

    // Set authentication cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}