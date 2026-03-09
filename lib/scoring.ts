export type DomainAnswers = Record<string, string | number | boolean>

export type ScoringResult = {
  tier: 1 | 2 | 3 | 4
  flags: string[]
}

export function scoreHousing(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.stableHousing === 'no') flags.push('no_stable_housing')
  if (a.worryLosing === 'yes') flags.push('at_risk_eviction')
  if (a.utilities === 'no') flags.push('no_utilities')
  if (a.safetyConcerns === 'yes') flags.push('unsafe_conditions')
  if (a.overcrowded === 'yes') flags.push('overcrowded')

  if (flags.includes('no_stable_housing') || flags.includes('at_risk_eviction')) return { tier: 1, flags }
  if (flags.includes('no_utilities') || flags.includes('unsafe_conditions') || flags.includes('overcrowded')) return { tier: 2, flags }
  if (flags.length > 0) return { tier: 3, flags }
  return { tier: 4, flags }
}

export function scoreNutrition(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.worriedFoodRunOut === 'yes') flags.push('food_insecurity_worry')
  if (a.foodDidntLast === 'yes') flags.push('food_insecurity_actual')
  if (a.kitchenAccess === 'no') flags.push('no_kitchen_access')
  if (a.culturalBarriers === 'yes') flags.push('cultural_food_barriers')

  if (flags.includes('food_insecurity_worry') || flags.includes('food_insecurity_actual')) return { tier: 1, flags }
  if (flags.includes('no_kitchen_access') || flags.includes('cultural_food_barriers')) return { tier: 2, flags }
  if (flags.length > 0) return { tier: 3, flags }
  return { tier: 4, flags }
}

export function scoreHealth(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.hasInsurance === 'no') flags.push('no_insurance')
  if (a.unableToGetCare === 'yes') flags.push('unable_to_get_care')
  if (a.ongoingConditions === 'yes') flags.push('ongoing_conditions')
  if (a.medicationAccess === 'no') flags.push('no_medication_access')
  if (a.medicationAccess === 'sometimes') flags.push('inconsistent_medication')
  if (Number(a.mentalHealth) <= 2) flags.push('mental_health_crisis')

  if (flags.includes('no_insurance') && flags.includes('unable_to_get_care')) return { tier: 1, flags }
  if (flags.includes('no_insurance') || flags.includes('no_medication_access') || flags.includes('mental_health_crisis')) return { tier: 2, flags }
  if (flags.length > 0) return { tier: 3, flags }
  return { tier: 4, flags }
}

export function scoreEducation(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.childEnrolled === 'not_enrolled') flags.push('child_not_enrolled')
  if (a.internetAccess === 'no') flags.push('no_internet_access')
  if (a.educationBarriers === 'yes') flags.push('education_barriers')
  if (a.currentlyInSchool === 'interested') flags.push('interested_in_training')

  if (flags.includes('child_not_enrolled')) return { tier: 1, flags }
  if (flags.includes('no_internet_access') || flags.includes('education_barriers')) return { tier: 2, flags }
  if (flags.includes('interested_in_training')) return { tier: 3, flags }
  return { tier: 4, flags }
}

export function scoreSafety(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.feelsSafe === 'no') flags.push('feels_unsafe')
  if (a.feelsSafe === 'sometimes') flags.push('sometimes_unsafe')
  if (a.physicalHarm === 'yes') flags.push('experienced_harm')
  if (a.unsafeSituation === 'yes') flags.push('current_unsafe_situation')
  if (a.criminalJustice === 'yes') flags.push('criminal_justice_involvement')

  if (flags.includes('feels_unsafe') || flags.includes('experienced_harm') || flags.includes('current_unsafe_situation')) return { tier: 1, flags }
  if (flags.includes('sometimes_unsafe') || flags.includes('criminal_justice_involvement')) return { tier: 2, flags }
  if (flags.length > 0) return { tier: 3, flags }
  return { tier: 4, flags }
}

export function scoreWork(a: DomainAnswers): ScoringResult {
  const flags: string[] = []
  if (a.employmentStatus === 'unemployed_looking' || a.employmentStatus === 'unemployed_not_looking') flags.push('unemployed')
  if (a.incomeCoversNeeds === 'no') flags.push('income_insufficient')
  if (a.incomeCoversNeeds === 'sometimes') flags.push('income_inconsistent')
  if (a.hasTransportation === 'no') flags.push('no_transportation')
  if (a.interestedInTraining === 'yes') flags.push('wants_job_training')

  if (flags.includes('unemployed') && flags.includes('income_insufficient')) return { tier: 1, flags }
  if (flags.includes('unemployed') || flags.includes('income_inconsistent')) return { tier: 2, flags }
  if (flags.length > 0) return { tier: 3, flags }
  return { tier: 4, flags }
}