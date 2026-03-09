'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { scoreHousing } from '@/lib/scoring'
import type { DomainResult } from '@/lib/intake-context'

const schema = z.object({
  stableHousing: z.enum(['yes', 'at_risk', 'no']),
  worryLosing: z.enum(['yes', 'no']),
  utilities: z.enum(['yes', 'no', 'some_issues']),
  safetyConcerns: z.enum(['yes', 'no']),
  overcrowded: z.enum(['yes', 'no']),
})

type FormValues = z.infer<typeof schema>

export function HousingForm({ onComplete }: { onComplete: (r: DomainResult) => void }) {
  const { handleSubmit, register, formState: { isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    const { tier, flags } = scoreHousing(data)
    onComplete({ domain: 'housing', tier, flags })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-stone-500 text-sm">Your answers help us find the right resources for you. There are no wrong answers.</p>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you have a stable place to live right now?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['at_risk', 'At risk'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('stableHousing')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are you worried about losing your housing in the next 2 months?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('worryLosing')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Does your home have working heat, running water, and electricity?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['some_issues', 'Some issues'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('utilities')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are there safety concerns in your home (mold, pests, structural damage)?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('safetyConcerns')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Is your home overcrowded — more than 2 people per bedroom?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('overcrowded')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Continue</Button>
    </form>
  )
}