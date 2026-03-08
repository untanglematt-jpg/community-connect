export interface DomainResult {
  domain: string;
  tier: number; // 1–4
  flags: string[];
}

export interface IntakeFormState {
  zip_code?: string;
  household_size?: number;
  preferred_language?: string;
  housing?: DomainResult;
  nutrition?: DomainResult;
  health?: DomainResult;
  education?: DomainResult;
  safety?: DomainResult;
  work?: DomainResult;
}

export interface IntakeSession {
  id?: string;
  created_at?: string;
  zip_code?: string;
  household_size?: number;
  preferred_language?: string;
  housing_tier?: number;
  nutrition_tier?: number;
  health_tier?: number;
  education_tier?: number;
  safety_tier?: number;
  work_tier?: number;
  housing_flags?: string[];
  nutrition_flags?: string[];
  health_flags?: string[];
  education_flags?: string[];
  safety_flags?: string[];
  work_flags?: string[];
}

export interface Organization {
  id: string;
  name: string;
  type: "government" | "nonprofit" | "private";
  description: string;
  website?: string;
  phone?: string;
  address?: string;
  zip_codes: string[];
  state_wide: boolean;
  languages: string[];
  domains: string[];
  tier_served: number[];
  income_max_fpl?: number;
  age_min?: number;
  age_max?: number;
  accepting: boolean;
  waitlist: boolean;
  verified: boolean;
  last_verified?: string;
}

export interface MatchResult {
  organization: Organization;
  domain: string;
  match_score: number;
}

export interface Referral {
  id?: string;
  session_id: string;
  organization_id: string;
  domain: string;
  match_score: number;
  status: "suggested" | "clicked" | "declined";
}