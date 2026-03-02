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

export const roommates: Roommate[] = [
  {
    id: "1",
    name: "Minh Tran",
    age: 23,
    gender: "Male",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Minh",
    compatibility: 95,
    budget: { min: 3000000, max: 4500000 },
    moveInDate: "2026-03-15",
    location: "Hai Chau, Da Nang",
    occupation: "Software Developer",
    bio: "Friendly tech enthusiast who enjoys quiet evenings and weekend hikes. Looking for a respectful roommate to share a 2-bedroom apartment.",
    lifestyleTags: ["Early Bird", "Clean", "Non-smoker", "Tech Lover", "Gym Goer"],
    preferences: {
      sleepSchedule: "Early Bird (10pm - 6am)",
      cleanliness: "Very Clean",
      noise: "Quiet",
      guests: "Occasionally",
      smoking: "No",
      pets: "No Pets",
      cooking: "Often",
    },
    verified: true,
  },
  {
    id: "2",
    name: "Linh Nguyen",
    age: 22,
    gender: "Female",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linh",
    compatibility: 88,
    budget: { min: 2500000, max: 3500000 },
    moveInDate: "2026-03-01",
    location: "Son Tra, Da Nang",
    occupation: "University Student",
    bio: "Third-year business student at UD. I love cooking, reading, and having meaningful conversations. Looking for a female roommate.",
    lifestyleTags: ["Night Owl", "Bookworm", "Non-smoker", "Foodie", "Quiet"],
    preferences: {
      sleepSchedule: "Night Owl (12am - 8am)",
      cleanliness: "Clean",
      noise: "Moderate",
      guests: "Rarely",
      smoking: "No",
      pets: "Cat Friendly",
      cooking: "Daily",
    },
    verified: true,
  },
  {
    id: "3",
    name: "Duc Pham",
    age: 25,
    gender: "Male",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Duc",
    compatibility: 82,
    budget: { min: 4000000, max: 6000000 },
    moveInDate: "2026-04-01",
    location: "Ngu Hanh Son, Da Nang",
    occupation: "Marketing Manager",
    bio: "Working professional with a love for surfing and beach vibes. I'm organized, social, and easy-going. Open to sharing a modern apartment near the beach.",
    lifestyleTags: ["Social", "Clean", "Surfer", "Non-smoker", "Fitness"],
    preferences: {
      sleepSchedule: "Moderate (11pm - 7am)",
      cleanliness: "Very Clean",
      noise: "Moderate",
      guests: "Often",
      smoking: "No",
      pets: "Dog Friendly",
      cooking: "Sometimes",
    },
    verified: true,
  },
  {
    id: "4",
    name: "Hana Le",
    age: 21,
    gender: "Female",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hana",
    compatibility: 78,
    budget: { min: 2000000, max: 3000000 },
    moveInDate: "2026-03-10",
    location: "Thanh Khe, Da Nang",
    occupation: "Graphic Designer",
    bio: "Creative soul who works from home most days. I'm introverted but friendly. Looking for a calm and respectful roommate.",
    lifestyleTags: ["Night Owl", "Creative", "Introvert", "Non-smoker", "Minimalist"],
    preferences: {
      sleepSchedule: "Night Owl (1am - 9am)",
      cleanliness: "Clean",
      noise: "Very Quiet",
      guests: "Rarely",
      smoking: "No",
      pets: "No Pets",
      cooking: "Sometimes",
    },
    verified: false,
  },
  {
    id: "5",
    name: "Khanh Vo",
    age: 24,
    gender: "Male",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Khanh",
    compatibility: 91,
    budget: { min: 3500000, max: 5000000 },
    moveInDate: "2026-03-20",
    location: "Hai Chau, Da Nang",
    occupation: "Data Analyst",
    bio: "Detail-oriented professional who keeps things tidy. I love board games and weekend brunches. Ideal roommate is someone reliable and fun.",
    lifestyleTags: ["Early Bird", "Very Clean", "Non-smoker", "Gamer", "Social"],
    preferences: {
      sleepSchedule: "Early Bird (10pm - 6am)",
      cleanliness: "Very Clean",
      noise: "Moderate",
      guests: "Occasionally",
      smoking: "No",
      pets: "No Pets",
      cooking: "Often",
    },
    verified: true,
  },
  {
    id: "6",
    name: "Thao Mai",
    age: 26,
    gender: "Female",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Thao",
    compatibility: 73,
    budget: { min: 3000000, max: 4000000 },
    moveInDate: "2026-04-15",
    location: "Cam Le, Da Nang",
    occupation: "English Teacher",
    bio: "Passionate educator and traveler. I enjoy yoga, green tea, and weekend markets. Looking for a positive and open-minded roommate.",
    lifestyleTags: ["Yoga", "Traveler", "Non-smoker", "Healthy Living", "Moderate"],
    preferences: {
      sleepSchedule: "Moderate (11pm - 7am)",
      cleanliness: "Clean",
      noise: "Quiet",
      guests: "Occasionally",
      smoking: "No",
      pets: "Cat Friendly",
      cooking: "Daily",
    },
    verified: true,
  },
  {
    id: "7",
    name: "Bao Hoang",
    age: 22,
    gender: "Male",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bao",
    compatibility: 67,
    budget: { min: 2000000, max: 3000000 },
    moveInDate: "2026-03-05",
    location: "Lien Chieu, Da Nang",
    occupation: "University Student",
    bio: "Engineering student who loves gaming and hanging out with friends. I'm laidback and flexible with house rules.",
    lifestyleTags: ["Night Owl", "Gamer", "Social", "Flexible", "Student"],
    preferences: {
      sleepSchedule: "Night Owl (1am - 10am)",
      cleanliness: "Moderate",
      noise: "Moderate",
      guests: "Often",
      smoking: "No",
      pets: "No Pets",
      cooking: "Rarely",
    },
    verified: false,
  },
  {
    id: "8",
    name: "Vy Dang",
    age: 24,
    gender: "Female",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vy",
    compatibility: 85,
    budget: { min: 3500000, max: 5000000 },
    moveInDate: "2026-03-25",
    location: "Son Tra, Da Nang",
    occupation: "UX Designer",
    bio: "Design-focused professional who appreciates aesthetics and tidiness. I cook often and love a good Netflix marathon. Let's make our apartment feel like home!",
    lifestyleTags: ["Clean", "Creative", "Non-smoker", "Foodie", "Homebody"],
    preferences: {
      sleepSchedule: "Moderate (11pm - 7am)",
      cleanliness: "Very Clean",
      noise: "Quiet",
      guests: "Occasionally",
      smoking: "No",
      pets: "Cat Friendly",
      cooking: "Daily",
    },
    verified: true,
  },
];

