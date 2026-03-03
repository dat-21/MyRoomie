import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Crown,
    Eye,
    Heart,
    MessageCircle,
    Zap,
    Star,
    Check,
    X as XIcon,
    ArrowRight,
    Sparkles,
    Shield,
    TrendingUp,
    Building2,
    GraduationCap,
    Megaphone,
    Users,
    Unlock,
    Bot,
    Send,
    Clock,
} from "lucide-react";
import { useInView } from "../hooks/useInView";

type Role = "student" | "landlord";

/* ─── FadeSection ─── */
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

/* ─── Role Tabs ─── */
function RoleTabs({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
    return (
        <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-2xl p-1.5 glass-strong">
                {[
                    { id: "student" as Role, label: "Student", icon: GraduationCap, desc: "Find roommates" },
                    { id: "landlord" as Role, label: "Landlord", icon: Building2, desc: "Manage rentals" },
                ].map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setRole(tab.id)}
                        whileTap={{ scale: 0.97 }}
                        className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all duration-300 ${role === tab.id
                            ? "text-white shadow-lg"
                            : "text-text-light hover:text-text bg-transparent"
                            }`}
                    >
                        {role === tab.id && (
                            <motion.div
                                layoutId="roleTabBg"
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                            <span className={`hidden sm:inline text-xs ${role === tab.id ? "text-white/70" : "text-text-muted"}`}>— {tab.desc}</span>
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

/* ─── Hero ─── */
function PremiumHero({ role }: { role: Role }) {
    const isStudent = role === "student";

    return (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
            {/* Gradient blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-primary-dark/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-secondary/20 to-primary-300/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3.5s" }} />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
                    >
                        <Crown size={16} className="text-accent" />
                        {isStudent ? "Student Plan" : "Landlord Plan"}
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                        {isStudent ? (
                            <>
                                Find your{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    perfect roommate.
                                </span>
                            </>
                        ) : (
                            <>
                                Reach students{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    faster.
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="mt-6 text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                        {isStudent
                            ? <>Unlock roommate-finding features — direct messaging, smart AI suggestions, connect <strong className="text-text">3x faster</strong>.</>
                            : <>Boost your listing to the top, unlock student contacts — <strong className="text-text">increase occupancy rate</strong> effectively.</>
                        }
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10"
                    >
                        {isStudent
                            ? [
                                { icon: Bot, label: "Smart AI Suggestions", color: "text-accent" },
                                { icon: MessageCircle, label: "Unlimited Messaging", color: "text-secondary" },
                                { icon: Shield, label: "Verified Profile", color: "text-primary" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <item.icon size={18} className={item.color} />
                                    <span className="text-sm text-text-light">{item.label}</span>
                                </div>
                            ))
                            : [
                                { icon: Megaphone, label: "Boost to Front Page", color: "text-gold" },
                                { icon: Unlock, label: "Unlock Contacts", color: "text-accent" },
                                { icon: TrendingUp, label: "Increase Reach", color: "text-primary" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <item.icon size={18} className={item.color} />
                                    <span className="text-sm text-text-light">{item.label}</span>
                                </div>
                            ))
                        }
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   STUDENT — Pricing & Comparison
   ═══════════════════════════════════════════════════════════ */

function StudentComparison() {
    const features = [
        { name: "Find Roommates", free: "View profiles only", premium: "Full access", icon: Users },
        { name: "Messaging", free: false, premium: true, icon: MessageCircle },
        { name: "Smart AI Suggestions", free: false, premium: "AI plans only", icon: Bot },
        { name: "Lifestyle Details", free: "Basic", premium: "Full", icon: Heart },
        { name: "Who Viewed Your Profile", free: false, premium: true, icon: Eye },
        { name: "Boost Profile to Top", free: false, premium: true, icon: TrendingUp },
        { name: "Advanced Filters", free: false, premium: true, icon: Sparkles },
        { name: "Verified Badge", free: false, premium: true, icon: Shield },
    ];

    return (
        <section className="py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Free vs <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium</span>
                    </h2>
                    <p className="mt-3 text-text-light">See what you're missing</p>
                </FadeSection>

                <FadeSection delay={0.1}>
                    <div className="premium-glass rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 text-center py-4 border-b border-white/20">
                            <div className="text-sm font-semibold text-text">Feature</div>
                            <div className="text-sm font-semibold text-text-muted">Free</div>
                            <div className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium</div>
                        </div>
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={f.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-3 items-center py-4 px-4 border-b border-white/10 last:border-0 hover:bg-primary/5 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon size={16} className="text-primary flex-shrink-0" />
                                        <span className="text-sm text-text">{f.name}</span>
                                    </div>
                                    <div className="text-center">
                                        {typeof f.free === "string" ? (
                                            <span className="text-xs text-text-muted">{f.free}</span>
                                        ) : f.free ? (
                                            <Check size={18} className="text-secondary mx-auto" />
                                        ) : (
                                            <XIcon size={18} className="text-text-muted/40 mx-auto" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        {typeof f.premium === "string" ? (
                                            <span className="text-xs font-medium text-secondary">{f.premium}</span>
                                        ) : (
                                            <Check size={18} className="text-secondary mx-auto" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </FadeSection>
            </div>
        </section>
    );
}

function StudentPricing() {
    const plans = [
        {
            id: "1w-noai",
            name: "1 Week",
            subtitle: "No AI",
            price: 49000,
            duration: "7 days",
            contacts: 15,
            hasAI: false,
            badge: null,
            popular: false,
        },
        {
            id: "1w-ai",
            name: "1 Week + AI",
            subtitle: "With AI suggestions",
            price: 69000,
            duration: "7 days",
            contacts: 15,
            hasAI: true,
            badge: null,
            popular: false,
        },
        {
            id: "1m-noai",
            name: "1 Month",
            subtitle: "No AI",
            price: 149000,
            duration: "30 days",
            contacts: 60,
            hasAI: false,
            badge: "Most Popular",
            popular: true,
        },
        {
            id: "1m-ai",
            name: "1 Month + AI",
            subtitle: "With AI suggestions",
            price: 169000,
            duration: "30 days",
            contacts: 60,
            hasAI: true,
            badge: "Best Value",
            popular: false,
        },
    ];

    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-dark text-xs font-medium mb-4 border border-primary-100">
                        <GraduationCap size={14} />
                        For Students
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Unlock{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Roommate Finder</span>
                    </h2>
                    <p className="mt-3 text-text-light">Message, connect, and find your best match</p>
                </FadeSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                    {plans.map((plan, i) => (
                        <FadeSection key={plan.id} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className={`relative rounded-3xl p-5 transition-all duration-300 h-full flex flex-col ${plan.popular
                                    ? "premium-glass border-2 border-primary/30 shadow-xl shadow-primary/10 sm:scale-105 z-10"
                                    : "glass hover:shadow-lg"
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="text-center pt-2">
                                    <h3 className="text-base font-semibold text-text font-[family-name:var(--font-family-heading)]">{plan.name}</h3>
                                    <p className="text-xs text-text-muted mt-0.5">{plan.subtitle}</p>
                                    <div className="mt-4">
                                        <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                            {new Intl.NumberFormat("vi-VN").format(plan.price)}
                                        </span>
                                        <span className="text-text-muted text-sm"> VND</span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">{plan.duration}</p>
                                </div>

                                <div className="space-y-2.5 mt-5 mb-5 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Send size={14} className="text-secondary flex-shrink-0" />
                                        Message up to <strong className="text-text">{plan.contacts} people</strong>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Users size={14} className="text-secondary flex-shrink-0" />
                                        View full profiles
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Sparkles size={14} className="text-secondary flex-shrink-0" />
                                        Advanced filters
                                    </div>
                                    {plan.hasAI ? (
                                        <div className="flex items-center gap-2 text-sm text-text">
                                            <Bot size={14} className="text-accent flex-shrink-0" />
                                            <span className="font-medium">AI roommate suggestions</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-text-muted/50">
                                            <Bot size={14} className="flex-shrink-0" />
                                            <span className="line-through">AI suggestions</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Eye size={14} className="text-secondary flex-shrink-0" />
                                        See who viewed your profile
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3 rounded-2xl font-semibold text-sm cursor-pointer border-0 transition-all ${plan.popular
                                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 btn-glow premium-glow"
                                        : "bg-primary/10 text-primary hover:bg-primary/20"
                                        }`}
                                >
                                    Buy Now
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════
   LANDLORD — Pricing sections
   ═══════════════════════════════════════════════════════════ */

function LandlordBoostPricing() {
    const plans = [
        {
            id: "single",
            name: "Boost 1 Listing",
            price: 19000,
            unit: "/listing",
            duration: "24-hour front page visibility",
            badge: null,
            popular: false,
            features: [
                "Featured on front page for 24h",
                "\"Boosted\" badge highlight",
                "5x more views",
            ],
        },
        {
            id: "bundle",
            name: "10-Listing Bundle",
            price: 149000,
            unit: "/bundle",
            duration: "10 listings × 24h each",
            badge: "Save 21%",
            popular: true,
            features: [
                "10 boost credits (use anytime)",
                "Each listing featured for 24h",
                "\"Boosted\" badge highlight",
                "5x more views",
                "Only ~14,900 VND/listing",
            ],
        },
    ];

    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-gold-light/15 to-gold/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark text-xs font-medium mb-4 border border-gold-light/30">
                        <Megaphone size={14} />
                        Boost & Stay on Top
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Boost your listing to the{" "}
                        <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">front page</span>
                    </h2>
                    <p className="mt-3 text-text-light">Your listing will be prioritized and highlighted for 24 hours</p>
                </FadeSection>

                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
                    {plans.map((plan, i) => (
                        <FadeSection key={plan.id} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className={`relative rounded-3xl p-6 transition-all duration-300 h-full flex flex-col ${plan.popular
                                    ? "premium-glass border-2 border-gold/30 shadow-xl shadow-gold/10"
                                    : "glass hover:shadow-lg"
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gold to-gold-dark text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="text-center pt-2">
                                    <Megaphone size={24} className="mx-auto text-gold mb-2" />
                                    <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">{plan.name}</h3>
                                    <div className="mt-3">
                                        <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                            {new Intl.NumberFormat("vi-VN").format(plan.price)}
                                        </span>
                                        <span className="text-text-muted text-sm"> VND{plan.unit}</span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1.5 flex items-center justify-center gap-1">
                                        <Clock size={12} /> {plan.duration}
                                    </p>
                                </div>

                                <div className="space-y-2.5 mt-5 mb-5 flex-1">
                                    {plan.features.map((f) => (
                                        <div key={f} className="flex items-start gap-2 text-sm text-text-light">
                                            <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3 rounded-2xl font-semibold text-sm cursor-pointer border-0 transition-all ${plan.popular
                                        ? "bg-gradient-to-r from-gold to-gold-dark text-white shadow-lg shadow-gold/25 hover:shadow-xl btn-glow"
                                        : "bg-gold/10 text-gold-dark hover:bg-gold/20"
                                        }`}
                                >
                                    Buy Now
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LandlordContactPricing() {
    const plans = [
        {
            id: "free",
            name: "Free",
            price: 0,
            contacts: 3,
            badge: null,
            popular: false,
            perContact: "Free",
        },
        {
            id: "30",
            name: "30 Contacts",
            price: 99000,
            contacts: 30,
            badge: "Most Popular",
            popular: true,
            perContact: "~3,300 VND/contact",
        },
        {
            id: "100",
            name: "100 Contacts",
            price: 249000,
            contacts: 100,
            badge: "Best Value",
            popular: false,
            perContact: "~2,490 VND/contact",
        },
    ];

    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-50 text-primary-dark text-xs font-medium mb-4 border border-secondary-100">
                        <Unlock size={14} />
                        Unlock Student Contacts
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Unlock{" "}
                        <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">student contacts</span>
                    </h2>
                    <p className="mt-3 text-text-light">View phone numbers and emails to contact students directly</p>
                </FadeSection>

                <div className="grid sm:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, i) => (
                        <FadeSection key={plan.id} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className={`relative rounded-3xl p-6 transition-all duration-300 h-full flex flex-col ${plan.popular
                                    ? "premium-glass border-2 border-secondary/30 shadow-xl shadow-secondary/10 sm:scale-105 z-10"
                                    : "glass hover:shadow-lg"
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-secondary to-primary text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="text-center pt-2">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 ${plan.id === "free" ? "bg-gray-100" : "bg-gradient-to-br from-secondary/20 to-primary/20"}`}>
                                        <Users size={22} className={plan.id === "free" ? "text-text-muted" : "text-secondary"} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">{plan.name}</h3>
                                    <div className="mt-3">
                                        {plan.price === 0 ? (
                                            <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">0 VND</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                                    {new Intl.NumberFormat("vi-VN").format(plan.price)}
                                                </span>
                                                <span className="text-text-muted text-sm"> VND</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">{plan.perContact}</p>
                                </div>

                                <div className="space-y-2.5 mt-5 mb-5 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Check size={16} className="text-secondary flex-shrink-0" />
                                        Unlock <strong className="text-text">{plan.contacts} student</strong> contacts
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Check size={16} className="text-secondary flex-shrink-0" />
                                        View full phone & email
                                    </div>
                                    {plan.price > 0 && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-text-light">
                                                <Check size={16} className="text-secondary flex-shrink-0" />
                                                Contacts never expire
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-text-light">
                                                <Check size={16} className="text-secondary flex-shrink-0" />
                                                Priority listing display
                                            </div>
                                        </>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3 rounded-2xl font-semibold text-sm cursor-pointer border-0 transition-all ${plan.popular
                                        ? "bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25 hover:shadow-xl btn-glow"
                                        : plan.id === "free"
                                            ? "bg-gray-100 text-text-light hover:bg-gray-200"
                                            : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                                        }`}
                                >
                                    {plan.id === "free" ? "Current Plan" : "Upgrade"}
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Testimonials ─── */
function Testimonials({ role }: { role: Role }) {
    const studentReviews = [
        {
            name: "Minh T.",
            role: "IT Student",
            text: "The 1-month + AI plan helped me find a roommate in just 2 days. The AI suggestions were spot on!",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhT",
            rating: 5,
        },
        {
            name: "Linh N.",
            role: "Business Student",
            text: "Only 49k and I could message 15 people. Found a roommate with a perfectly matching personality.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LinhN",
            rating: 5,
        },
        {
            name: "Hana K.",
            role: "Language Student",
            text: "I used the AI plan — it suggested 3 best matches, and I found the perfect roommate!",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=HanaK",
            rating: 5,
        },
    ];

    const landlordReviews = [
        {
            name: "Tuan A.",
            role: "Landlord, Ngu Hanh Son",
            text: "Boosted for 24h and got 5 student inquiries right away. The 10-listing bundle saves so much more.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnhTuan",
            rating: 5,
        },
        {
            name: "Hoa N.",
            role: "Landlord, Hai Chau",
            text: "The 30-contact pack is amazing value — only 99k and I could reach so many students. Rooms filled fast.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ChiHoa",
            rating: 5,
        },
        {
            name: "Duc T.",
            role: "Landlord, Thanh Khe",
            text: "My rooms are always full thanks to front-page boosting. Totally worth the investment.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnhDuc",
            rating: 5,
        },
    ];

    const reviews = role === "student" ? studentReviews : landlordReviews;

    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        What {role === "student" ? "students" : "landlords"} <span className="text-secondary">say</span>
                    </h2>
                </FadeSection>

                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <FadeSection key={review.name} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="glass rounded-2xl p-6 h-full"
                            >
                                <div className="flex gap-1 mb-3">
                                    {Array(review.rating).fill(0).map((_, j) => (
                                        <Star key={j} size={14} className="text-gold fill-gold" />
                                    ))}
                                </div>
                                <p className="text-sm text-text-light leading-relaxed mb-4">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img src={review.avatar} alt={review.name} className="w-9 h-9 rounded-full bg-primary/10" />
                                    <div>
                                        <div className="text-sm font-semibold text-text">{review.name}</div>
                                        <div className="text-xs text-text-muted">{review.role}</div>
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

/* ─── FAQ ─── */
function FAQ({ role }: { role: Role }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const studentFaqs = [
        { q: "Can I cancel my plan at any time?", a: "Your plan remains active until it expires (7 days or 30 days). There is no auto-renewal." },
        { q: "What's the difference between AI and non-AI plans?", a: "AI plans use an AI algorithm to analyze lifestyle and preferences, then suggest the most compatible roommates. Non-AI plans let you search and message on your own." },
        { q: "What does 15 people / 60 people mean?", a: "That's the number of people you can message during your plan. For example, the 1-week plan allows messaging up to 15 different people." },
        { q: "What payment methods are accepted?", a: "We accept MoMo, ZaloPay, domestic bank cards, and bank transfers." },
    ];

    const landlordFaqs = [
        { q: "How does the 24-hour boost work?", a: "When you boost a listing, it will be displayed as a priority on the front page for 24 hours, with a \"Boosted\" badge, increasing views by up to 5x." },
        { q: "Can I use the 10-listing bundle gradually?", a: "Yes! You purchase the 10-listing bundle and use credits over time. Each boost deducts 1 credit. Credits never expire." },
        { q: "What does unlocking student contacts mean?", a: "Student contact info (phone, email) is hidden by default. You need to unlock it to view. The free plan includes 3 contacts — upgrade for more." },
        { q: "Do unlocked contacts expire?", a: "No. Once you unlock a student's contact info, you can view it permanently." },
    ];

    const faqs = role === "student" ? studentFaqs : landlordFaqs;

    return (
        <section className="py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                </FadeSection>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FadeSection key={i} delay={i * 0.05}>
                            <motion.div className="glass rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer border-0 bg-transparent"
                                >
                                    <span className="text-sm font-medium text-text">{faq.q}</span>
                                    <motion.span
                                        animate={{ rotate: openIndex === i ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-text-muted"
                                    >
                                        <ArrowRight size={16} className="rotate-90" />
                                    </motion.span>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-4 text-sm text-text-light leading-relaxed">{faq.a}</p>
                                </motion.div>
                            </motion.div>
                        </FadeSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Bottom CTA ─── */
function BottomCTA({ role }: { role: Role }) {
    return (
        <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
                        <div className="absolute inset-0 bg-black/10" />

                        {/* Floating shapes */}
                        <div className="absolute top-8 left-8 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse" />
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-white/15 rounded-2xl rotate-45 animate-pulse" style={{ animationDelay: "1s" }} />
                        <div className="absolute top-1/2 left-12 w-8 h-8 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

                        <div className="relative z-10">
                            {role === "student"
                                ? <GraduationCap size={40} className="text-secondary-light mx-auto mb-4" />
                                : <Building2 size={40} className="text-secondary-light mx-auto mb-4" />
                            }
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-family-heading)]">
                                {role === "student" ? "Ready to find your roommate?" : "Ready to fill your vacancies?"}
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                {role === "student"
                                    ? "Thousands of students have found their ideal roommate. It's your turn!"
                                    : "Boost listings, unlock contacts — fill your rooms quickly."
                                }
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-glow premium-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                            >
                                <Sparkles size={18} />
                                {role === "student" ? "Get Started Now" : "Upgrade Now"}
                            </motion.button>
                            <p className="text-white/50 text-xs mt-4">
                                {role === "student" ? "No auto-renewal · One-time payment" : "Boost credits never expire · Contacts unlocked forever"}
                            </p>
                        </div>
                    </div>
                </FadeSection>
            </div>
        </section>
    );
}

/* ─── Premium Page ─── */
export default function PremiumPage() {
    const [role, setRole] = useState<Role>("student");

    return (
        <div className="min-h-screen pt-28">
            <PremiumHero role={role} />

            {/* Role Tabs */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <RoleTabs role={role} setRole={setRole} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                >
                    {role === "student" ? (
                        <>
                            <StudentComparison />
                            <StudentPricing />
                        </>
                    ) : (
                        <>
                            <LandlordBoostPricing />
                            <LandlordContactPricing />
                        </>
                    )}

                    <Testimonials role={role} />
                    <FAQ role={role} />
                    <BottomCTA role={role} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
