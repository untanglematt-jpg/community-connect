'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type DomainResult = {
  domain: string
  tier: 1 | 2 | 3 | 4
  flags: string[]
}

export type AboutYou = {
  zipCode: string
  householdSize: number
  preferredLanguage: string
}

type IntakeState = {
  results: Partial<Record<string, DomainResult>>
  setDomainResult: (domain: string, result: DomainResult) => void
  aboutYou: AboutYou | null
  setAboutYou: (data: AboutYou) => void
  reset: () => void
}

const IntakeContext = createContext<IntakeState | null>(null)

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Partial<Record<string, DomainResult>>>({})
  const [aboutYou, setAboutYou] = useState<AboutYou | null>(null)

  const setDomainResult = (domain: string, result: DomainResult) => {
    setResults(prev => ({ ...prev, [domain]: result }))
  }

  const reset = () => {
    setResults({})
    setAboutYou(null)
  }

  return (
    <IntakeContext.Provider value={{ results, setDomainResult, aboutYou, setAboutYou, reset }}>
      {children}
    </IntakeContext.Provider>
  )
}

export function useIntake() {
  const ctx = useContext(IntakeContext)
  if (!ctx) throw new Error('useIntake must be used within IntakeProvider')
  return ctx
}