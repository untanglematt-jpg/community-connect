import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DOMAIN_ORDER = [
  "housing",
  "nutrition",
  "health",
  "education",
  "safety",
  "work",
] as const;

export const DOMAIN_LABELS: Record<string, string> = {
  housing: "Housing",
  nutrition: "Nutrition",
  health: "Health",
  education: "Education",
  safety: "Safety",
  work: "Work",
};

export const TIER_LABELS: Record<number, string> = {
  1: "Crisis",
  2: "Unstable",
  3: "At Risk",
  4: "Stable",
};

export const TIER_COLORS: Record<number, string> = {
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-green-100 text-green-800 border-green-200",
};