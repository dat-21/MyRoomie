import type { UserData, Role } from "../types";
import { apiRequest, IS_MOCK_MODE, mockDelay } from "./api";

const STORAGE_KEY = "myroomie_auth";
const TOKEN_KEY = "myroomie_token";
const DEMO_ADMIN_EMAIL = "admin@myroomie.vn";
const DEMO_ADMIN_PASSWORD = "admin123";

export interface LoginPayload {
  email: string;
  password: string;
  role: Exclude<Role, null>;
}

export interface AuthResult {
  user: UserData;
  token: string;
}

/**
 * Authenticate a user.
 *
 * Mock mode: validates admin credentials, otherwise accepts any email/password
 * and constructs a user object from localStorage (if an existing registration
 * exists) or from the email.
 *
 * Real mode: POST /auth/login → { user, token }
 */
export async function login(payload: LoginPayload): Promise<UserData | null> {
  if (IS_MOCK_MODE) {
    const { email, password, role } = payload;

    if (role === "admin") {
      if (
        email.toLowerCase() !== DEMO_ADMIN_EMAIL ||
        password !== DEMO_ADMIN_PASSWORD
      ) {
        return null;
      }
      const user: UserData = {
        email: DEMO_ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
        status: "active",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return mockDelay(user);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existing: UserData = JSON.parse(stored);
      if (existing.email === email) {
        const user = { ...existing, role, status: existing.status ?? "active" } as UserData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return mockDelay(user);
      }
    }

    const user: UserData = {
      email,
      name: email.split("@")[0],
      role,
      status: "active",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return mockDelay(user);
  }

  const result = await apiRequest<AuthResult>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
  return result.user;
}

/**
 * Register a new user.
 *
 * Mock mode: stores the user in localStorage with status "pending".
 * Real mode: POST /auth/register → { user, token }
 */
export async function register(data: UserData, password?: string): Promise<UserData> {
  if (IS_MOCK_MODE) {
    const user: UserData = { ...data, status: "pending" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return mockDelay(user);
  }

  // Real mode: POST /api/auth/register → { message, email }
  // Backend cần password, nhưng UserData không lưu password
  await apiRequest<{ message: string; email: string }>("/api/auth/register", {
    method: "POST",
    body: { ...data, password },
  });
  const pendingUser: UserData = { ...data, status: "pending" };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingUser));
  return pendingUser;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

/**
 * Xác thực OTP sau khi đăng ký.
 * Real mode: POST /api/auth/verify-otp → { user, token }
 */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<UserData | null> {
  if (IS_MOCK_MODE) {
    // Mock: giả lập xác thực thành công
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user: UserData = { ...JSON.parse(stored), status: "active" };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return mockDelay(user);
    }
    return null;
  }

  const result = await apiRequest<AuthResult>("/api/auth/verify-otp", {
    method: "POST",
    body: payload,
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
  return result.user;
}

/**
 * Gửi lại OTP (rate limit 60s).
 * Real mode: POST /api/auth/resend-otp
 */
export async function resendOtp(email: string): Promise<void> {
  if (IS_MOCK_MODE) {
    return mockDelay(undefined);
  }
  await apiRequest<{ message: string }>("/api/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
}

/** Clear session data from localStorage. */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/** Restore user from localStorage (called on app start). */
export function restoreSession(): UserData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserData) : null;
  } catch {
    return null;
  }
}
