import { NextRequest, NextResponse } from 'next/server';

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
  return NextResponse.json(data, { status: backendResponse.status });
}
