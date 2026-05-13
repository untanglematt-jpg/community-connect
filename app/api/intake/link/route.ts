// /app/api/intake/link/route.ts
// Links an existing anonymous session to a user_id after they sign in.
// Called by SavePrompt when the user was already signed in after completing intake.

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth-helpers-server'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    const supabase = createServerClient()

    const { data: { session: authSession } } = await supabase.auth.getSession()

    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('intake_sessions')
      .update({ user_id: authSession.user.id })
      .eq('id', sessionId)
      .is('user_id', null) // Only link if not already linked to someone else

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('intake/link error:', err)
    return NextResponse.json({ error: 'Failed to link session' }, { status: 500 })
  }
}