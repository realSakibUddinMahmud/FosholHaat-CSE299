import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://fosholhaat-api.vercel.app';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> },
) {
  const { payoutId } = await params;
  const response = await fetch(`${BACKEND_URL}/seller/payouts/${payoutId}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

