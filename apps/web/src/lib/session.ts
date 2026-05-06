import type { Locale } from "@fosholhaat/types";
import type { AuthRole } from "@fosholhaat/types/roles";

export const SESSION_TOKEN_COOKIE = "fh_session";
export const SESSION_ROLE_COOKIE = "fh_role";
export const SESSION_LOCALE_COOKIE = "fh_locale";

export type WebSession = {
  sessionToken: string;
  role: AuthRole;
  locale: Locale;
  nextRoute: string;
};

export function nextRouteForRole(role: AuthRole): string {
  if (role === "seller") return "/seller";
  if (role === "hub_manager") return "/hub";
  return "/buyer";
}
