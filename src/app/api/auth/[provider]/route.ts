// app/api/auth/[provider]/route.ts
import { NextResponse } from 'next/server';
import { getGoogleAuthURL, getGithubAuthURL } from '@/lib/authUtils';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;

  try {
    let authUrl = '';
    if (provider === 'google') {
      authUrl = getGoogleAuthURL();
    } else if (provider === 'github') {
      authUrl = getGithubAuthURL();
    } else {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Authorization failed' },
      { status: 500 }
    );
  }
}