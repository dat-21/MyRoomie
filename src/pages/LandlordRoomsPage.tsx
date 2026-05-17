import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlusCircle,
    Building,
    Eye,
    MessageCircle,
    Edit,
    Trash2,
    TrendingUp,
    MapPin,
    Search,
    ListFilter,
    ArrowUpRight,
    CheckCircle2,
    Rocket,
    Clock,
    Zap,
    Flame,
    Check,
    Sparkles,
    MoreVertical,
    Calendar,
    ArrowDownRight,
    ChevronRight,
} from "lucide-react";
import { getLandlordRooms } from "../services";
import { formatCurrency } from "../lib/format";
import Modal from "../components/Modal";

/* ─────────────── Types ─────────────── */
type RoomStatus = "active" | "rented" | "pending";

interface BoostPlan {
    id: "24h" | "3d" | "7d";
    label: string;
    duration: string;
    price: number;
    icon: React.ElementType;
    color: string;
    viewMultiplier: number;
    popular?: boolean;
}

interface BoostInfo {
    plan: BoostPlan;
    startTime: number;
    endTime: number;
    viewsBefore: number;
    extraViews: number;
}

interface LandlordRoom {
    id: string;
    title: string;
    district: string;
    rent: number;
    thumbnail: string;
    status: RoomStatus;
    views: number;
    inquiries: number;
    postedDate: string;
    revenue: number;
}

/* ─────────────── Boost Plans ─────────────── */
const boostPlans: BoostPlan[] = [
    { id: "24h", label: "Đẩy 24 giờ", duration: "24 giờ", price: 15000, icon: Zap, color: "from-blue-500 to-cyan-400", viewMultiplier: 2.5 },
    { id: "3d", label: "Đẩy 3 ngày", duration: "3 ngày", price: 35000, icon: Flame, color: "from-orange-500 to-amber-400", viewMultiplier: 3.5, popular: true },
    { id: "7d", label: "Đẩy 7 ngày", duration: "7 ngày", price: 59000, icon: Rocket, color: "from-purple-600 to-pink-500", viewMultiplier: 5 },
];

/* ─────────────── Mock Data builder ─────────────── */
function buildLandlordRooms(apiRooms: { id: string; title: string; district: string; rent: number; thumbnail: string }[]): LandlordRoom[] {
    return apiRooms.slice(0, 5).map((r, i) => ({
        id: r.id,
        title: r.title,
        district: r.district,
        rent: r.rent,
        thumbnail: r.thumbnail,
        status: (i === 0 || i === 1 ? "active" : i === 4 ? "pending" : "rented") as RoomStatus,
        views: [1245, 890, 3200, 450, 10][i] ?? 0,
        inquiries: [15, 8, 45, 2, 0][i] ?? 0,
        postedDate: ["2026-03-20", "2026-03-10", "2025-11-05", "2026-02-15", "2026-03-25"][i] ?? "2026-01-01",
        revenue: i === 2 || i === 3 ? r.rent : 0,
        boosts: {},
    }));
}

/* ─────────────── Helper: time remaining ─────────────── */
function getTimeRemaining(endTime: number): string {
    const diff = endTime - Date.now();
    if (diff <= 0) return "Đã hết hạn";
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h còn lại`;
    return `${hours}h ${minutes}m còn lại`;
}

/* ══════════════════════════════════════════
   Stat Card Component
   ══════════════════════════════════════════ */
function ManageStat({ label, value, icon: Icon, color, trend, trendUp }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-sm`}>
                <Icon size={20} />
            </div>
            <div>
                <div className="text-xl font-bold text-text mb-0.5">{value}</div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-medium">{label}</span>
                    {trend && (
                        <span className={`text-[10px] font-bold ${trendUp ? "text-green-600" : "text-red-600"}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   BoostModal Component (Same functionality, styled for admin)
   ══════════════════════════════════════════ */
function BoostModal({ isOpen, onClose, room, onConfirm }: any) {
    const [selected, setSelected] = useState<BoostPlan["id"]>("3d");
    if (!room) return null;
    const plan = boostPlans.find(p => p.id === selected)!;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 text-white">
                        <Rocket size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">Đẩy tin thông minh</h2>
                    <p className="text-text-muted text-sm mt-2">Phòng <span className="text-text font-bold">"{room.title}"</span> sẽ được đưa lên đầu danh sách tìm kiếm.</p>
                </div>

                <div className="space-y-3 mb-8">
                    {boostPlans.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelected(p.id)}
                            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer ${
                                selected === p.id ? "border-amber-500 bg-amber-50" : "border-border bg-white hover:border-amber-200"
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-sm`}>
                                <p.icon size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-bold text-text">{p.label}</div>
                                <div className="text-xs text-text-muted mt-0.5">{p.duration} ưu tiên hiển thị</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-text">{formatCurrency(p.price)}</div>
                                <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider">~{p.viewMultiplier}x Views</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border bg-white text-text-light font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer">Hủy bỏ</button>
                    <button onClick={() => { onConfirm(room.id, plan); onClose(); }} className="flex-[2] py-3 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 border-0 cursor-pointer">Thanh toán & Đẩy tin</button>
                </div>
            </div>
        </Modal>
    );
}

