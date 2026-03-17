import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MATCHING_SERVICE_URL = process.env.MATCHING_SERVICE_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    // Fetch the session so we can return it to the results page
    const { data: session, error } = await supabase
      .from('intake_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Call Python matching service
    const res = await fetch(`${MATCHING_SERVICE_URL}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })

    if (!res.ok) throw new Error(`Matching service error: ${res.status}`)

    const { results } = await res.json()

    // Convert Python response array into the Record<domain, matches[]> shape
    // that the results page expects
    const matches: Record<string, any[]> = {}
    for (const domainResult of results) {
      matches[domainResult.domain] = domainResult.matches.map((m: any) => ({
        organization: {
          id: m.org_id,
          name: m.name,
          description: m.description,
          phone: m.phone,
          website: m.website,
          accepting: m.accepting,
          waitlist: m.waitlist,
          tier_served: m.tier_served,
        },
        domain: m.domain,
        match_score: m.match_score,
      }))
    }

    // Save referrals to Supabase (same as before)
    const referrals = results
      .flatMap((d: any) => d.matches)
      .filter((m: any) => m.org_id !== 'crisis-dv-hotline')
      .map((m: any) => ({
        session_id: sessionId,
        organization_id: m.org_id,
        domain: m.domain,
        match_score: m.match_score,
        status: 'suggested',
      }))

    if (referrals.length > 0) {
      await supabase.from('referrals').insert(referrals)
    }

    return NextResponse.json({ matches, session })
  } catch (err) {
    console.error('/api/match error:', err)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}