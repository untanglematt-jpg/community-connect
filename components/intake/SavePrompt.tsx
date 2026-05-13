// /components/intake/SavePrompt.tsx
// Optional save-results banner — shown on /intake/complete
// Never blocks the flow. Can be dismissed.
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@/lib/auth-helpers'

type Props = {
  sessionId: string | null
}

export function SavePrompt({ sessionId }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [saved, setSaved] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  // Still loading auth state
  if (isLoggedIn === null || dismissed || !sessionId) return null

  if (saved) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="text-green-600 text-lg">✓</span>
        <p className="text-sm text-green-800">Your results are saved. You can view them any time from <Link href="/my-results" className="underline underline-offset-2">My saved results</Link>.</p>
      </div>
    )
  }

  if (isLoggedIn) {
    // Already signed in — offer one-click save
    const handleSave = async () => {
      setSaving(true)
      // The session was already saved with user_id if the user was signed in at intake time.
      // If they signed in after completing intake, re-POST to link user_id.
      try {
        await fetch('/api/intake/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        setSaved(true)
      } catch {
        setSaving(false)
      }
    }

    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-green-800">Want to save these results so you can come back?</p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
            {saving ? 'Saving...' : 'Save results'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)} className="text-stone-500">
            No thanks
          </Button>
        </div>
      </div>
    )
  }

  // Not signed in — invite to create account or sign in
  return (
    <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 mb-6">
      <p className="text-sm text-stone-700 mb-3">
        Create a free account to save these results and come back any time.
      </p>
      <div className="flex gap-3">
        <Link href={`/auth/sign-up?returnTo=/my-results`}>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Create account</Button>
        </Link>
        <Link href={`/auth/sign-in?returnTo=/my-results`}>
          <Button size="sm" variant="outline" className="border-stone-200 text-stone-700">Sign in</Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)} className="text-stone-400">
          Skip
        </Button>
      </div>
    </div>
  )
}