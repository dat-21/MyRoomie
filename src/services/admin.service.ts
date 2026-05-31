import type { AdminLandlord, AdminTenant, AdminReview, AdminStats } from "../types";
import { apiRequest, IS_ADMIN_MOCK, mockDelay } from "./api";
import {
  adminStats as mockStats,
  adminLandlords as mockLandlords,
  adminTenants as mockTenants,
  adminReviews as mockReviews,
} from "../data/adminData";

/** Fetch platform-wide statistics for the admin dashboard. */
export async function getAdminStats(): Promise<AdminStats> {
  if (IS_ADMIN_MOCK) return mockDelay({ ...mockStats });
  return apiRequest<AdminStats>("/admin/stats");
}

/** Fetch all landlords. */
export async function getLandlords(): Promise<AdminLandlord[]> {
  if (IS_ADMIN_MOCK) return mockDelay([...mockLandlords]);
  return apiRequest<AdminLandlord[]>("/admin/landlords");
}

/** Fetch all tenants. */
export async function getTenants(): Promise<AdminTenant[]> {
  if (IS_ADMIN_MOCK) return mockDelay([...mockTenants]);
  return apiRequest<AdminTenant[]>("/admin/tenants");
}

/** Fetch all reviews (for moderation). */
export async function getAdminReviews(): Promise<AdminReview[]> {
  if (IS_ADMIN_MOCK) return mockDelay([...mockReviews]);
  return apiRequest<AdminReview[]>("/admin/reviews");
}

/** Update a landlord record (approve, suspend, etc.). */
export async function updateLandlord(
  id: string,
  updates: Partial<AdminLandlord>
): Promise<AdminLandlord> {
  if (IS_ADMIN_MOCK) {
    const existing = mockLandlords.find((l) => l.id === id);
    return mockDelay({ ...existing!, ...updates });
  }
  return apiRequest<AdminLandlord>(`/admin/landlords/${id}`, {
    method: "PATCH",
    body: updates,
  });
}

/** Update a tenant record. */
export async function updateTenant(
  id: string,
  updates: Partial<AdminTenant>
): Promise<AdminTenant> {
  if (IS_ADMIN_MOCK) {
    const existing = mockTenants.find((t) => t.id === id);
    return mockDelay({ ...existing!, ...updates });
  }
  return apiRequest<AdminTenant>(`/admin/tenants/${id}`, {
    method: "PATCH",
    body: updates,
  });
}

/** Delete a landlord. */
export async function deleteLandlord(id: string): Promise<void> {
  if (IS_ADMIN_MOCK) return mockDelay(undefined);
  return apiRequest<void>(`/admin/landlords/${id}`, { method: "DELETE" });
}

/** Delete a tenant. */
export async function deleteTenant(id: string): Promise<void> {
  if (IS_ADMIN_MOCK) return mockDelay(undefined);
  return apiRequest<void>(`/admin/tenants/${id}`, { method: "DELETE" });
}

/** Update a review's moderation status. */
export async function updateReviewStatus(
  id: string,
  status: AdminReview["status"]
): Promise<AdminReview> {
  if (IS_ADMIN_MOCK) {
    const existing = mockReviews.find((r) => r.id === id);
    return mockDelay({ ...existing!, status });
  }
  return apiRequest<AdminReview>(`/admin/reviews/${id}`, {
    method: "PATCH",
    body: { status },
  });
}
