import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    PlusCircle,
    Users,
    Home,
    MessageCircle,
    Eye,
    TrendingUp,
    Clock,
    ChevronRight,
    MapPin,
    Building,
    ExternalLink,
    Rocket,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Calendar,
    Crown,
    Bell,
    ArrowDownRight,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import { getRooms } from "../services";
import { formatCurrency } from "../lib/format";
import type { RoomListing } from "../types";
import { useAuth } from "../contexts/AuthContext";

/* ─── Fade-in section wrapper ─── */
function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const [ref, inView] = useInView(0.12);
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─── Dashboard Stats ─── */
function DashboardStat({ label, value, trend, trendUp, icon: Icon, color }: {
    label: string, value: string, trend?: string, trendUp?: boolean, icon: any, color: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-border/60 shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm`}>
                    <Icon size={24} className="text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-text mb-1 font-[family-name:var(--font-family-heading)]">{value}</div>
            <div className="text-sm text-text-muted font-medium">{label}</div>
        </motion.div>
    );
}

type MyRoom = RoomListing & {
    status: string;
    views: number;
    inquiries: number;
    revenue: number;
    occupancy: number;
    boostRemaining: string | null;
};

const recentActivity = [
    { id: 1, type: "message", user: "Phạm Minh", action: "đã gửi tin nhắn cho", room: "Phòng trọ Hai Châu", time: "15 phút trước", avatar: "PM" },
    { id: 2, type: "view", user: "15 sinh viên mới", action: "vừa xem phòng của bạn tại", room: "Sơn Trà", time: "1 giờ trước", avatar: "15" },
    { id: 3, type: "boost", user: "Hệ thống", action: "đã đẩy tin thành công gói 24h cho", room: "Phòng Master Ngũ Hành Sơn", time: "3 giờ trước", avatar: "BS" },
    { id: 4, type: "rented", user: "Lê Khanh", action: "đã ký hợp đồng thuê", room: "Căn hộ Studio Quận 3", time: "Hôm qua", avatar: "LK" },
];

/* ─── Main Dashboard Page ─── */
export default function LandlordHomePage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [myRooms, setMyRooms] = useState<MyRoom[]>([]);

    useEffect(() => {
        getRooms().then((data) => {
            setMyRooms(data.slice(0, 4).map((r, i) => ({
                ...r,
                status: i % 3 === 0 ? "active" : i % 3 === 1 ? "rented" : "pending",
                views: [245, 120, 89, 210][i] ?? 0,
                inquiries: [18, 5, 2, 12][i] ?? 0,
                revenue: [4500000, 3500000, 0, 4200000][i] ?? 0,
                occupancy: i % 3 === 1 ? 100 : 0,
                boostRemaining: i === 0 ? "18h 30m" : null,
            })));
        });
    }, []);

    return (
        <div className="pb-12 max-w-[1400px] mx-auto">
            {/* Header / Welcome */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-4 px-4 sm:px-0">
                <div>
                    <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Chào mừng trở lại, {user?.name || "Chủ trọ"} 👋
                    </h1>
                    <p className="text-text-muted mt-1 font-medium">
                        Đây là hiệu quả hoạt động các phòng trọ của bạn trong 30 ngày qua.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/explore">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-text font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                        >
                            <Search size={18} className="text-secondary" />
                            Khám phá thị trường
                        </motion.button>
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-text font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
                        <Calendar size={18} className="text-text-muted" />
                        30 ngày qua
                    </button>
                    <Link to="/post">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 cursor-pointer border-0"
                        >
                            <PlusCircle size={18} />
                            Đăng phòng mới
                        </motion.button>
                    </Link>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 px-4 sm:px-0">
                <DashboardStat
                    label="Tổng doanh thu"
                    value="12.2tr VNĐ"
                    trend="+12%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <DashboardStat
                    label="Tổng lượt xem"
                    value="1,425"
                    trend="+8.5%"
                    trendUp={true}
                    icon={Eye}
                    color="bg-primary"
                />
                <DashboardStat
                    label="Lượt liên hệ mới"
                    value="42"
                    trend="-2%"
                    trendUp={false}
                    icon={MessageCircle}
                    color="bg-secondary"
                />
                <DashboardStat
                    label="Tỷ lệ lấp đầy"
                    value="75%"
                    trend="+5%"
                    trendUp={true}
                    icon={Building}
                    color="bg-accent"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 px-4 sm:px-0">
                {/* Middle - Performance Tracking / List */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Listings Performance */}
                    <FadeSection>
                        <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border/60 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-lg font-bold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                    <Building size={20} className="text-primary" />
                                    Hiệu quả tin đăng
                                </h2>
                                <Link to="/rooms" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                                    Xem tất cả <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/50 text-xs text-text-muted uppercase tracking-wider font-bold">
                                            <th className="px-6 py-4">Phòng</th>
                                            <th className="px-6 py-4 text-center">Trạng thái</th>
                                            <th className="px-6 py-4 text-center">Lượt xem</th>
                                            <th className="px-6 py-4 text-center">Inquiry</th>
                                            <th className="px-6 py-4 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {myRooms.map((room) => (
                                            <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={room.thumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-text truncate">{room.title}</div>
                                                            <div className="text-[10px] text-text-muted flex items-center gap-1">
                                                                <MapPin size={10} /> {room.district}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                        room.status === "active" ? "bg-green-100 text-green-700" :
                                                        room.status === "rented" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                        {room.status === "active" ? "Đang trống" : room.status === "rented" ? "Đã thuê" : "Chờ duyệt"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-semibold text-text">{room.views}</td>
                                                <td className="px-6 py-4 text-center text-sm font-semibold text-text">{room.inquiries}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-text-muted transition-colors border-0 bg-transparent cursor-pointer">
                                                            <TrendingUp size={16} />
                                                        </button>
                                                        {room.status === "active" && (
                                                            <button className="p-2 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors border-0 bg-transparent cursor-pointer">
                                                                <Rocket size={16} />
                                                            </button>
                                                        )}
                                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-text-muted transition-colors border-0 bg-transparent cursor-pointer">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </FadeSection>

                    {/* Quick Analytics Simulation */}
                    <FadeSection delay={0.1}>
                        <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-text mb-6 font-[family-name:var(--font-family-heading)]">Xu hướng lượt xem</h2>
                            <div className="h-[250px] flex items-end gap-2 justify-between px-2">
                                {[35, 45, 30, 60, 85, 40, 55, 70, 95, 80, 65, 100].map((height, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                                            className={`w-full rounded-t-lg transition-colors cursor-pointer ${i === 11 ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"}`}
                                        />
                                        <span className="text-[10px] text-text-muted font-bold">{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeSection>
                </div>

                {/* Right Sidebar - Activity & Tasks */}
                <div className="space-y-8">
                    {/* Plan Information */}
                    <FadeSection delay={0.2}>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                                    <Crown size={16} className="text-white fill-white" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/70">Gói hiện tại</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Standard Plan</h3>
                            <p className="text-white/60 text-xs mb-6 font-medium">Lên Gold để x5 hiệu quả tìm khách.</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/60">Đẩy tin còn lại</span>
                                    <span className="font-bold">2/3</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[66%]" />
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-white/60">Mở phòng tối đa</span>
                                    <span className="font-bold">5/10</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[50%]" />
                                </div>
                            </div>

                            <Link to="/premium">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-white text-gray-900 font-bold text-sm shadow-lg shadow-white/10 cursor-pointer border-0"
                                >
                                    Nâng cấp ngay
                                </motion.button>
                            </Link>
                        </div>
                    </FadeSection>

                    {/* Recent Activity */}
                    <FadeSection delay={0.3}>
                        <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-text uppercase tracking-widest flex items-center gap-2">
                                    <Bell size={16} className="text-primary" />
                                    Hoạt động mới
                                </h2>
                                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer">
                                    <Filter size={14} className="text-text-muted" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 group">
                                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                                            activity.type === "message" ? "bg-blue-100 text-blue-600" :
                                            activity.type === "view" ? "bg-primary/10 text-primary" :
                                            activity.type === "boost" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                                        }`}>
                                            {activity.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-text leading-snug">
                                                <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-primary">{activity.room}</span>
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-1 font-medium">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-border text-xs text-text-muted font-bold hover:bg-gray-50 transition-all cursor-pointer bg-transparent">
                                Xem tất cả hoạt động
                            </button>
                        </div>
                    </FadeSection>
                </div>
            </div>
        </div>
    );
}
