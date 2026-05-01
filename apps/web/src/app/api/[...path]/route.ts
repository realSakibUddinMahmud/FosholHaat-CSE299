import { NextRequest, NextResponse } from 'next/server';
import { SESSION_TOKEN_COOKIE } from '../../../lib/session';

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://fosholhaat-api.vercel.app';

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = new URL(`${BACKEND_URL}/${path.join('/')}`);
  target.search = request.nextUrl.search;

  const token = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  console.log('PROXY TARGET:', target.href); const response = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method)
      ? undefined
      : await request.text(),
    cache: 'no-store',
  });

  const text = await response.text(); console.log('RESPONSE STATUS:', response.status); console.log('RESPONSE TEXT HEAD:', text.substring(0, 100));
  return new NextResponse(text, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'application/json' },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

