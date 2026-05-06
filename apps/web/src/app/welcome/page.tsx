import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthRole } from "@fosholhaat/types/roles";
import { nextRouteForRole, SESSION_ROLE_COOKIE, SESSION_TOKEN_COOKIE } from "../../lib/session";
import { WelcomeView } from "./welcome-view";

export default async function WelcomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(SESSION_ROLE_COOKIE)?.value as AuthRole | undefined;

  if (token && role) redirect(nextRouteForRole(role));

  return <WelcomeView />;
}
