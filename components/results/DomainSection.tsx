import { OrgCard } from './OrgCard'
import type { OrgMatch } from '@/lib/matching'

const DOMAIN_META: Record<string, { label: string; emoji: string; blurb: string }> = {
  housing:   { label: 'Housing',   emoji: '🏠', blurb: 'Based on what you shared about your housing situation, these organizations may be able to help.' },
  nutrition: { label: 'Nutrition', emoji: '🥦', blurb: 'Based on what you shared about food access, these organizations may be able to help.' },
  health:    { label: 'Health',    emoji: '🏥', blurb: 'Based on what you shared about your health needs, these organizations may be able to help.' },
  education: { label: 'Education', emoji: '📚', blurb: 'Based on what you shared about education access, these organizations may be able to help.' },
  safety:    { label: 'Safety',    emoji: '🛡️', blurb: 'Based on what you shared, these resources are here to support you.' },
  work:      { label: 'Work',      emoji: '💼', blurb: 'Based on what you shared about your work situation, these organizations may be able to help.' },
}

const TIER_LABELS: Record<number, string> = { 1: 'Crisis', 2: 'Unstable', 3: 'At Risk', 4: 'Stable' }
const TIER_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
}

type Props = {
  domain: string
  tier: number
  matches: OrgMatch[]
  referralIds?: Record<string, string>
}

export function DomainSection({ domain, tier, matches, referralIds = {} }: Props) {
  const meta = DOMAIN_META[domain]

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{meta.emoji}</span>
        <h2 className="text-lg font-semibold text-stone-800">{meta.label}</h2>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${TIER_COLORS[tier]}`}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <p className="text-sm text-stone-500 mb-4">{meta.blurb}</p>

      {matches.length === 0 ? (
        <NoResultsFallback domain={domain} />
      ) : (
        <div className="space-y-4">
          {matches.map(m => (
  <OrgCard key={m.organization.id} org={m.organization} referralId={referralIds[m.organization.id]} />
))}
        </div>
      )}
    </div>
  )
}

function NoResultsFallback({ domain }: { domain: string }) {
  return (
    <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 space-y-3">
      <p className="text-sm text-stone-600">
        We&apos;re still building our list of {domain} resources in your area. In the meantime, <strong>211</strong> can connect you with local help.
      </p>
      <a href="tel:211" className="block text-sm text-green-700 font-medium underline">
        📞 Call or text 211 — free, confidential, 24/7
      </a>
    </div>
  )
}