'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { scoreWork } from '@/lib/scoring'
import type { DomainResult } from '@/lib/intake-context'

const schema = z.object({
  employmentStatus: z.enum(['employed_full_time', 'employed_part_time', 'unemployed_looking', 'unemployed_not_looking', 'unable_to_work']),
  incomeCoversNeeds: z.enum(['yes', 'sometimes', 'no']),
  workBarriers: z.string().min(1),
  interestedInTraining: z.enum(['yes', 'no', 'maybe']),
  hasTransportation: z.enum(['yes', 'no']),
})

type FormValues = z.infer<typeof schema>

export function WorkForm({ onComplete }: { onComplete: (r: DomainResult) => void }) {
  const { handleSubmit, register, formState: { isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    const { tier, flags } = scoreWork(data)
    onComplete({ domain: 'work', tier, flags })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-stone-500 text-sm">Your answers help us find the right resources for you. There are no wrong answers.</p>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">What is your current employment status?</p>
        <div className="space-y-2">
          {[
            ['employed_full_time', 'Employed full-time'],
            ['employed_part_time', 'Employed part-time'],
            ['unemployed_looking', 'Unemployed and looking'],
            ['unemployed_not_looking', 'Unemployed and not looking'],
            ['unable_to_work', 'Unable to work'],
          ].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('employmentStatus')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Is your current income enough to cover your basic needs?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['sometimes', 'Sometimes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('incomeCoversNeeds')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are there barriers preventing you from working?</p>
        <div className="space-y-2">
          {[
            ['transportation', 'Transportation'],
            ['childcare', 'Childcare'],
            ['language', 'Language'],
            ['disability', 'Disability'],
            ['criminal_record', 'Criminal record'],
            ['lack_of_credentials', 'Lack of credentials'],
            ['none', 'None'],
          ].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('workBarriers')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are you interested in job training, resume help, or employment connections?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('interestedInTraining')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you have reliable transportation to get to work or interviews?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('hasTransportation')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Continue</Button>
    </form>
  )
}