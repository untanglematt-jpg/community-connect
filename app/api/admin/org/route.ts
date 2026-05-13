// /app/api/admin/org/route.ts
// GET  — returns the organization linked to the current user (via admin_user_id)
// PUT  — updates allowed fields; pass { confirm: true } to stamp last_verified

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth-helpers-server'

// Fields org admins are allowed to edit
const ALLOWED_FIELDS = ['description', 'phone', 'website', 'address', 'accepting', 'waitlist']

async function getAuthedOrgAdmin() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { error: 'Unauthorized', status: 401, supabase, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'org_admin') {
    return { error: 'Forbidden', status: 403, supabase, user: null }
  }

  return { error: null, status: 200, supabase, user: session.user }
}

export async function GET() {
  const { error, status, supabase, user } = await getAuthedOrgAdmin()

  if (error || !user) {
    return NextResponse.json({ error }, { status })
  }

  const { data: org, error: dbError } = await supabase
    .from('organizations')
    .select('*')
    .eq('admin_user_id', user.id)
    .single()

  if (dbError || !org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  return NextResponse.json({ org })
}

export async function PUT(req: NextRequest) {
  const { error, status, supabase, user } = await getAuthedOrgAdmin()

  if (error || !user) {
    return NextResponse.json({ error }, { status })
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('admin_user_id', user.id)
    .single()

  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  const body = await req.json()

  const updates: Record<string, unknown> = {}
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (body.confirm === true) {
    updates.last_verified = new Date().toISOString().split('T')[0]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: updated, error: updateError } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', org.id)
    .select('*')
    .single()

  if (updateError) {
    console.error('org admin PUT error:', updateError)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ org: updated })
}