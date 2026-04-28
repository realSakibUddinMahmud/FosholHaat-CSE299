import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthRole, Locale } from "@fosholhaat/types";

const SESSION_KEY = "fosholhaat-session";

export type MobileSession = {
  sessionToken: string;
  role: AuthRole;
  locale: Locale;
  nextRoute: string;
};

export async function saveSession(session: MobileSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<MobileSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MobileSession;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function nextRouteForRole(role: AuthRole) {
  if (role === "seller") return "/seller";
  if (role === "hub_manager") return "/hub";
  return "/buyer";
}
