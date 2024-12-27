// app/api/auth/[provider]/callback/route.ts
import { NextResponse } from 'next/server';
import { getGoogleUserData, getGithubUserData, handleOAuthError } from '@/lib/authUtils';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const provider = params.provider;

  if (!code) {
    return NextResponse.redirect('/login?error=no_code');
  }

  try {
    let userData;
    if (provider === 'google') {
      userData = await getGoogleUserData(code);
    } else if (provider === 'github') {
      userData = await getGithubUserData(code);
    } else {
      return NextResponse.redirect('/login?error=invalid_provider');
    }

    // Verify email exists in database
    const verifyResponse = await fetch(`${process.env.OAUTH_REDIRECT_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        provider: provider
      })
    });

    if (!verifyResponse.ok) {
      return NextResponse.redirect('/login?error=email_not_registered');
    }

    const data = await verifyResponse.json();
    return NextResponse.redirect(data.dashboardUrl);
  } catch (error) {
    if (error instanceof Error) {
      return handleOAuthError(error);
    }
    return NextResponse.redirect('/login?error=unknown');
  }
}