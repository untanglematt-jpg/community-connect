// middleware.ts
// Place at the project root (same level as /app)
// Refreshes the auth session cookie on every request
// Redirects unauthenticated users away from /my-results and /admin/org
// Redirects non-org-admins away from /admin/org

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: object) {
          request.cookies.set({ name, value, ...options } as any)
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options } as any)
        },
        remove(name: string, options: object) {
          request.cookies.set({ name, value: '', ...options } as any)
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options } as any)
        },
      },
    }
  )

  // Refresh session — keeps cookie alive
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Protect /my-results — redirect to sign-in if not authenticated
  if (!session && pathname.startsWith('/my-results')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Protect /admin/org — redirect to sign-in if not authenticated
  if (!session && pathname.startsWith('/admin/org')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Protect /admin/org — redirect to / if authenticated but not org_admin
  if (session && pathname.startsWith('/admin/org')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'org_admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}