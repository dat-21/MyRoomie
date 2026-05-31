/**
 * Base API client.
 *
 * When VITE_API_URL is set the client makes real HTTP requests.
 * When it is absent (or empty) the app runs in MOCK mode — every
 * service module falls back to local data from src/data/.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** True when running against local mock data (no backend). */
export const IS_MOCK_MODE = !API_BASE_URL;

// Hybrid flags for Production
export const IS_AUTH_MOCK = IS_MOCK_MODE;
export const IS_EKYC_MOCK = IS_MOCK_MODE;
export const IS_ROOM_MOCK = true;
export const IS_ROOMMATE_MOCK = true;
export const IS_CHAT_MOCK = true;
export const IS_ADMIN_MOCK = true;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Thin fetch wrapper that:
 * - Adds Content-Type: application/json
 * - Attaches the Bearer token from localStorage (key: "myroomie_token")
 * - Throws on non-2xx responses with the error body included
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const token = localStorage.getItem("myroomie_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        // MyRoomie API error format: { message, code }
        errorMessage = errorBody.message;
      } else if (errorBody?.errors) {
        // ASP.NET ValidationProblemDetails: { errors: { field: [msg] } }
        const firstField = Object.keys(errorBody.errors)[0];
        errorMessage = errorBody.errors[firstField]?.[0] ?? errorBody.title ?? errorMessage;
      } else if (errorBody?.title) {
        errorMessage = errorBody.title;
      }
    } catch {
      // không parse được body — dùng status text
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/** Simulate network latency in mock mode (helps catch loading-state bugs). */
export function mockDelay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
