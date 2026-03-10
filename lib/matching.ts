import { supabase } from '@/lib/supabase'
import type { Organization, IntakeSession, MatchResult } from "@/types";

interface MatchInput {
  session: IntakeSession;
  organizations: Organization[];
}

const DOMAINS = ['housing', 'nutrition', 'health', 'education', 'safety', 'work'] as const

const CRISIS_RESOURCE: Organization = {
  id: 'crisis-dv-hotline',
  name: 'National Domestic Violence Hotline',
  type: 'nonprofit',
  description: 'Free, confidential support 24/7 for anyone affected by domestic violence, intimate partner violence, or stalking.',
  website: 'https://www.thehotline.org',
  phone: '1-800-799-7233',
  address: '',
  zip_codes: [],
  state_wide: true,
  languages: ['english', 'spanish'],
  domains: ['safety'],
  tier_served: [1],
  income_max_fpl: undefined,
age_min: undefined,
age_max: undefined,
  accepting: true,
  waitlist: false,
  verified: true,
}

export function scoreMatch(
  org: Organization,
  session: IntakeSession,
  domain: string
): number {
  let score = 0;

  // Domain alignment (required)
  if (!org.domains.includes(domain)) return 0;
  score += 40;

  // Get the tier for this domain
  const tierKey = `${domain}_tier` as keyof IntakeSession;
  const userTier = session[tierKey] as number;

  // Tier alignment
  if (org.tier_served.includes(userTier)) {
    score += 20;
  } else if (org.tier_served.includes(userTier + 1)) {
    score += 10;
  }

  // Geographic overlap
  if (org.state_wide) {
    score += 10;
  } else if (
    session.zip_code &&
    org.zip_codes.includes(session.zip_code)
  ) {
    score += 15;
  }

  // Capacity available
  if (org.accepting && !org.waitlist) {
    score += 10;
  } else if (org.accepting && org.waitlist) {
    score += 5;
  }

  // Language match
  if (
    session.preferred_language &&
    org.languages.includes(session.preferred_language)
  ) {
    score += 5;
  } else if (org.languages.includes("English")) {
    score += 3;
  }

  return Math.min(score, 100);
}

export function getMatches(
  { session, organizations }: MatchInput,
  domain: string,
  topN = 3
): MatchResult[] {
  const tierKey = `${domain}_tier` as keyof IntakeSession;
  const userTier = session[tierKey] as number;

  const scored = organizations
    .map((org) => ({
      organization: org,
      domain,
      match_score: scoreMatch(org, session, domain),
    }))
    .filter((m) => m.match_score > 0)
    .sort((a, b) => {
      // Tier 1 always first
      const aIsTier1 = a.organization.tier_served.includes(1) && userTier === 1;
      const bIsTier1 = b.organization.tier_served.includes(1) && userTier === 1;
      if (aIsTier1 && !bIsTier1) return -1;
      if (!aIsTier1 && bIsTier1) return 1;
      return b.match_score - a.match_score;
    });

  return scored.slice(0, topN);
}

export async function getMatchesForSession(
  session: IntakeSession
): Promise<Record<string, MatchResult[]>> {
  const { data: orgs, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('accepting', true)

  if (error || !orgs) throw new Error('Failed to fetch organizations')

  const results: Record<string, MatchResult[]> = {}

  for (const domain of DOMAINS) {
    const tierKey = `${domain}_tier` as keyof IntakeSession
    const tier = session[tierKey] as number | null
    if (!tier) continue

    const matches = getMatches({ session, organizations: orgs }, domain)

    // Prepend crisis resource if safety is Tier 1
    if (domain === 'safety' && tier === 1) {
      matches.unshift({
        organization: CRISIS_RESOURCE,
        domain: 'safety',
        match_score: 100,
      })
    }

    results[domain] = matches
  }

  return results
}