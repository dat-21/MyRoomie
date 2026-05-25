// ─── Roommate / Tenant types ───────────────────────────────────────────────

export interface Roommate {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Non-binary";
  avatar: string;
  compatibility: number;
  budget: { min: number; max: number };
  moveInDate: string;
  location: string;
  occupation: string;
  bio: string;
  lifestyleTags: string[];
  preferences: {
    sleepSchedule: string;
    cleanliness: string;
    noise: string;
    guests: string;
    smoking: string;
    pets: string;
    cooking: string;
  };
  verified: boolean;
  status: "HAS_ROOM" | "NEEDS_ROOM";
}

export interface UserReview {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

export interface RoommateWithReviews extends Roommate {
  reviews: UserReview[];
  rating: number;
  reviewCount: number;
}

// ─── Room Listing types ────────────────────────────────────────────────────

export interface RoomListing {
  id: string;
  title: string;
  location: string;
  district: string;
  rent: number;
  distance: number; // km
  matchScore: number;
  thumbnail: string;
  images: string[];
  roomType: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // m²
  amenities: string[];
  description: string;
  availableFrom: string;
  duration: string;
  currentRoommates: {
    name: string;
    age: number;
    occupation: string;
    avatar: string;
    tags: string[];
    quote: string;
  }[];
  owner: {
    name: string;
    avatar: string;
    phone: string;
    responseTime: string;
  };
  reviews: {
    author: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
  }[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  petsAllowed: boolean;
  lat: number;
  lng: number;
}

export interface RoomSlot {
  id: string;
  title: string;
  location: string;
  rent: number;
  roomType: string;
  availableSlots: number;
  moveInDate: string;
  lifestyleExpectations: string[];
  description: string;
  images: string[];
  postedBy: string;
  postedDate: string;
}

// ─── Chat / Messaging types ────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantOccupation: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

// ─── Admin types ───────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "landlord" | "tenant";
  status: "active" | "pending" | "suspended";
  joinDate: string;
  lastActive: string;
  verified: boolean;
}

export interface AdminLandlord extends AdminUser {
  role: "landlord";
  totalRooms: number;
  totalViews: number;
  totalInquiries: number;
  rating: number;
  reviewCount: number;
  responseTime: string;
  area: string;
}

export interface AdminTenant extends AdminUser {
  role: "tenant";
  age: number;
  occupation: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  matchCount: number;
  messagesCount: number;
}

export interface AdminReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  targetId: string;
  targetName: string;
  targetRole: "landlord" | "tenant";
  rating: number;
  text: string;
  date: string;
  status: "visible" | "hidden" | "flagged";
}

export interface AdminStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  pendingApprovals: number;
  totalRooms: number;
  activeRooms: number;
  totalMatches: number;
  totalMessages: number;
  monthlyGrowth: number;
}

// ─── Auth types ────────────────────────────────────────────────────────────

export type Role = "landlord" | "tenant" | "admin" | null;
export type AccountStatus = "active" | "pending" | null;

export type EkycStatus = "none" | "pending" | "verified" | "rejected";

export type EkycStep = "cccd" | "liveness" | "result";

export interface EkycStatusResponse {
  status: EkycStatus;
  verifiedAt?: string;
}

export interface CccdInfo {
  cccdNumber: string;
  fullName: string;
  dateOfBirth?: string;
  sex?: string;
  nationality?: string;
  placeOfOrigin?: string;
  placeOfResidence?: string;
  expiryDate?: string;
}

export interface ScanCccdResponse {
  success: boolean;
  sessionId?: string;
  info?: CccdInfo;
  error?: string;
}

export interface VerifyFaceResponse {
  success: boolean;
  match: boolean;
  similarity: number;
  error?: string;
}

export interface UserData {
  email: string;
  name: string;
  role: Role;
  status: AccountStatus;
  ekycStatus?: EkycStatus;
  phone?: string;
  area?: string;
  rooms?: string;
  description?: string;
  budget?: string;
  intro?: string;
}

// ─── API response wrappers ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
