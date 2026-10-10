import "server-only";
import { API_URL, CATALOG_REVALIDATE } from "@/lib/config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** User access token. Authenticated requests are never cached. */
  token?: string;
  revalidate?: number;
};

/**
 * Single entry point for talking to the backend API.
 * Public GET requests are cached (ISR); anything authenticated or mutating is not.
 */
export async function api<T>(path: string, { method = "GET", body, token, revalidate }: RequestOptions = {}) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.token = token;

  const cacheable = method === "GET" && !token;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...(cacheable ? { next: { revalidate: revalidate ?? CATALOG_REVALIDATE } } : { cache: "no-store" }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.errors?.msg ?? payload?.message ?? `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
