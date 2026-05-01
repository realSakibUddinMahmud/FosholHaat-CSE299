import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://fosholhaat-api.vercel.app';

export async function GET() {
  const response = await fetch(`${BACKEND_URL}/seller/payouts`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

