import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET() {
  const response = await fetch(`${BACKEND_URL}/seller/payouts`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
