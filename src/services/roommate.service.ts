import type { Roommate, RoommateWithReviews, UserReview } from "../types";
import { apiRequest, IS_MOCK_MODE, mockDelay } from "./api";
import {
  roommates as mockRoommates,
  roommateReviews as mockReviews,
  getRoommateWithReviews as getMockRoommateWithReviews,
  currentUser as mockCurrentUser,
} from "../data/mockData";

/* ─── Roommates ────────────────────────────────────────────────────────── */

/** Fetch all roommates (with optional server-side filtering in real mode). */
export async function getRoommates(): Promise<Roommate[]> {
  if (IS_MOCK_MODE) return mockDelay([...mockRoommates]);
  return apiRequest<Roommate[]>("/roommates");
}

/** Fetch a single roommate by id. */
export async function getRoommateById(id: string): Promise<Roommate | undefined> {
  if (IS_MOCK_MODE) return mockDelay(mockRoommates.find((r) => r.id === id));
  return apiRequest<Roommate>(`/roommates/${id}`);
}

/** Fetch a roommate together with their reviews and computed rating. */
export async function getRoommateWithReviews(
  id: string
): Promise<RoommateWithReviews | undefined> {
  if (IS_MOCK_MODE) return mockDelay(getMockRoommateWithReviews(id));
  return apiRequest<RoommateWithReviews>(`/roommates/${id}/reviews`);
}

/* ─── Reviews ──────────────────────────────────────────────────────────── */

/** Fetch reviews for a roommate. */
export async function getReviewsByRoommateId(id: string): Promise<UserReview[]> {
  if (IS_MOCK_MODE) return mockDelay(mockReviews[id] ?? []);
  return apiRequest<UserReview[]>(`/roommates/${id}/reviews`);
}

/** Submit a new review for a roommate. */
export async function submitRoommateReview(
  roommateId: string,
  review: Omit<UserReview, "id" | "date">
): Promise<UserReview> {
  if (IS_MOCK_MODE) {
    const newReview: UserReview = {
      ...review,
      id: `ur_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    return mockDelay(newReview);
  }
  return apiRequest<UserReview>(`/roommates/${roommateId}/reviews`, {
    method: "POST",
    body: review,
  });
}

/* ─── Current user ─────────────────────────────────────────────────────── */

/** Fetch the profile of the currently authenticated user. */
export async function getCurrentUser() {
  if (IS_MOCK_MODE) return mockDelay(mockCurrentUser);
  return apiRequest<typeof mockCurrentUser>("/users/me");
}

/** Update the current user's profile fields. */
export async function updateCurrentUser(
  updates: Partial<typeof mockCurrentUser>
): Promise<typeof mockCurrentUser> {
  if (IS_MOCK_MODE) return mockDelay({ ...mockCurrentUser, ...updates });
  return apiRequest<typeof mockCurrentUser>("/users/me", {
    method: "PATCH",
    body: updates,
  });
}
