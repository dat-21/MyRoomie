// Admin mock data for landlords and students/tenants

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

export const adminStats: AdminStats = {
  totalUsers: 1247,
  totalLandlords: 312,
  totalTenants: 935,
  pendingApprovals: 23,
  totalRooms: 486,
  activeRooms: 412,
  totalMatches: 2847,
  totalMessages: 15632,
  monthlyGrowth: 12.5,
};

export const adminLandlords: AdminLandlord[] = [
  {
    id: "l1",
    name: "Minh Tran",
    email: "minh.tran@email.com",
    phone: "+84 912 345 678",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhR",
    role: "landlord",
    status: "active",
    joinDate: "2025-06-15",
    lastActive: "2026-03-10",
    verified: true,
    totalRooms: 3,
    totalViews: 1250,
    totalInquiries: 45,
    rating: 4.8,
    reviewCount: 24,
    responseTime: "< 1 hour",
    area: "Son Tra, Da Nang",
  },
  {
    id: "l2",
    name: "Hung Le",
    email: "hung.le@email.com",
    phone: "+84 903 456 789",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=HungL",
    role: "landlord",
    status: "active",
    joinDate: "2025-08-20",
    lastActive: "2026-03-09",
    verified: true,
    totalRooms: 2,
    totalViews: 890,
    totalInquiries: 32,
    rating: 4.5,
    reviewCount: 18,
    responseTime: "< 2 hours",
    area: "Hai Chau, Da Nang",
  },
  {
    id: "l3",
    name: "Tuan Nguyen",
    email: "tuan.nguyen@email.com",
    phone: "+84 905 678 123",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=TuanN",
    role: "landlord",
    status: "pending",
    joinDate: "2026-03-01",
    lastActive: "2026-03-08",
    verified: false,
    totalRooms: 1,
    totalViews: 42,
    totalInquiries: 3,
    rating: 0,
    reviewCount: 0,
    responseTime: "< 30 mins",
    area: "Ngu Hanh Son, Da Nang",
  },
  {
    id: "l4",
    name: "Mrs. Lan",
    email: "lan.pham@email.com",
    phone: "+84 901 234 567",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lan",
    role: "landlord",
    status: "active",
    joinDate: "2025-04-10",
    lastActive: "2026-03-11",
    verified: true,
    totalRooms: 5,
    totalViews: 2100,
    totalInquiries: 78,
    rating: 4.2,
    reviewCount: 31,
    responseTime: "< 3 hours",
    area: "Lien Chieu, Da Nang",
  },
  {
    id: "l5",
    name: "Kevin Dao",
    email: "kevin.dao@email.com",
    phone: "+84 908 999 888",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin",
    role: "landlord",
    status: "suspended",
    joinDate: "2025-09-05",
    lastActive: "2026-02-15",
    verified: true,
    totalRooms: 1,
    totalViews: 320,
    totalInquiries: 12,
    rating: 3.2,
    reviewCount: 8,
    responseTime: "< 1 hour",
    area: "Hai Chau, Da Nang",
  },
  {
    id: "l6",
    name: "Duc Vo",
    email: "duc.vo@email.com",
    phone: "+84 906 789 012",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DucV",
    role: "landlord",
    status: "active",
    joinDate: "2025-11-22",
    lastActive: "2026-03-10",
    verified: true,
    totalRooms: 2,
    totalViews: 560,
    totalInquiries: 21,
    rating: 4.6,
    reviewCount: 14,
    responseTime: "< 2 hours",
    area: "Cam Le, Da Nang",
  },
];

