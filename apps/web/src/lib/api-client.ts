export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let errorMessage = text || `Request failed: ${response.status}`;
    try {
      if (text) {
        const json = JSON.parse(text);
        if (json && json.message) {
          errorMessage = typeof json.message === "string" ? json.message : Array.isArray(json.message) ? json.message.join(", ") : JSON.stringify(json.message);
        }
      }
    } catch {
      // Ignore parse error, use raw text
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body: unknown = {}): Promise<T> {
  return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}