export const currentUser = {
  id: "current",
  name: "You",
  age: 23,
  gender: "Male" as const,
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=CurrentUser",
  location: "Da Nang",
  occupation: "Software Developer",
  bio: "Looking for a compatible roommate in Da Nang. I'm tidy, friendly, and enjoy a good work-life balance.",
  lifestyleTags: ["Early Bird", "Clean", "Non-smoker", "Tech Lover", "Gym Goer"],
  preferences: {
    sleepSchedule: "Early Bird (10pm - 6am)",
    cleanliness: "Very Clean",
    noise: "Quiet",
    guests: "Occasionally",
    smoking: "No",
    pets: "No Pets",
    cooking: "Often",
  },
  budget: { min: 3000000, max: 5000000 },
  verified: true,
};

/* ─── Room Listings ─── */
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
  currentRoommates: { name: string; age: number; occupation: string; avatar: string; tags: string[]; quote: string }[];
  owner: { name: string; avatar: string; phone: string; responseTime: string };
  reviews: { author: string; avatar: string; date: string; rating: number; text: string }[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  petsAllowed: boolean;
}

export const rooms: RoomListing[] = [
  {
    id: "r1",
    title: "Sunny Studio near Dragon Bridge",
    location: "Son Tra District, Da Nang, Vietnam",
    district: "Son Tra",
    rent: 4500000,
    distance: 1.2,
    matchScore: 92,
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
    ],
    roomType: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    amenities: ["Fast WiFi (500 Mbps)", "Air conditioning", "Shared Kitchen", "Washing Machine", "Free Motorbike Parking", "Dedicated Workspace", "Pets allowed", "Balcony", "Security Camera", "24/7 Access", "Water Heater", "Refrigerator", "TV", "Cleaning Service", "Elevator"],
    description: "Welcome to our sunny and spacious studio apartment located in the heart of Da Nang. Just a 5-minute walk to the iconic Dragon Bridge and surrounded by vibrant cafes and street food stalls. The apartment features large windows that let in plenty of natural light, creating a warm and inviting atmosphere.\n\nIdeal for students or young professionals, the building is secure with 24/7 camera surveillance and key card access. We are located near Duy Tan University (1.5km) and the Han Market (1km).",
    availableFrom: "2026-04-01",
    duration: "6 months+",
    currentRoommates: [
      { name: "Linh Nguyen", age: 27, occupation: "Software Dev", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LinhR", tags: ["Early Bird", "Quiet", "Non-smoker"], quote: "Hi! I'm looking for a chill roommate to share this lovely space. I love cooking and keeping things tidy." },
      { name: "Minh Tran", age: 25, occupation: "Graphic Designer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhR", tags: ["Owner", "Night Owl", "Petlover"], quote: "Hey there! I work remotely mostly. Looking for someone respectful and friendly." },
    ],
    owner: { name: "Minh Tran", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhR", phone: "+84 912 345 678", responseTime: "Usually responds within 1 hour" },
    reviews: [
      { author: "David", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David", date: "October 2025", rating: 5, text: "Great place for students! The internet is super fast which helps with my studies. The other roommates are very respectful." },
      { author: "Sarah", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah", date: "September 2025", rating: 5, text: "The location is unbeatable. Morning walks by the Han River are the best. The room is exactly like the photos." },
    ],
    rating: 4.8,
    reviewCount: 12,
    verified: true,
    petsAllowed: true,
  },
  {
    id: "r2",
    title: "Modern Apartment in Hai Chau",
    location: "Hai Chau District, Da Nang, Vietnam",
    district: "Hai Chau",
    rent: 5500000,
    distance: 0.8,
    matchScore: 87,
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
    ],
    roomType: "Private Room",
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    amenities: ["Fast WiFi", "Air conditioning", "Full Kitchen", "Washing Machine", "Parking", "Gym Access", "Swimming Pool", "Security", "Elevator", "Balcony"],
    description: "A beautifully designed modern apartment in the center of Hai Chau. Walking distance to cafes, restaurants, and the beach. Perfect for young professionals who appreciate contemporary living.",
    availableFrom: "2026-03-15",
    duration: "12 months+",
    currentRoommates: [
      { name: "An Pham", age: 24, occupation: "Marketing", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnP", tags: ["Social", "Clean", "Fitness"], quote: "Love this place! Looking for a friendly roommate." },
    ],
    owner: { name: "Hung Le", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=HungL", phone: "+84 903 456 789", responseTime: "Usually responds within 2 hours" },
    reviews: [
      { author: "Mai", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mai", date: "November 2025", rating: 4, text: "Great location and modern amenities. The gym is a nice bonus." },
    ],
    rating: 4.5,
    reviewCount: 8,
    verified: true,
    petsAllowed: false,
  },
  {
    id: "r3",
    title: "Cozy Room near My Khe Beach",
    location: "Ngu Hanh Son District, Da Nang, Vietnam",
    district: "Ngu Hanh Son",
    rent: 3800000,
    distance: 2.5,
    matchScore: 79,
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],
    roomType: "Shared Room",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    amenities: ["WiFi", "Air conditioning", "Shared Kitchen", "Washing Machine", "Beach Access", "Motorbike Parking"],
    description: "Just 3 minutes walk from My Khe Beach! A cozy shared room perfect for beach lovers and students. The area is quiet and peaceful, with many local food options nearby.",
    availableFrom: "2026-03-20",
    duration: "3 months+",
    currentRoommates: [],
    owner: { name: "Tuan Nguyen", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=TuanN", phone: "+84 905 678 123", responseTime: "Usually responds within 30 minutes" },
    reviews: [
      { author: "Lisa", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa", date: "August 2025", rating: 4, text: "Loved being so close to the beach. Great value for money!" },
    ],
    rating: 4.3,
    reviewCount: 6,
    verified: true,
    petsAllowed: true,
  },
  {
    id: "r4",
    title: "Premium Penthouse View",
    location: "Hai Chau District, Da Nang, Vietnam",
    district: "Hai Chau",
    rent: 8000000,
    distance: 1.0,
    matchScore: 95,
    thumbnail: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    roomType: "Master Bedroom",
    bedrooms: 3,
    bathrooms: 2,
    area: 90,
    amenities: ["Fast WiFi", "Air conditioning", "Full Kitchen", "Washing Machine", "Parking", "Gym", "Pool", "Rooftop Access", "City View", "Security", "Elevator", "Smart Home"],
    description: "Stunning penthouse with panoramic city views. Premium finishes throughout with smart home integration. Perfect for professionals who want the best living experience in Da Nang.",
    availableFrom: "2026-04-15",
    duration: "12 months+",
    currentRoommates: [
      { name: "Kevin Dao", age: 28, occupation: "Tech Lead", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin", tags: ["Clean", "Professional", "Tech"], quote: "Looking for a like-minded professional to share this amazing space." },
    ],
    owner: { name: "Kevin Dao", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin", phone: "+84 908 999 888", responseTime: "Usually responds within 1 hour" },
    reviews: [
      { author: "Tom", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Tom", date: "December 2025", rating: 5, text: "Best apartment I've stayed in Da Nang. The view is incredible." },
      { author: "Anna", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anna", date: "November 2025", rating: 5, text: "Premium quality in every detail. Worth every dong!" },
    ],
    rating: 4.9,
    reviewCount: 15,
    verified: true,
    petsAllowed: false,
  },
  {
    id: "r5",
    title: "Budget-Friendly Student Room",
    location: "Lien Chieu District, Da Nang, Vietnam",
    district: "Lien Chieu",
    rent: 2200000,
    distance: 4.0,
    matchScore: 72,
    thumbnail: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],
    roomType: "Shared Room",
    bedrooms: 1,
    bathrooms: 1,
    area: 25,
    amenities: ["WiFi", "Fan", "Shared Kitchen", "Motorbike Parking", "Near University"],
    description: "Affordable student housing near Da Nang University of Technology. Simple but clean and comfortable. Great for students on a budget.",
    availableFrom: "2026-03-10",
    duration: "6 months+",
    currentRoommates: [
      { name: "Huy Tran", age: 21, occupation: "Student", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Huy", tags: ["Student", "Gamer", "Flexible"], quote: "Chill roommate needed! I'm easy-going and keep to myself mostly." },
    ],
    owner: { name: "Mrs. Lan", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lan", phone: "+84 901 234 567", responseTime: "Usually responds within 3 hours" },
    reviews: [
      { author: "Phong", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Phong", date: "October 2025", rating: 4, text: "Good value for students. Clean and close to school." },
    ],
    rating: 4.1,
    reviewCount: 4,
    verified: false,
    petsAllowed: false,
  },
  {
    id: "r6",
    title: "Riverside Loft in Cam Le",
    location: "Cam Le District, Da Nang, Vietnam",
    district: "Cam Le",
    rent: 6000000,
    distance: 3.2,
    matchScore: 84,
    thumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    roomType: "Private Room",
    bedrooms: 2,
    bathrooms: 2,
    area: 70,
    amenities: ["Fast WiFi", "Air conditioning", "Full Kitchen", "Washing Machine", "River View", "Parking", "Security", "Balcony", "Garden"],
    description: "Beautiful riverside loft with stunning views of the Han River. Modern interior with an industrial-chic design. Quiet neighborhood perfect for remote workers.",
    availableFrom: "2026-04-01",
    duration: "6 months+",
    currentRoommates: [],
    owner: { name: "Duc Vo", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DucV", phone: "+84 906 789 012", responseTime: "Usually responds within 2 hours" },
    reviews: [
      { author: "Emma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma", date: "January 2026", rating: 5, text: "The river view is breathtaking. Perfect for morning coffee and evening relaxation." },
    ],
    rating: 4.6,
    reviewCount: 9,
    verified: true,
    petsAllowed: true,
  },
];

/* ─── Chat/Message Data ─── */
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

export const conversations: Conversation[] = [
  {
    id: "c1",
    participantId: "2",
    participantName: "Linh Nguyen",
    participantAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linh",
    participantOccupation: "Student at FPT",
    online: true,
    lastMessage: "Is the room still available?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "2", text: "Hi! I saw your profile and I think we'd be a good match for the apartment in Son Tra.", timestamp: "10:15 AM", read: true },
      { id: "m2", senderId: "current", text: "Hey Linh! Thanks for reaching out. That sounds great! What part of Da Nang are you looking to stay in specifically?", timestamp: "10:20 AM", read: true },
      { id: "m3", senderId: "2", text: "Ideally near the beach, maybe somewhere around My Khe? I love the morning vibe there.", timestamp: "10:25 AM", read: true },
      { id: "m4", senderId: "2", text: "Also, is the room still available?", timestamp: "10:30 AM", read: false },
    ],
  },
  {
    id: "c2",
    participantId: "8",
    participantName: "Sarah Jenkins",
    participantAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SarahJ",
    participantOccupation: "UX Designer",
    online: false,
    lastMessage: "Let's meet for coffee...",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "m5", senderId: "8", text: "Hi there! I noticed we have a 85% match. Would love to chat about potentially being roommates!", timestamp: "Yesterday 2:00 PM", read: true },
      { id: "m6", senderId: "current", text: "Hey Sarah! That sounds great. I'm looking for someone clean and respectful.", timestamp: "Yesterday 2:30 PM", read: true },
      { id: "m7", senderId: "8", text: "Let's meet for coffee to discuss the details?", timestamp: "Yesterday 3:00 PM", read: true },
    ],
  },
  {
    id: "c3",
    participantId: "1",
    participantName: "Minh Tran",
    participantAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Minh",
    participantOccupation: "Software Developer",
    online: false,
    lastMessage: "Sounds good! See you then.",
    lastMessageTime: "Oct 24",
    unreadCount: 0,
    messages: [
      { id: "m8", senderId: "current", text: "Hey Minh! Want to check out that apartment in Hai Chau together?", timestamp: "Oct 24 9:00 AM", read: true },
      { id: "m9", senderId: "1", text: "Sounds good! See you then.", timestamp: "Oct 24 9:15 AM", read: true },
    ],
  },
  {
    id: "c4",
    participantId: "4",
    participantName: "Emily Dao",
    participantAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
    participantOccupation: "Graphic Designer",
    online: false,
    lastMessage: "Can you send more photos of the kitchen?",
    lastMessageTime: "Oct 22",
    unreadCount: 0,
    messages: [
      { id: "m10", senderId: "4", text: "Can you send more photos of the kitchen?", timestamp: "Oct 22 4:00 PM", read: true },
    ],
  },
];

export const lifestyleOptions = [
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
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};
