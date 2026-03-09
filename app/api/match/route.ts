import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getMatchesForSession } from '@/lib/matching'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    const { data: session, error } = await supabase
      .from('intake_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const matches = await getMatchesForSession(session)

    const referrals = Object.values(matches)
      .flat()
     .filter(m => m.organization.id !== 'crisis-dv-hotline')
.map(m => ({
  session_id: sessionId,
  organization_id: m.organization.id,
  domain: m.domain,
  match_score: m.match_score,
  status: 'suggested',
}))

    if (referrals.length > 0) {
      await supabase.from('referrals').insert(referrals)
    }

    return NextResponse.json({ matches, session  })
  } catch (err) {
    console.error('/api/match error:', err)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}