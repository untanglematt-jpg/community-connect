'use client'

import { useRouter } from 'next/navigation'
import { useIntake } from '@/lib/intake-context'
import { Button } from '@/components/ui/button'

// Safety is intentionally excluded — answers are used for routing only, never displayed
const DOMAINS = ['housing', 'nutrition', 'health', 'education', 'work']

const DOMAIN_LABELS: Record<string, string> = {
  housing:   '🏠 Housing',
  nutrition: '🥦 Nutrition',
  health:    '🏥 Health',
  education: '📚 Education',
  work:      '💼 Work',
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

export default function CompletePage() {
  const { results, aboutYou } = useIntake()
  const router = useRouter()

  const handleFindResources = async () => {
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results, aboutYou }),
    })
    const { sessionId } = await res.json()
    router.push(`/results?session=${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-stone-800 mb-2">Here's what we found</h1>
        <p className="text-stone-500 mb-8">Based on your answers, here's a summary of your needs across each area.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4 mb-6">
          {DOMAINS.map(domain => {
            const result = results[domain]
            if (!result) return null
            return (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-stone-700">{DOMAIN_LABELS[domain]}</span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${TIER_COLORS[result.tier]}`}>
                  {TIER_LABELS[result.tier]}
                </span>
              </div>
            )
          })}
        </div>

        <Button
          onClick={handleFindResources}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Find Resources →
        </Button>
      </div>
    </div>
  )
}