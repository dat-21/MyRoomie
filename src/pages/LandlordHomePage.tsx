import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    PlusCircle,
    Users,
    Home,
    MessageCircle,
    Eye,
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    ChevronRight,
    MapPin,
    Building,
    Star,
    Search,
    ExternalLink,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import { rooms, formatCurrency } from "../data/mockData";

/* ─── Fade-in section wrapper ─── */
function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const [ref, inView] = useInView(0.12);
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, value, label, color, delay }: {
    icon: React.ElementType; value: string; label: string; color: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-2xl p-6 flex items-center gap-4"
        >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <div className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{value}</div>
                <div className="text-sm text-text-muted">{label}</div>
            </div>
        </motion.div>
    );
}

/* ─── Mock data for landlord ─── */
const myRooms = rooms.slice(0, 3).map((r, i) => ({
    ...r,
    status: i === 0 ? "active" as const : i === 1 ? "active" as const : "pending" as const,
    views: [125, 89, 42][i],
    inquiries: [8, 5, 2][i],
}));

const tenantRequests = [
    { id: "1", name: "Minh Tran", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Minh", area: "Hai Chau", budget: "3.5M - 4.5M VND", time: "2 hours ago", status: "new" as const },
    { id: "2", name: "Khanh Vo", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Khanh", area: "Son Tra", budget: "3M - 4M VND", time: "5 hours ago", status: "new" as const },
    { id: "3", name: "Linh Nguyen", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Linh", area: "Ngu Hanh Son", budget: "2.5M - 3.5M VND", time: "1 day ago", status: "viewed" as const },
];

/* ─── Hero Section (Landlord) ─── */
function LandlordHero() {
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
            {/* Background blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-accent/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Hero text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                        >
                            <Building size={16} />
                            Landlord Dashboard
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                            Manage Your{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Rental Easily
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-text-light leading-relaxed max-w-lg">
                            Manage rooms, track rental requests, and connect with the right tenants — all in one platform.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link to="/post">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-glow flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow cursor-pointer border-0 text-base"
                                >
                                    <PlusCircle size={18} />
                                    Post a Room
                                </motion.button>
                            </Link>

                            <Link to="/rooms">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/70 text-text font-semibold shadow-md hover:shadow-lg border border-white/40 backdrop-blur-sm transition-all cursor-pointer text-base"
                                >
                                    <Users size={18} className="text-secondary" />
                                    View Tenant Requests
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hidden lg:grid grid-cols-2 gap-4"
                    >
                        <StatCard icon={Home} value="3" label="Rooms Posted" color="from-primary to-primary-light" delay={0.4} />
                        <StatCard icon={Eye} value="256" label="Total Views" color="from-secondary to-secondary-light" delay={0.5} />
                        <StatCard icon={Users} value="15" label="Rental Requests" color="from-accent to-accent-light" delay={0.6} />
                        <StatCard icon={MessageCircle} value="8" label="New Messages" color="from-primary-dark to-primary" delay={0.7} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ─── My Rooms Section ─── */
function MyRoomsSection() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                My <span className="text-primary">Listings</span>
                            </h2>
                            <p className="text-text-light text-sm mt-1">Manage your rental room listings</p>
                        </div>
                        <Link to="/post" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-dark transition-colors no-underline">
                            Post New Room <ChevronRight size={16} />
                        </Link>
                    </div>
                </FadeSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRooms.map((room, i) => (
                        <FadeSection key={room.id} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="glass rounded-2xl overflow-hidden group"
                            >
                                <div className="relative">
                                    <img src={room.thumbnail} alt={room.title} className="w-full h-44 object-cover" />
                                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${room.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {room.status === "active" ? "Active" : "Pending"}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-text text-base mb-1 font-[family-name:var(--font-family-heading)] truncate">
                                        {room.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-text-muted text-xs mb-3">
                                        <MapPin size={12} />
                                        {room.district}
                                    </div>
                                    <div className="text-lg font-bold text-primary mb-3">
                                        {formatCurrency(room.rent)}<span className="text-sm font-normal text-text-muted">/month</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                        <div className="flex items-center gap-4 text-xs text-text-muted">
                                            <span className="flex items-center gap-1"><Eye size={13} /> {room.views} views</span>
                                            <span className="flex items-center gap-1"><MessageCircle size={13} /> {room.inquiries} inquiries</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Tenant Requests Section ─── */
function TenantRequestsSection() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                New <span className="text-secondary">Rental Requests</span>
                            </h2>
                            <p className="text-text-light text-sm mt-1">Tenants interested in your rooms</p>
                        </div>
                        <Link to="/matches" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-dark transition-colors no-underline">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                </FadeSection>

                <div className="space-y-3">
                    {tenantRequests.map((req, i) => (
                        <FadeSection key={req.id} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -2, scale: 1.005 }}
                                className="glass rounded-2xl p-5 flex items-center gap-4"
                            >
                                <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-xl object-cover bg-primary/10 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-text text-sm">{req.name}</span>
                                        {req.status === "new" && (
                                            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-semibold">New</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                                        <span className="flex items-center gap-1"><MapPin size={11} /> {req.area}</span>
                                        <span>Budget: {req.budget}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-text-muted hidden sm:block">{req.time}</span>
                                    <Link to={`/profile/${req.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs font-medium cursor-pointer border-0 shadow-sm"
                                        >
                                            <Eye size={13} /> View
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Quick Actions ─── */
function QuickActions() {
    const actions = [
        {
            icon: PlusCircle,
            title: "Post New Room",
            desc: "Add a rental listing to reach the right tenants.",
            to: "/post",
            color: "from-primary to-primary-light",
        },
        {
            icon: TrendingUp,
            title: "Upgrade to Premium",
            desc: "Get priority display and reach more tenants.",
            to: "/premium",
            color: "from-secondary to-secondary-light",
        },
        {
            icon: MessageCircle,
            title: "Messages",
            desc: "Reply to messages from interested tenants.",
            to: "#",
            color: "from-accent to-accent-light",
        },
    ];

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Quick <span className="text-primary">Actions</span>
                    </h2>
                </FadeSection>

                <div className="grid sm:grid-cols-3 gap-6">
                    {actions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <FadeSection key={action.title} delay={i * 0.12}>
                                <Link to={action.to} className="no-underline">
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        className="glass rounded-2xl p-7 text-center group cursor-pointer h-full"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold text-text mb-2 font-[family-name:var(--font-family-heading)]">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-text-light leading-relaxed">{action.desc}</p>
                                        <div className="mt-4 flex items-center justify-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Go <ArrowRight size={14} />
                                        </div>
                                    </motion.div>
                                </Link>
                            </FadeSection>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ─── Browse Other Rooms on Platform ─── */
function BrowseOtherRooms() {
    // Exclude rooms already owned by the landlord (first 3 are "my rooms")
    const otherRooms = rooms.slice(3);
    const [showAll, setShowAll] = useState(false);
    const displayedRooms = showAll ? otherRooms : otherRooms.slice(0, 3);

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                Browse <span className="text-secondary">Other Listings</span>
                            </h2>
                            <p className="text-text-light text-sm mt-1">See what other landlords are posting on the platform</p>
                        </div>
                        <Link to="/rooms" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-dark transition-colors no-underline">
                            View All Rooms <ChevronRight size={16} />
                        </Link>
                    </div>
                </FadeSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedRooms.map((room, i) => (
                        <FadeSection key={room.id} delay={i * 0.1}>
                            <Link to={`/rooms/${room.id}`} className="no-underline">
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className="glass rounded-2xl overflow-hidden group cursor-pointer h-full"
                                >
                                    <div className="relative">
                                        <img src={room.thumbnail} alt={room.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        {room.verified && (
                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Verified
                                            </span>
                                        )}
                                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
                                            {room.matchScore}% match
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-text text-base mb-1 font-[family-name:var(--font-family-heading)] truncate group-hover:text-primary transition-colors">
                                            {room.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-text-muted text-xs mb-2">
                                            <MapPin size={12} />
                                            {room.district}
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-lg font-bold text-primary">
                                                {formatCurrency(room.rent)}<span className="text-sm font-normal text-text-muted">/month</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-text-muted">
                                                <Star size={12} className="text-gold fill-gold" />
                                                {room.rating}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                            <span className="px-2 py-0.5 rounded-full bg-primary/8">{room.roomType}</span>
                                            <span>{room.area} m²</span>
                                            <span>{room.bedrooms} bed · {room.bathrooms} bath</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border/50">
                                            <img src={room.owner.avatar} alt={room.owner.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-xs text-text-muted">by {room.owner.name}</span>
                                            <span className="ml-auto text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                View Details <ExternalLink size={11} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </FadeSection>
                    ))}
                </div>

                {otherRooms.length > 3 && !showAll && (
                    <FadeSection delay={0.3}>
                        <div className="text-center mt-8">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowAll(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 text-primary font-semibold text-sm cursor-pointer border-0 hover:bg-primary/20 transition-colors"
                            >
                                <Search size={16} />
                                Show More Listings
                            </motion.button>
                        </div>
                    </FadeSection>
                )}
            </div>
        </section>
    );
}

/* ─── CTA for Landlord ─── */
function LandlordCTA() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="animated-gradient rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-family-heading)]">
                                Maximize your rental efficiency
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                Upgrade to Premium for priority listing display and more rental requests.
                            </p>
                            <Link to="/premium">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                                >
                                    <Star size={18} />
                                    Upgrade Now
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </FadeSection>
            </div>
        </section>
    );
}

/* ─── Landlord Home Page ─── */
export default function LandlordHomePage() {
    return (
        <div>
            <LandlordHero />
            <MyRoomsSection />
            <BrowseOtherRooms />
            <TenantRequestsSection />
            <QuickActions />
            <LandlordCTA />
        </div>
    );
}
