import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Search,
    PlusCircle,
    UserCheck,
    Heart,
    ShieldCheck,
    Sparkles,
    ArrowRight,
    Users,
    MessageCircle,
    Home,
    MapPin,
    Eye,
    ChevronRight,
    BadgeCheck,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import { roommates, rooms, formatCurrency } from "../data/mockData";
import type { RoomListing } from "../data/mockData";
import MatchCircle from "../components/MatchCircle";
import Modal from "../components/Modal";
import RoomDetailContent from "../components/RoomDetailContent";

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

/* ─── Nearby Room Item ─── */
function NearbyRoomItem({ room, onClick }: { room: RoomListing; onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-transparent hover:bg-primary/5 hover:shadow-md hover:border-primary/20 border border-transparent transition-all cursor-pointer text-left"
        >
            <img
                src={room.thumbnail}
                alt={room.title}
                className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text truncate">{room.title}</h4>
                <div className="flex items-center gap-1 text-text-muted mt-0.5">
                    <MapPin size={11} />
                    <span className="text-xs truncate">{room.district}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-text">{formatCurrency(room.rent)}<span className="text-text-muted font-normal">/mo</span></span>
                    <span className="text-[10px] text-text-muted">{room.distance}km away</span>
                </div>
            </div>
            <div className="flex-shrink-0">
                <MatchCircle value={room.matchScore} size="sm" />
            </div>
        </motion.button>
    );
}

