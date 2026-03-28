export const CORE_ROLES = ["buyer", "seller", "hub_manager"] as const;
export type CoreRole = (typeof CORE_ROLES)[number];

export const REDUCED_EARLY_ROLES = ["driver", "super_admin"] as const;
export type ReducedEarlyRole = (typeof REDUCED_EARLY_ROLES)[number];

export const AUTH_ROLES = [...CORE_ROLES, ...REDUCED_EARLY_ROLES] as const;
export type AuthRole = (typeof AUTH_ROLES)[number];

export const SHARED_ACCESS_ROLES = ["buyer", "seller"] as const;
export type SharedAccessRole = (typeof SHARED_ACCESS_ROLES)[number];

export const ROLE_LABELS: Record<AuthRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  hub_manager: "Hub Manager",
  driver: "Driver",
  super_admin: "Super Admin",
};