/* ══════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════ */
export default function LandlordRoomsPage() {
    const [filter, setFilter] = useState<RoomStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [boostModalOpen, setBoostModalOpen] = useState(false);
    const [boostTargetRoom, setBoostTargetRoom] = useState<LandlordRoom | null>(null);
    const [myRooms, setMyRooms] = useState<LandlordRoom[]>([]);

    useEffect(() => {
        getLandlordRooms().then((data) => setMyRooms(buildLandlordRooms(data)));
    }, []);

    const filteredRooms = myRooms.filter(r => {
        const matchesF = filter === "all" || r.status === filter;
        const matchesS = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.district.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesF && matchesS;
    });

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-0 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">Quản lý kho phòng</h1>
                    <p className="text-text-muted mt-1 font-medium">Theo dõi hiệu quả, đẩy tin và quản lý trạng thái thuê.</p>
                </div>
                <Link to="/post">
                    <motion.button whileHover={{ y: -2 }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 border-0 cursor-pointer">
                        <PlusCircle size={20} /> Đăng phòng mới
                    </motion.button>
                </Link>
            </header>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <ManageStat label="Tổng số phòng" value={myRooms.length} icon={Building} color="bg-primary" trend="+20%" trendUp={true} />
                <ManageStat label="Đang cho thuê" value={myRooms.filter(r => r.status === "rented").length} icon={CheckCircle2} color="bg-green-500" trend="+15%" trendUp={true} />
                <ManageStat label="Tổng views (Tháng)" value="12.4k" icon={Eye} color="bg-secondary" trend="+5.2%" trendUp={true} />
                <ManageStat label="Tổng doanh thu" value={formatCurrency(myRooms.reduce((acc, r) => acc + r.revenue, 0))} icon={TrendingUp} color="bg-accent" trend="+8%" trendUp={true} />
            </div>

            {/* Controls */}
            <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex bg-gray-50 border border-border p-1 rounded-xl w-fit">
                    {(["all", "active", "rented", "pending"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${
                                filter === f ? "bg-white shadow-sm text-primary" : "bg-transparent text-text-muted hover:text-text"
                            }`}
                        >
                            {f === "all" ? "Tất cả" : f === "active" ? "Còn trống" : f === "rented" ? "Đã thuê" : "Chờ duyệt"}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 flex-1 md:max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc quận..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl border border-border bg-white text-text-muted hover:bg-gray-50 cursor-pointer">
                        <ListFilter size={18} />
                    </button>
                </div>
            </div>

            {/* Data Dense Listings (Table-like View) */}
            <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/60 text-[10px] text-text-muted uppercase tracking-[0.1em] font-bold bg-gray-50/50">
                                <th className="px-8 py-5">Thông tin phòng</th>
                                <th className="px-6 py-5 text-center">Trạng thái</th>
                                <th className="px-6 py-5 text-center">Doanh thu</th>
                                <th className="px-6 py-5">Hiệu suất</th>
                                <th className="px-8 py-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={room.thumbnail} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-100" alt="" />
                                                {room.status === "active" && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-text mb-1 truncate group-hover:text-primary transition-colors">{room.title}</div>
                                                <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold">
                                                    <span className="flex items-center gap-1"><MapPin size={10} /> {room.district}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(room.postedDate).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            room.status === "active" ? "bg-green-50 text-green-600" :
                                            room.status === "rented" ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                room.status === "active" ? "bg-green-600" :
                                                room.status === "rented" ? "bg-blue-600" : "bg-yellow-600"
                                            }`} />
                                            {room.status === "active" ? "Đang trống" : room.status === "rented" ? "Đã lấp đầy" : "Chờ duyệt"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="text-sm font-bold text-text">{formatCurrency(room.rent)}</div>
                                        <div className="text-[10px] text-text-muted mt-0.5 font-medium">/ tháng</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-3 max-w-[120px]">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-text-muted uppercase">Views</span>
                                                <span className="text-text">{room.views}</span>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{ width: `${Math.min(100, (room.views / 2000) * 100)}%` }} />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-text-muted uppercase">Inquiries</span>
                                                <span className="text-text">{room.inquiries}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {room.status === "active" && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => { setBoostTargetRoom(room); setBoostModalOpen(true); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold uppercase transition-all shadow-sm shadow-amber-500/10 border-0 cursor-pointer"
                                                >
                                                    <Rocket size={12} /> Đẩy tin
                                                </motion.button>
                                            )}
                                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary text-text-muted transition-all border-0 cursor-pointer">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 text-text-muted transition-all border-0 cursor-pointer">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-muted transition-all border-0 cursor-pointer">
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

            {/* Boost Modal */}
            <BoostModal
                isOpen={boostModalOpen}
                onClose={() => { setBoostModalOpen(false); setBoostTargetRoom(null); }}
                room={boostTargetRoom}
                onConfirm={(id: string, plan: any) => {
                    console.log("Boost room", id, "with plan", plan);
                }}
            />
        </div>
    );
}
