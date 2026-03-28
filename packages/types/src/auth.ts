import type { AuthRole } from "./roles";
/**
 * Authentication and shared entry DTOs for FosholHaat.
 * Follows the boundaries defined in docs/slices/shared-auth/api-contract.md.
 */

export type Locale = "bn" | "en";
export type SignupRole = "buyer" | "seller";
export const DEFAULT_LOCALE: Locale = "bn";
export const LOCALE_STORAGE_KEY = "fosholhaat-locale";

export function getSignupRouteForRole(role: SignupRole): string {
  return `/signup/${role}`;
}

export function isLocale(value: unknown): value is Locale {
  return value === "bn" || value === "en";
}

export interface LoginRequest {
  identifier: string;
  password: string;
  locale: Locale;
}

export interface LoginResponse {
  sessionToken: string;
  user: {
    id: string;
    role: AuthRole;
    locale: Locale;
  };
  nextRoute: string; // e.g., /buyer, /seller, /hub
}

export interface LocalePreferenceRequest {
  locale: Locale;
}

export interface LocalePreferenceResponse {
  locale: Locale;
}

export interface RoleSelectionRequest {
  role: SignupRole;
  locale: Locale;
}

export interface RoleSelectionResponse {
  role: SignupRole;
  nextRoute: string; // e.g., /signup/buyer or /signup/seller
}
