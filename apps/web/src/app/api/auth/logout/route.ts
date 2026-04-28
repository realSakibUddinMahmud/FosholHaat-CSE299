import { NextResponse } from "next/server";
import { SESSION_TOKEN_COOKIE } from "../../../../lib/session";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost:3001"));
  response.cookies.delete(SESSION_TOKEN_COOKIE);
  return response;
}
