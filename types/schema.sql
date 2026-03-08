-- Community Connect — Phase 1 Schema

create table if not exists intake_sessions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamp default now(),
  zip_code          text,
  household_size    int,
  preferred_language text,
  housing_tier      int,
  nutrition_tier    int,
  health_tier       int,
  education_tier    int,
  safety_tier       int,
  work_tier         int,
  housing_flags     text[],
  nutrition_flags   text[],
  health_flags      text[],
  education_flags   text[],
  safety_flags      text[],
  work_flags        text[]
);

create table if not exists organizations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            text,
  description     text,
  website         text,
  phone           text,
  address         text,
  zip_codes       text[]         default '{}',
  state_wide      boolean        default false,
  languages       text[]         default '{"English"}',
  domains         text[]         default '{}',
  tier_served     int[]          default '{}',
  income_max_fpl  int,
  age_min         int,
  age_max         int,
  accepting       boolean        default true,
  waitlist        boolean        default false,
  verified        boolean        default false,
  last_verified   date,
  created_at      timestamp      default now(),
  updated_at      timestamp      default now()
);

create table if not exists referrals (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid references intake_sessions(id),
  organization_id uuid references organizations(id),
  domain          text,
  match_score     int,
  status          text default 'suggested',
  created_at      timestamp default now()
);