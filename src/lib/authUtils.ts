// lib/authUtils.ts
import { NextResponse } from "next/server";

const redirectBase = 'http://localhost:3003/';

export function getGoogleAuthURL() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID is not configured');
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const options: Record<string, string> = {
    redirect_uri: 'http://localhost:3003/api/auth/google/callback',
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ')
  };
  
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export function getGithubAuthURL() {
  if (!process.env.GITHUB_CLIENT_ID) {
    throw new Error('GitHub Client ID is not configured');
  }

  const rootUrl = 'https://github.com/login/oauth/authorize';
  
  const options: Record<string, string> = {
    redirect_uri: 'http://localhost:3003/api/auth/github/callback',
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'user:email'
  };
  
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleUserData(code: string): Promise<{ email: string, name?: string }> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth configuration is incomplete');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3003/api/auth/google/callback',
      grant_type: 'authorization_code'
    })
  });

  const tokenData = await tokenResponse.json();
  
  if (!tokenData.access_token) {
    throw new Error('Failed to get access token from Google');
  }

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  
  const userData = await userResponse.json();
  return {
    email: userData.email,
    name: userData.name
  };
}

export async function getGithubUserData(code: string): Promise<{ email: string; name?: string }> {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth configuration is incomplete');
  }

  // Get access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: 'http://localhost:3003/api/auth/github/callback' // Update this URL for production
    })
  });

  const tokenData = await tokenResponse.json();
  
  if (!tokenData.access_token) {
    throw new Error('Failed to get access token from GitHub');
  }

  // Get user data
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/json'
    }
  });

  const userData = await userResponse.json();

  // Get user's email
  const emailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/json'
    }
  });

  const emails = await emailResponse.json();
  const primaryEmail = emails.find((email: any) => email.primary)?.email;

  if (!primaryEmail) {
    throw new Error('No primary email found in GitHub account');
  }

  return {
    email: primaryEmail,
    name: userData.name || userData.login // Fallback to login if name is not available
  };
}

// Handle OAuth errors with appropriate redirects
export function handleOAuthError(error: Error) {
  console.error('OAuth Error:', error);
  let redirectUrl = '/login?';
  
  if (error.message.includes('configuration')) {
    redirectUrl += 'error=configuration';
  } else if (error.message.includes('token')) {
    redirectUrl += 'error=auth_failed';
  } else if (error.message.includes('email')) {
    redirectUrl += 'error=email_required';
  } else {
    redirectUrl += 'error=unknown';
  }
  
  return NextResponse.redirect(new URL(redirectUrl, redirectBase));
}