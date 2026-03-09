'use client'

import { Progress } from '@/components/ui/progress'

const STEPS = [
  { key: 'housing',   label: 'Housing',   emoji: '🏠' },
  { key: 'nutrition', label: 'Nutrition',  emoji: '🥦' },
  { key: 'health',    label: 'Health',     emoji: '🏥' },
  { key: 'education', label: 'Education',  emoji: '📚' },
  { key: 'safety',    label: 'Safety',     emoji: '🛡️' },
  { key: 'work',      label: 'Work',       emoji: '💼' },
  { key: 'about',     label: 'About You',  emoji: '👤' },
]

type Props = {
  currentStep: string
  children: React.ReactNode
}

export function IntakeLayout({ currentStep, children }: Props) {
  const stepIndex = STEPS.findIndex(s => s.key === currentStep)
  const stepNumber = stepIndex + 1
  const progress = (stepNumber / STEPS.length) * 100
  const current = STEPS[stepIndex]

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-stone-500 mb-1">Step {stepNumber} of {STEPS.length}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{current?.emoji}</span>
            <h1 className="text-xl font-semibold text-stone-800">{current?.label}</h1>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}