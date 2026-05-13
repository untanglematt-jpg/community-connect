/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/my-results/page.tsx
// Server component — protected by middleware
// Shows a logged-in user their previous intake sessions

import Link from 'next/link'
import { createServerClient } from '@/lib/auth-helpers-server'
import { Button } from '@/components/ui/button'

const DOMAIN_LABELS: Record<string, string> = {
  housing: '🏠 Housing',
  nutrition: '🥦 Nutrition',
  health: '🏥 Health',
  education: '📚 Education',
  work: '💼 Work',
}

const TIER_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
}

const TIER_LABELS: Record<number, string> = {
  1: 'Crisis',
  2: 'Unstable',
  3: 'At Risk',
  4: 'Stable',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

export default async function MyResultsPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: sessions } = await supabase
    .from('intake_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const hasSessions = sessions && sessions.length > 0

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800">Your saved results</h1>
            <p className="text-stone-500 text-sm mt-1">Your previous needs assessments.</p>
          </div>
          <Link href="/intake/housing">
            <Button variant="outline" className="border-stone-200 text-stone-700 text-sm">
              New assessment
            </Button>
          </Link>
        </div>

        {!hasSessions ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 text-center">
            <p className="text-stone-500 text-sm mb-4">You don&apos;t have any saved results yet.</p>
            <Link href="/intake/housing">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Start a new assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s: any) => (
              <div key={s.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-stone-500">{formatDate(s.created_at)}</p>
                  <Link href={`/results?session=${s.id}`}>
                    <Button size="sm" variant="outline" className="text-xs border-stone-200">
                      View resources →
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DOMAIN_LABELS).map(([domain, label]) => {
                    const tier = s[`${domain}_tier`] as number | null
                    if (!tier) return null
                    return (
                      <div key={domain} className="flex items-center justify-between gap-2">
                        <span className="text-stone-600 text-sm">{label}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_COLORS[tier] || ''}`}>
                          {TIER_LABELS[tier] || '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}