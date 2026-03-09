import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { results, aboutYou } = await req.json()

    const { data, error } = await supabase
      .from('intake_sessions')
      .insert({
        zip_code:          aboutYou?.zipCode,
        household_size:    aboutYou?.householdSize,
        preferred_language: aboutYou?.preferredLanguage ?? 'english',
        housing_tier:      results?.housing?.tier    ?? null,
        nutrition_tier:    results?.nutrition?.tier  ?? null,
        health_tier:       results?.health?.tier     ?? null,
        education_tier:    results?.education?.tier  ?? null,
        safety_tier:       results?.safety?.tier     ?? null,
        work_tier:         results?.work?.tier       ?? null,
        housing_flags:     results?.housing?.flags   ?? [],
        nutrition_flags:   results?.nutrition?.flags ?? [],
        health_flags:      results?.health?.flags    ?? [],
        education_flags:   results?.education?.flags ?? [],
        safety_flags:      results?.safety?.flags    ?? [],
        work_flags:        results?.work?.flags      ?? [],
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ sessionId: data.id })
  } catch (err) {
    console.error('intake POST error:', err)
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 })
  }
}