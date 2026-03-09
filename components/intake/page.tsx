'use client'

import { useParams, useRouter } from 'next/navigation'
import { IntakeLayout } from '@/components/intake/IntakeLayout'
import { HousingForm } from '@/components/intake/HousingForm'
import { NutritionForm } from '@/components/intake/NutritionForm'
import { HealthForm } from '@/components/intake/HealthForm'
import { EducationForm } from '@/components/intake/EducationForm'
import { SafetyForm } from '@/components/intake/SafetyForm'
import { WorkForm } from '@/components/intake/WorkForm'
import { AboutYouForm } from '@/components/intake/AboutYouForm'
import { useIntake } from '@/lib/intake-context'
import type { DomainResult } from '@/lib/intake-context'

const STEP_ORDER = ['housing', 'nutrition', 'health', 'education', 'safety', 'work', 'about']

export default function IntakeStep() {
  const { step } = useParams<{ step: string }>()
  const router = useRouter()
  const { setDomainResult, setAboutYou } = useIntake()

  const handleDomainComplete = (result: DomainResult) => {
    setDomainResult(result.domain, result)
    const nextIndex = STEP_ORDER.indexOf(step) + 1
    if (nextIndex < STEP_ORDER.length) {
      router.push(`/intake/${STEP_ORDER[nextIndex]}`)
    } else {
      router.push('/intake/complete')
    }
  }

  const formMap: Record<string, React.ReactNode> = {
    housing:   <HousingForm onComplete={handleDomainComplete} />,
    nutrition: <NutritionForm onComplete={handleDomainComplete} />,
    health:    <HealthForm onComplete={handleDomainComplete} />,
    education: <EducationForm onComplete={handleDomainComplete} />,
    safety:    <SafetyForm onComplete={handleDomainComplete} />,
    work:      <WorkForm onComplete={handleDomainComplete} />,
    about:     <AboutYouForm onComplete={(data) => { setAboutYou(data); router.push('/intake/complete') }} />,
  }

  if (!STEP_ORDER.includes(step)) return <p>Step not found.</p>

  return (
    <IntakeLayout currentStep={step}>
      {formMap[step]}
    </IntakeLayout>
  )
}