export const adminTenants: AdminTenant[] = [
  {
    id: "t1",
    name: "Minh Tran",
    email: "minh.t.student@email.com",
    phone: "+84 912 111 222",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Minh",
    role: "tenant",
    status: "active",
    joinDate: "2025-12-01",
    lastActive: "2026-03-11",
    verified: true,
    age: 23,
    occupation: "Software Developer",
    location: "Hai Chau, Da Nang",
    budgetMin: 3000000,
    budgetMax: 4500000,
    moveInDate: "2026-03-15",
    matchCount: 12,
    messagesCount: 45,
  },
  {
    id: "t2",
    name: "Linh Nguyen",
    email: "linh.nguyen@email.com",
    phone: "+84 913 222 333",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linh",
    role: "tenant",
    status: "active",
    joinDate: "2025-11-15",
    lastActive: "2026-03-10",
    verified: true,
    age: 22,
    occupation: "University Student",
    location: "Son Tra, Da Nang",
    budgetMin: 2500000,
    budgetMax: 3500000,
    moveInDate: "2026-03-01",
    matchCount: 8,
    messagesCount: 32,
  },
  {
    id: "t3",
    name: "Duc Pham",
    email: "duc.pham@email.com",
    phone: "+84 914 333 444",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Duc",
    role: "tenant",
    status: "pending",
    joinDate: "2026-03-05",
    lastActive: "2026-03-09",
    verified: false,
    age: 25,
    occupation: "Marketing Manager",
    location: "Ngu Hanh Son, Da Nang",
    budgetMin: 4000000,
    budgetMax: 6000000,
    moveInDate: "2026-04-01",
    matchCount: 3,
    messagesCount: 5,
  },
  {
    id: "t4",
    name: "Hana Le",
    email: "hana.le@email.com",
    phone: "+84 915 444 555",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hana",
    role: "tenant",
    status: "active",
    joinDate: "2025-10-20",
    lastActive: "2026-03-08",
    verified: false,
    age: 21,
    occupation: "Graphic Designer",
    location: "Thanh Khe, Da Nang",
    budgetMin: 2000000,
    budgetMax: 3000000,
    moveInDate: "2026-03-10",
    matchCount: 6,
    messagesCount: 18,
  },
  {
    id: "t5",
    name: "Khanh Vo",
    email: "khanh.vo@email.com",
    phone: "+84 916 555 666",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Khanh",
    role: "tenant",
    status: "active",
    joinDate: "2025-09-10",
    lastActive: "2026-03-11",
    verified: true,
    age: 24,
    occupation: "Data Analyst",
    location: "Hai Chau, Da Nang",
    budgetMin: 3500000,
    budgetMax: 5000000,
    moveInDate: "2026-03-20",
    matchCount: 15,
    messagesCount: 67,
  },
  {
    id: "t6",
    name: "Thao Mai",
    email: "thao.mai@email.com",
    phone: "+84 917 666 777",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Thao",
    role: "tenant",
    status: "suspended",
    joinDate: "2025-07-25",
    lastActive: "2026-01-20",
    verified: true,
    age: 26,
    occupation: "English Teacher",
    location: "Cam Le, Da Nang",
    budgetMin: 3000000,
    budgetMax: 4000000,
    moveInDate: "2026-04-15",
    matchCount: 4,
    messagesCount: 12,
  },
  {
    id: "t7",
    name: "Bao Hoang",
    email: "bao.hoang@email.com",
    phone: "+84 918 777 888",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bao",
    role: "tenant",
    status: "pending",
    joinDate: "2026-03-08",
    lastActive: "2026-03-10",
    verified: false,
    age: 22,
    occupation: "University Student",
    location: "Lien Chieu, Da Nang",
    budgetMin: 2000000,
    budgetMax: 3000000,
    moveInDate: "2026-03-05",
    matchCount: 2,
    messagesCount: 3,
  },
  {
    id: "t8",
    name: "Vy Dang",
    email: "vy.dang@email.com",
    phone: "+84 919 888 999",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vy",
    role: "tenant",
    status: "active",
    joinDate: "2025-08-30",
    lastActive: "2026-03-11",
    verified: true,
    age: 24,
    occupation: "UX Designer",
    location: "Son Tra, Da Nang",
    budgetMin: 3500000,
    budgetMax: 5000000,
    moveInDate: "2026-03-25",
    matchCount: 10,
    messagesCount: 38,
  },
];

export const adminReviews: AdminReview[] = [
  {
    id: "r1",
    reviewerId: "t1",
    reviewerName: "Minh Tran",
    reviewerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Minh",
    targetId: "l1",
    targetName: "Minh Tran (Landlord)",
    targetRole: "landlord",
    rating: 5,
    text: "Excellent landlord! Very responsive and the apartment was exactly as described. Highly recommend!",
    date: "2026-02-15",
    status: "visible",
  },
  {
    id: "r2",
    reviewerId: "t2",
    reviewerName: "Linh Nguyen",
    reviewerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linh",
    targetId: "l2",
    targetName: "Hung Le",
    targetRole: "landlord",
    rating: 4,
    text: "Good experience overall. The location is great and Hung was helpful with the move-in process.",
    date: "2026-01-28",
    status: "visible",
  },
  {
    id: "r3",
    reviewerId: "l1",
    reviewerName: "Minh Tran (Landlord)",
    reviewerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhR",
    targetId: "t5",
    targetName: "Khanh Vo",
    targetRole: "tenant",
    rating: 5,
    text: "Khanh was an ideal tenant - always paid on time, kept the place spotless, and was very respectful.",
    date: "2026-02-20",
    status: "visible",
  },
  {
    id: "r4",
    reviewerId: "t4",
    reviewerName: "Hana Le",
    reviewerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hana",
    targetId: "l5",
    targetName: "Kevin Dao",
    targetRole: "landlord",
    rating: 2,
    text: "Not a great experience. Communication was poor and some issues weren't addressed properly.",
    date: "2026-02-10",
    status: "flagged",
  },
  {
    id: "r5",
    reviewerId: "l4",
    reviewerName: "Mrs. Lan",
    reviewerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lan",
    targetId: "t1",
    targetName: "Minh Tran",
    targetRole: "tenant",
    rating: 5,
    text: "A wonderful tenant! Always respectful, quiet, and took great care of the property.",
    date: "2026-03-01",
    status: "visible",
  },
];
