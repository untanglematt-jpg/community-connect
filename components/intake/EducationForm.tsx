'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { scoreEducation } from '@/lib/scoring'
import type { DomainResult } from '@/lib/intake-context'

const schema = z.object({
  highestEducation: z.string().min(1),
  currentlyInSchool: z.enum(['yes', 'no', 'interested']),
  internetAccess: z.enum(['yes', 'no']),
  educationBarriers: z.enum(['yes', 'no']),
  childEnrolled: z.enum(['na', 'yes', 'enrolled_not_attending', 'not_enrolled']),
})

type FormValues = z.infer<typeof schema>

export function EducationForm({ onComplete }: { onComplete: (r: DomainResult) => void }) {
  const { handleSubmit, register, setValue, formState: { isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormValues) => {
    const { tier, flags } = scoreEducation(data)
    onComplete({ domain: 'education', tier, flags })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-stone-500 text-sm">Your answers help us find the right resources for you. There are no wrong answers.</p>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">What is the highest level of education you have completed?</p>
        <Select onValueChange={v => setValue('highestEducation', v, { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less_than_high_school">Less than high school</SelectItem>
            <SelectItem value="high_school_ged">High school / GED</SelectItem>
            <SelectItem value="some_college">Some college</SelectItem>
            <SelectItem value="associates">Associate's degree</SelectItem>
            <SelectItem value="bachelors">Bachelor's degree</SelectItem>
            <SelectItem value="graduate">Graduate degree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are you currently in school or job training?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No'], ['interested', 'Not yet, but interested']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('currentlyInSchool')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Do you have reliable access to the internet and a device for learning?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('internetAccess')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are there barriers keeping you or someone in your household from accessing education?</p>
        <div className="space-y-2">
          {[['yes', 'Yes'], ['no', 'No']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('educationBarriers')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base font-medium text-stone-800">Are school-age children in your household enrolled and attending?</p>
        <div className="space-y-2">
          {[
            ['na', 'Not applicable'],
            ['yes', 'Yes, enrolled and attending'],
            ['enrolled_not_attending', 'Enrolled but not attending'],
            ['not_enrolled', 'Not enrolled'],
          ].map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" value={val} {...register('childEnrolled')} className="w-4 h-4 accent-green-600" />
              <span className="text-stone-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">Continue</Button>
    </form>
  )
}