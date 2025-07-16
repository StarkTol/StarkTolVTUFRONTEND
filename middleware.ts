import { NextRequest, NextResponse } from "next/server"

// Define public paths
const publicPaths = ["/", "/login", "/register", "/about"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If route is public, allow
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Read token from cookies (if set by your auth)
  const token = request.cookies.get("accessToken")?.value

  // If token not present and trying to access a protected route
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Token is present or route is public → allow
  return NextResponse.next()
}

// Tell Next.js which routes should run this middleware
export const config = {
  matcher: [
    /*
     * Apply to all routes except:
     * - static files
     * - _next
     * - public routes listed above
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)",
  ],
}
