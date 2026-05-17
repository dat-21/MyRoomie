/** All lifestyle tag options used across the app for filtering/posting. */
export const LIFESTYLE_OPTIONS = [
  "Early Bird",
  "Night Owl",
  "Clean",
  "Very Clean",
  "Non-smoker",
  "Social",
  "Introvert",
  "Foodie",
  "Gym Goer",
  "Gamer",
  "Creative",
  "Student",
  "Bookworm",
  "Traveler",
  "Minimalist",
  "Yoga",
  "Fitness",
  "Tech Lover",
  "Surfer",
  "Homebody",
  "Flexible",
  "Healthy Living",
] as const;

export type LifestyleTag = (typeof LIFESTYLE_OPTIONS)[number];

/** Da Nang districts used in filters. */
export const DISTRICTS = [
  "Hải Châu",
  "Sơn Trà",
  "Ngũ Hành Sơn",
  "Thanh Khê",
  "Cẩm Lệ",
  "Liên Chiểu",
  "Hòa Vang",
] as const;

/** Room type options. */
export const ROOM_TYPES = [
  "All",
  "Studio",
  "Private Room",
  "Shared Room",
  "Master Bedroom",
] as const;

/** Amenity filter options for room listings. */
export const AMENITY_OPTIONS = [
  "WiFi",
  "Air conditioning",
  "Kitchen",
  "Washing Machine",
  "Parking",
  "Gym",
  "Pool",
  "Balcony",
  "Security",
  "Elevator",
  "Pets allowed",
] as const;
