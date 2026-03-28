export const APP_PLATFORMS = ["mobile", "web", "shell"] as const;
export type AppPlatform = (typeof APP_PLATFORMS)[number];

export const APP_LOCALES = ["bn", "en"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const ROLE_FAMILIES = ["buyer", "seller", "hub", "shared"] as const;
export type RoleFamily = (typeof ROLE_FAMILIES)[number];

export const APPROVAL_STATUSES = [
  "mobile-only approved",
  "mobile+web approved",
  "mobile+web partially approved",
  "shell-only approved",
] as const;
export type FeatureApprovalStatus = (typeof APPROVAL_STATUSES)[number];
