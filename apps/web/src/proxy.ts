import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_ROLE_COOKIE,
  SESSION_TOKEN_COOKIE,
  nextRouteForRole,
} from "./lib/session";

const ROLE_PREFIXES = ["/buyer", "/seller", "/hub"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPrefix = ROLE_PREFIXES.find((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!protectedPrefix) return NextResponse.next();

  const token = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(SESSION_ROLE_COOKIE)?.value;

  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const expectedRoute = nextRouteForRole(role as never);
  if (!pathname.startsWith(expectedRoute)) {
    return NextResponse.redirect(new URL(expectedRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*", "/hub/:path*"],
};
