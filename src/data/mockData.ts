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
