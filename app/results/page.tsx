'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DomainSection } from '@/components/results/DomainSection'
import type { MatchResult, IntakeSession } from '@/types'

const DOMAIN_ORDER = ['safety', 'housing', 'nutrition', 'health', 'education', 'work']

type PageData = {
  matches: Record<string, MatchResult[]>
  session: IntakeSession
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 text-sm">Finding resources for you…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-stone-700">Something went wrong. Please try again or call 211 for immediate help.</p>
          <a href="tel:211" className="text-green-700 font-medium underline text-sm">📞 211 — free, confidential, 24/7</a>
        </div>
      </div>
    )
  }

  const urgentDomains = DOMAIN_ORDER.filter(domain => {
  const matches = data.matches[domain]
  if (!matches || matches.length === 0) return false
  const tierKey = `${domain}_tier` as keyof typeof data.session
  return (data.session[tierKey] as number) <= 2
})

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-stone-800 mb-2">Your resources</h1>
        <p className="text-stone-500 mb-8 text-sm">
          Here are organizations that may be able to help, based on your answers. Tap a phone number or website to reach them directly.
        </p>

        {urgentDomains.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center space-y-3">
            <p className="text-stone-600 text-sm">Based on your answers, you appear to be in a relatively stable situation. If you ever need support, 211 is always available.</p>
            <a href="tel:211" className="text-green-700 font-medium underline text-sm">📞 211 — free, confidential, 24/7</a>
          </div>
        ) : (
          urgentDomains.map(domain => (
            <DomainSection
              key={domain}
              domain={domain}
tier={data.session[`${domain}_tier` as keyof IntakeSession] as number}              matches={data.matches[domain]}
            />
          ))
        )}

        <div className="mt-6 bg-white rounded-2xl border border-stone-100 p-5 space-y-2">
          <p className="text-sm font-medium text-stone-700">Need more help?</p>
          <p className="text-sm text-stone-500">211 connects you to local health and human services — free, confidential, available 24/7.</p>
          <a href="tel:211" className="block text-sm text-green-700 font-medium underline">📞 Call or text 211</a>
          <a href="https://www.211.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-green-700 font-medium underline">🌐 211.org — search online</a>
        </div>
      </div>
    </div>
  )
}