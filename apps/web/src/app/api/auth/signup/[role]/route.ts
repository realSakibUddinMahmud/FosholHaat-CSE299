import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_LOCALE_COOKIE,
  SESSION_ROLE_COOKIE,
  SESSION_TOKEN_COOKIE,
} from '../../../../../lib/session';

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://fosholhaat-api.vercel.app';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> },
) {
  const { role } = await params;
  const body = await request.json();
  const backendResponse = await fetch(`${BACKEND_URL}/auth/signup/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, role }),
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