/* ─── Match Profile Item ─── */
function MatchProfileItem({ roommate, index }: { roommate: typeof roommates[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:shadow-md border border-transparent hover:border-primary/20 transition-all"
        >
            <div className="relative flex-shrink-0">
                <img src={roommate.avatar} alt={roommate.name} className="w-11 h-11 rounded-xl object-cover bg-primary/10" />
                {roommate.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                        <BadgeCheck size={10} className="text-white" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-text truncate">{roommate.name}</span>
                    <span className="text-[10px] text-text-muted">{roommate.age}y</span>
                </div>
                <p className="text-xs text-text-muted truncate">{roommate.occupation}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {roommate.lifestyleTags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{tag}</span>
                    ))}
                    {roommate.lifestyleTags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-text-muted/10 text-text-muted text-[10px]">+{roommate.lifestyleTags.length - 3}</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <MatchCircle value={roommate.compatibility} size="sm" />
                <Link to={`/profile/${roommate.id}`} onClick={(e) => e.stopPropagation()}>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white text-[10px] font-medium cursor-pointer btn-glow"
                    >
                        <Eye size={10} /> View
                    </motion.span>
                </Link>
            </div>
        </motion.div>
    );
}

/* ─── Hero ─── */
function Hero() {
    const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);
    const topRooms = rooms.slice(0, 3);
    const topMatches = [...roommates].sort((a, b) => b.compatibility - a.compatibility).slice(0, 3);

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
            {/* Animated background blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="pt-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                        >
                            <Sparkles size={16} />
                            Lifestyle-based matching
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                            Find Your{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Perfect Roommate
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-text-light leading-relaxed max-w-lg">
                            My Roomie matches you with compatible roommates based on your lifestyle, habits, and preferences — not just budget. Feel safe, matched, and understood.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link to="/find">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-glow flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow cursor-pointer border-0 text-base"
                                >
                                    <Search size={18} />
                                    Find a Roommate
                                </motion.button>
                            </Link>

                            <Link to="/post">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/70 text-text font-semibold shadow-md hover:shadow-lg border border-white/40 backdrop-blur-sm transition-all cursor-pointer text-base"
                                >
                                    <PlusCircle size={18} className="text-secondary" />
                                    Post a Room Slot
                                </motion.button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-10">
                            {[
                                { value: "2.5K+", label: "Active Users" },
                                { value: "89%", label: "Match Rate" },
                                { value: "1.2K+", label: "Matches Made" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{stat.value}</div>
                                    <div className="text-xs text-text-muted">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — 2 Stacked Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hidden lg:flex flex-col gap-5"
                    >
                        {/* Card 1: Nearby Rooms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass rounded-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                <h3 className="text-base font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                    <Home size={16} className="text-primary" />
                                    Nearby Rooms
                                </h3>
                                <Link to="/rooms" className="text-xs text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-0.5 no-underline">
                                    View All <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="px-3 pb-4 space-y-1">
                                {topRooms.map((room) => (
                                    <NearbyRoomItem key={room.id} room={room} onClick={() => setSelectedRoom(room)} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Card 2: Best Matches */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="glass rounded-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                <h3 className="text-base font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                    <Users size={16} className="text-secondary" />
                                    Best Matches
                                </h3>
                                <Link to="/matches" className="text-xs text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-0.5 no-underline">
                                    View All <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="px-3 pb-4 space-y-0.5">
                                {topMatches.map((rm, i) => (
                                    <MatchProfileItem key={rm.id} roommate={rm} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Room Detail Modal */}
            <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} size="xl">
                {selectedRoom && <RoomDetailContent room={selectedRoom} />}
            </Modal>
        </section>
    );
}

/* ─── How It Works ─── */
function HowItWorks() {
    const steps = [
        {
            icon: UserCheck,
            title: "Create Your Profile",
            description: "Tell us about your lifestyle, habits, and what matters to you in a roommate.",
            color: "from-primary to-primary-light",
        },
        {
            icon: Heart,
            title: "Get Matched",
            description: "Our smart algorithm finds people whose lifestyle is most compatible with yours.",
            color: "from-secondary to-secondary-light",
        },
        {
            icon: MessageCircle,
            title: "Connect & Move In",
            description: "Chat with your matches, meet up, and find your new home together.",
            color: "from-accent to-accent-light",
        },
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="mt-4 text-text-light max-w-xl mx-auto">
                        Three simple steps to finding a roommate who truly fits your lifestyle.
                    </p>
                </FadeSection>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <FadeSection key={step.title} delay={i * 0.15}>
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="glass rounded-3xl p-8 text-center relative group"
                                >
                                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5 font-[family-name:var(--font-family-heading)]">
                                        {i + 1}
                                    </div>
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">{step.title}</h3>
                                    <p className="text-sm text-text-light leading-relaxed">{step.description}</p>
                                </motion.div>
                            </FadeSection>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ─── Features ─── */
function Features() {
    const features = [
        {
            icon: Heart,
            title: "Lifestyle-Based Matching",
            description: "We analyze sleep schedules, cleanliness habits, noise tolerance, and more to find your ideal match.",
        },
        {
            icon: ShieldCheck,
            title: "Verified Profiles",
            description: "Feel safe with our verification system. Know who you're connecting with before meeting.",
        },
        {
            icon: Sparkles,
            title: "Smart Suggestions",
            description: "Our algorithm learns your preferences and improves match quality over time.",
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Join a community of students and young professionals looking for compatible living situations.",
        },
        {
            icon: Home,
            title: "Room Slot Posting",
            description: "Have an empty room? Post it and let compatible roommates find you.",
        },
        {
            icon: MessageCircle,
            title: "Safe Communication",
            description: "Chat within the platform before sharing personal contact information.",
        },
    ];

    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Why Choose <span className="text-secondary">My Roomie</span>?
                    </h2>
                    <p className="mt-4 text-text-light max-w-xl mx-auto">
                        We're not a rental marketplace. We're a compatibility-driven roommate finder.
                    </p>
                </FadeSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <FadeSection key={f.title} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    className="glass rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon size={22} className="text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold text-text mb-2 font-[family-name:var(--font-family-heading)]">{f.title}</h3>
                                    <p className="text-sm text-text-light leading-relaxed">{f.description}</p>
                                </motion.div>
                            </FadeSection>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ─── CTA ─── */
function CTA() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="animated-gradient rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-family-heading)]">
                                Ready to Find Your Perfect Roommate?
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                Join thousands of students and young professionals who found their ideal living situation through My Roomie.
                            </p>
                            <Link to="/find">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                                >
                                    Get Started Now
                                    <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </FadeSection>
            </div>
        </section>
    );
}

/* ─── Landing Page ─── */
export default function LandingPage() {
    return (
        <div>
            <Hero />
            <HowItWorks />
            <Features />
            <CTA />
        </div>
    );
}
