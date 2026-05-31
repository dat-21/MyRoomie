import type { RoomListing, RoomSlot } from "../types";
import { apiRequest, IS_ROOM_MOCK, mockDelay } from "./api";
import { rooms as mockRooms } from "../data/mockData";

/* ─── Room Listings ────────────────────────────────────────────────────── */

/** Fetch all room listings. */
export async function getRooms(): Promise<RoomListing[]> {
  if (IS_ROOM_MOCK) return mockDelay([...mockRooms]);
  return apiRequest<RoomListing[]>("/rooms");
}

/** Fetch a single room listing by id. */
export async function getRoomById(id: string): Promise<RoomListing | undefined> {
  if (IS_ROOM_MOCK) return mockDelay(mockRooms.find((r) => r.id === id));
  return apiRequest<RoomListing>(`/rooms/${id}`);
}

/* ─── Room Slots (Landlord posts) ──────────────────────────────────────── */

/** Fetch all room slots posted by the current landlord. */
export async function getLandlordRooms(): Promise<RoomListing[]> {
  if (IS_ROOM_MOCK) return mockDelay([...mockRooms]);
  return apiRequest<RoomListing[]>("/landlord/rooms");
}

/** Create a new room slot posting. */
export async function createRoomSlot(
  slot: Omit<RoomSlot, "id" | "postedDate">
): Promise<RoomSlot> {
  if (IS_ROOM_MOCK) {
    const newSlot: RoomSlot = {
      ...slot,
      id: `slot_${Date.now()}`,
      postedDate: new Date().toISOString().split("T")[0],
    };
    return mockDelay(newSlot);
  }
  return apiRequest<RoomSlot>("/rooms", { method: "POST", body: slot });
}

/** Update an existing room slot. */
export async function updateRoomSlot(
  id: string,
  updates: Partial<RoomSlot>
): Promise<RoomSlot> {
  if (IS_ROOM_MOCK) {
    const existing = mockRooms.find((r) => r.id === id);
    return mockDelay({ ...existing, ...updates } as unknown as RoomSlot);
  }
  return apiRequest<RoomSlot>(`/rooms/${id}`, {
    method: "PATCH",
    body: updates,
  });
}

/** Delete a room slot. */
export async function deleteRoomSlot(id: string): Promise<void> {
  if (IS_ROOM_MOCK) return mockDelay(undefined);
  return apiRequest<void>(`/rooms/${id}`, { method: "DELETE" });
}

/** Submit a review for a room listing. */
export async function submitRoomReview(
  roomId: string,
  review: { author: string; rating: number; text: string }
): Promise<{ author: string; avatar: string; date: string; rating: number; text: string }> {
  if (IS_ROOM_MOCK) {
    return mockDelay({
      ...review,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${review.author}`,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
  }
  return apiRequest(`/rooms/${roomId}/reviews`, { method: "POST", body: review });
}
