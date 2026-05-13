'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Org = {
  id: string
  name: string
  description: string | null
  phone: string | null
  website: string | null
  address: string | null
  accepting: boolean
  waitlist: boolean
  last_verified: string | null
  domains: string[]
  tier_served: number[]
}

const schema = z.object({
  description: z.string().min(1, 'Description is required').max(1000),
  phone: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const TIER_LABELS: Record<number, string> = {
  1: 'Crisis', 2: 'Unstable', 3: 'At Risk', 4: 'Stable',
}

const DOMAIN_LABELS: Record<string, string> = {
  housing: '🏠 Housing', nutrition: '🥦 Nutrition', health: '🏥 Health',
  education: '📚 Education', safety: '🛡️ Safety', work: '💼 Work',
}

export default function OrgAdminPage() {
  const [org, setOrg] = useState<Org | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  useEffect(() => {
    fetch('/api/admin/org')
      .then(r => r.json())
      .then(({ org }) => {
        if (org) {
          setOrg(org)
          reset({
            description: org.description ?? '',
            phone: org.phone ?? '',
            website: org.website ?? '',
            address: org.address ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (data: FormValues) => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/admin/org', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const { org: updated } = await res.json()
      setOrg(updated)
      reset(data)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const toggleAccepting = async () => {
    if (!org) return
    const updated = { ...org, accepting: !org.accepting }
    setOrg(updated)
    await fetch('/api/admin/org', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepting: updated.accepting }),
    })
  }

  const toggleWaitlist = async () => {
    if (!org) return
    const updated = { ...org, waitlist: !org.waitlist }
    setOrg(updated)
    await fetch('/api/admin/org', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waitlist: updated.waitlist }),
    })
  }

  const confirmListing = async () => {
    setConfirming(true)
    try {
      const res = await fetch('/api/admin/org', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      const { org: updated } = await res.json()
      setOrg(updated)
      setConfirmed(true)
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-stone-500 text-sm">Loading your listing…</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 max-w-sm text-center">
          <p className="text-stone-700 font-medium mb-2">No organization linked</p>
          <p className="text-stone-500 text-sm">
            Your account hasn't been linked to an organization yet. Contact your platform administrator.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="mb-8">
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Org Admin Portal</p>
          <h1 className="text-2xl font-semibold text-stone-800">{org.name}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">About this listing</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(org.domains ?? []).map(d => (
              <span key={d} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                {DOMAIN_LABELS[d] ?? d}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(org.tier_served ?? []).map(t => (
              <span key={t} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Tier {t} — {TIER_LABELS[t]}
              </span>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-4">
            Domains and tiers served are managed by the platform team. Contact us to update them.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Availability</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-700 font-medium text-sm">Currently accepting referrals</p>
                <p className="text-stone-400 text-xs">Turn off if your capacity is full</p>
              </div>
              <button
                onClick={toggleAccepting}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  org.accepting ? 'bg-green-500' : 'bg-stone-200'
                }`}
                role="switch"
                aria-checked={org.accepting}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  org.accepting ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-700 font-medium text-sm">Waitlist open</p>
                <p className="text-stone-400 text-xs">Show users they can join a waitlist</p>
              </div>
              <button
                onClick={toggleWaitlist}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  org.waitlist ? 'bg-amber-500' : 'bg-stone-200'
                }`}
                role="switch"
                aria-checked={org.waitlist}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  org.waitlist ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Listing details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Describe who you serve and what you offer…"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone number</Label>
              <input
                id="phone"
                {...register('phone')}
                type="tel"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. (555) 000-1234"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="website">Website</Label>
              <input
                id="website"
                {...register('website')}
                type="url"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://…"
              />
              {errors.website && (
                <p className="text-red-500 text-xs">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <input
                id="address"
                {...register('address')}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="123 Main St, City, State 00000"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={saving || !isDirty}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              {saveSuccess && (
                <p className="text-green-600 text-sm">Saved ✓</p>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-1">Listing verification</h2>
          <p className="text-stone-500 text-sm mb-4">
            Confirm that your listing is current — contact info, availability, and description are all accurate.
          </p>
          {org.last_verified && (
            <p className="text-xs text-stone-400 mb-3">
              Last verified: <span className="font-medium text-stone-600">{org.last_verified}</span>
            </p>
          )}
          <Button
            onClick={confirmListing}
            disabled={confirming}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {confirming ? 'Confirming…' : confirmed ? 'Confirmed ✓' : 'Confirm listing is up to date'}
          </Button>
        </div>

      </div>
    </div>
  )
}