import { NextRequest, NextResponse } from 'next/server';
import { SESSION_TOKEN_COOKIE } from '../../lib/session';

export function getBackendUrl() {
  const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (url) return url.replace(/\/$/, '');
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000';
  }
  throw new Error('API_URL is required in production');
}

export async function proxyBackend(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const target = new URL(`${getBackendUrl()}/${path.join('/')}`);
  target.search = request.nextUrl.search;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    cache: 'no-store',
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'application/json' },
  });
}
