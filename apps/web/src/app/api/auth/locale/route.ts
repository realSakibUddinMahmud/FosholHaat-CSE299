import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js route handler that proxies POST /api/auth/locale
 * to the NestJS backend running on port 3000.
 */
const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://fosholhaat-api.vercel.app';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(`${BACKEND_URL}/auth/locale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}

