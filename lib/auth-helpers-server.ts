// /lib/auth-helpers-server.ts
// Server client only — import in server components and API routes

import { createServerClient as _createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: object) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: object) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )
}
