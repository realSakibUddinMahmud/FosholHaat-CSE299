import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_LOCALE_COOKIE,
  SESSION_ROLE_COOKIE,
  SESSION_TOKEN_COOKIE,
} from '../../../../lib/session';

/**
 * Next.js route handler that proxies POST /api/auth/login
 * to the NestJS backend running on port 3000.
 *
 * This exists because the web frontend and NestJS API run on separate ports
 * in development. The frontend fetches /api/auth/login which hits this handler,
 * which forwards to http://localhost:3000/auth/login.
 */
const BACKEND_URL = process.env.API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();
  const response = NextResponse.json(data, { status: backendResponse.status });

  if (backendResponse.ok && data?.sessionToken && data?.user?.role) {
    response.cookies.set(SESSION_TOKEN_COOKIE, data.sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    response.cookies.set(SESSION_ROLE_COOKIE, data.user.role, {
      sameSite: 'lax',
      path: '/',
    });
    response.cookies.set(SESSION_LOCALE_COOKIE, data.user.locale ?? 'bn', {
      sameSite: 'lax',
      path: '/',
    });
  }

  return response;
}
