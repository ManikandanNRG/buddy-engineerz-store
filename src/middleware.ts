import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Admin route protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // We let the application handle the detailed admin checks
    // using the useRequireAdminAuth hook and admin_users table
    // to avoid syncing issues with user_metadata
    // Middleware cookie checks are disabled here because the client uses
    // localStorage which doesn't sync to cookies automatically.
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 