'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { scoreHealth } from '@/lib/scoring'
import type { DomainResult } from '@/lib/intake-context'

const schema = z.object({
  hasInsurance: z.enum(['yes', 'no']),
  unableToGetCare: z.enum(['yes', 'no']),
  ongoingConditions: z.enum(['yes', 'no']),
  medicationAccess: z.enum(['yes', 'sometimes', 'no']),
  mentalHealth: z.enum(['1', '2', '3', '4', '5']),
})

type FormValues = z.infer<typeof schema>

export function HealthForm({ onComplete }: { onComplete: (r: DomainResult) => void }) {
  const { handleSubmit, register, formState: { isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    const { tier, flags } = scoreHealth(data)
    onComplete({ domain: 'health', tier, flags })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-stone-500 text-sm">Your answers help us find the right resources for you. There are no wrong answers.</p>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you currently have health insurance or a regular doctor?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('hasInsurance')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">In the last 12 months, have you been unable to get healthcare when you needed it?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('unableToGetCare')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are you managing any ongoing health conditions?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('ongoingConditions')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you have access to the medications you need?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['sometimes', 'Sometimes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('medicationAccess')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">How would you rate your mental and emotional health right now?</p>
        <p className="text-xs text-stone-400">1 = very poor, 5 = very good</p>
        <div className="flex gap-6 mt-2">
          {['1', '2', '3', '4', '5'].map((val) => (
            <label key={val} className="flex flex-col items-center gap-1 cursor-pointer">
              <input type="radio" value={val} {...register('mentalHealth')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700 text-sm">{val}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Continue</Button>
    </form>
  )
}