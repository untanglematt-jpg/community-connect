import type { DomainResult } from "@/types";

// Housing tier scoring
export function scoreHousing(flags: string[]): number {
  if (
    flags.includes("no_stable_housing") ||
    flags.includes("imminent_eviction")
  )
    return 1;
  if (flags.includes("at_risk_housing") || flags.includes("unsafe_conditions"))
    return 2;
  if (flags.includes("overcrowded") || flags.includes("some_utility_issues"))
    return 3;
  return 4;
}

// Nutrition tier scoring
export function scoreNutrition(flags: string[]): number {
  if (flags.includes("food_ran_out") || flags.includes("worried_food_runout"))
    return 1;
  if (flags.includes("no_kitchen_access")) return 2;
  if (flags.includes("dietary_access_barriers")) return 3;
  return 4;
}

// Health tier scoring
export function scoreHealth(flags: string[]): number {
  if (
    flags.includes("no_insurance") ||
    flags.includes("mental_health_crisis") ||
    flags.includes("no_medications")
  )
    return 1;
  if (
    flags.includes("unable_to_get_care") ||
    flags.includes("sometimes_no_medications")
  )
    return 2;
  if (flags.includes("managing_chronic_condition")) return 3;
  return 4;
}

// Education tier scoring
export function scoreEducation(flags: string[]): number {
  if (
    flags.includes("child_not_enrolled") ||
    flags.includes("no_device_or_internet")
  )
    return 1;
  if (flags.includes("education_barriers")) return 2;
  if (flags.includes("interested_in_training")) return 3;
  return 4;
}

// Safety tier scoring
export function scoreSafety(flags: string[]): number {
  if (
    flags.includes("currently_unsafe") ||
    flags.includes("physical_harm_or_threat")
  )
    return 1;
  if (flags.includes("sometimes_unsafe")) return 2;
  if (flags.includes("criminal_justice_impact")) return 3;
  return 4;
}

// Work tier scoring
export function scoreWork(flags: string[]): number {
  if (
    flags.includes("unemployed_no_income") ||
    flags.includes("cannot_meet_basic_needs")
  )
    return 1;
  if (flags.includes("unemployed_looking") || flags.includes("sometimes_meets_needs"))
    return 2;
  if (flags.includes("interested_in_training") || flags.includes("has_work_barriers"))
    return 3;
  return 4;
}

export function scoreDomain(domain: string, flags: string[]): DomainResult {
  let tier = 4;
  switch (domain) {
    case "housing":
      tier = scoreHousing(flags);
      break;
    case "nutrition":
      tier = scoreNutrition(flags);
      break;
    case "health":
      tier = scoreHealth(flags);
      break;
    case "education":
      tier = scoreEducation(flags);
      break;
    case "safety":
      tier = scoreSafety(flags);
      break;
    case "work":
      tier = scoreWork(flags);
      break;
  }
  return { domain, tier, flags };
}