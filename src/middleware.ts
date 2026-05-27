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
    const isAdmin = session?.user?.user_metadata?.role === 'admin'

    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      // If already logged in as admin, redirect to dashboard
      if (session && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return res
    }

    // If not logged in, redirect to admin login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // If logged in but not an admin, redirect to home page
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 