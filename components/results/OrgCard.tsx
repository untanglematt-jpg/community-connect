'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { Organization } from '@/types'

const TYPE_COLORS: Record<string, string> = {
  government: 'bg-blue-100 text-blue-700',
  nonprofit:  'bg-purple-100 text-purple-700',
  private:    'bg-stone-100 text-stone-700',
}

type Props = {
  org: Organization
  referralId?: string
}

export function OrgCard({ org, referralId }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleHelpful = async () => {
    setClicked(true)
    if (referralId) {
      await supabase.from('referrals').update({ status: 'clicked' }).eq('id', referralId)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-800 text-base leading-snug">{org.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${TYPE_COLORS[org.type]}`}>
          {org.type}
        </span>
      </div>

      {org.waitlist && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ This organization currently has a waitlist.
        </p>
      )}

      <p className={`text-sm text-stone-600 ${!expanded ? 'line-clamp-2' : ''}`}>
        {org.description}
      </p>
      {org.description.length > 120 && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-green-600 underline">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="flex flex-col gap-2 pt-1">
        {org.phone && (
          <a href={`tel:${org.phone}`} className="text-sm text-green-700 font-medium underline">
            📞 {org.phone}
          </a>
        )}
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 font-medium underline">
            🌐 Visit website
          </a>
        )}
      </div>

      <Button
        variant={clicked ? 'outline' : 'default'}
        size="sm"
        className="w-full mt-2"
        onClick={handleHelpful}
        disabled={clicked}
      >
        {clicked ? '✓ Marked as helpful' : 'This looks helpful'}
      </Button>
    </div>
  )
}