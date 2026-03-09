'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { scoreSafety } from '@/lib/scoring'
import type { DomainResult } from '@/lib/intake-context'

const schema = z.object({
  feelsSafe: z.enum(['yes', 'sometimes', 'no']),
  physicalHarm: z.enum(['yes', 'no', 'prefer_not_to_say']),
  unsafeSituation: z.enum(['yes', 'no', 'prefer_not_to_say']),
  criminalJustice: z.enum(['yes', 'no']),
})

type FormValues = z.infer<typeof schema>

export function SafetyForm({ onComplete }: { onComplete: (r: DomainResult) => void }) {
  const { handleSubmit, register, formState: { isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    const { tier, flags } = scoreSafety(data)
    onComplete({ domain: 'safety', tier, flags })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          This next section asks about personal safety. Your answers are completely private and are only used to connect you with helpful resources — never shared or displayed. Take your time, and only share what feels comfortable.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you feel safe in your home and neighborhood?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['sometimes', 'Sometimes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('feelsSafe')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">In the past 12 months, has anyone physically hurt you or threatened to hurt you?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No'], ['prefer_not_to_say', 'Prefer not to say']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('physicalHarm')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are you currently in a situation at home that feels unsafe or threatening?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No'], ['prefer_not_to_say', 'Prefer not to say']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('unsafeSituation')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Has contact with the criminal justice system affected your daily life?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('criminalJustice')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Continue</Button>
    </form>
  )
}