'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AboutYou } from '@/lib/intake-context'

const schema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
  householdSize: z.number().int().min(1).max(20),
  preferredLanguage: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function AboutYouForm({ onComplete }: { onComplete: (data: AboutYou) => void }) {
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit((data) => onComplete({
  ...data,
  preferredLanguage: data.preferredLanguage ?? 'english'
}))} className="space-y-6">
      <p className="text-stone-500 text-sm">Just a few quick details to help us find resources near you.</p>

      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip code</Label>
        <input
          id="zipCode"
          {...register('zipCode')}
          placeholder="e.g. 90210"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="householdSize">How many people are in your household?</Label>
        <input
          id="householdSize"
          type="number"
          {...register('householdSize', { valueAsNumber: true })}
          min={1}
          max={20}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.householdSize && <p className="text-red-500 text-xs">{errors.householdSize.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Preferred language <span className="text-stone-400 font-normal">(optional)</span></Label>
        <Select onValueChange={v => setValue('preferredLanguage', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Review My Results</Button>
    </form>
  )
}