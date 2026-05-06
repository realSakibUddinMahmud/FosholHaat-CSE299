import { getApiUrl } from "../api-config";
import { getSession, clearSession } from "./session";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (session?.sessionToken) {
    headers.Authorization = `Bearer ${session.sessionToken}`;
  }
  return headers;
}

export async function apiFetch<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getApiUrl()}${path}`, { headers });
  if (!response.ok) {
    if (response.status === 401) {
      await clearSession();
    }
    const text = await response.text().catch(() => "");
    let errorMessage = text || `API ${response.status}`;
    try {
      if (text) {
        const json = JSON.parse(text);
        if (json && json.message) {
          errorMessage = typeof json.message === "string" ? json.message : Array.isArray(json.message) ? json.message.join(", ") : JSON.stringify(json.message);
        }
      }
    } catch {
      // Ignore parse error
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  headers["Content-Type"] = "application/json";
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (response.status === 401) {
      await clearSession();
    }
    const text = await response.text().catch(() => "");
    let errorMessage = text || `API ${response.status}`;
    try {
      if (text) {
        const json = JSON.parse(text);
        if (json && json.message) {
          errorMessage = typeof json.message === "string" ? json.message : Array.isArray(json.message) ? json.message.join(", ") : JSON.stringify(json.message);
        }
      }
    } catch {
      // Ignore parse error
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  headers["Content-Type"] = "application/json";
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (response.status === 401) {
      await clearSession();
    }
    const text = await response.text().catch(() => "");
    let errorMessage = text || `API ${response.status}`;
    try {
      if (text) {
        const json = JSON.parse(text);
        if (json && json.message) {
          errorMessage = typeof json.message === "string" ? json.message : Array.isArray(json.message) ? json.message.join(", ") : JSON.stringify(json.message);
        }
      }
    } catch {
      // Ignore parse error
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}
