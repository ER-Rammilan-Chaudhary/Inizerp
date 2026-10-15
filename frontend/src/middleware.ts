import { NextResponse } from "next/server";

/**
 * Middleware deliberately does not perform authorization.
 * Authorization is enforced by the backend through authenticate(),
 * tenantMiddleware(), authorize(), and permissionMiddleware().
 *
 * The browser-side ProtectedRoute only improves navigation/UX; it is not a
 * security boundary.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
