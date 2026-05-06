import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_TOKEN_COOKIE } from "../../../../lib/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_TOKEN_COOKIE);
  return response;
}
