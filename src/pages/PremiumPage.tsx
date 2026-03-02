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
                    { id: "student" as Role, label: "Sinh viên", icon: GraduationCap, desc: "Tìm bạn cùng phòng" },
                    { id: "landlord" as Role, label: "Chủ trọ", icon: Building2, desc: "Quản lý phòng trọ" },
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
                        {isStudent ? "Gói Sinh viên" : "Gói Chủ trọ"}
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                        {isStudent ? (
                            <>
                                Tìm bạn cùng phòng{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    hoàn hảo.
                                </span>
                            </>
                        ) : (
                            <>
                                Tiếp cận sinh viên{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    nhanh hơn.
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="mt-6 text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                        {isStudent
                            ? <>Mở khóa tính năng tìm bạn cùng phòng — nhắn tin trực tiếp, gợi ý AI thông minh, kết nối <strong className="text-text">nhanh hơn 3 lần</strong>.</>
                            : <>Đẩy tin lên trang nhất, mở khóa liên hệ sinh viên — <strong className="text-text">tăng tỷ lệ lấp phòng</strong> hiệu quả.</>
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
                                { icon: Bot, label: "AI Gợi ý thông minh", color: "text-accent" },
                                { icon: MessageCircle, label: "Nhắn tin không giới hạn", color: "text-secondary" },
                                { icon: Shield, label: "Hồ sơ xác minh", color: "text-primary" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <item.icon size={18} className={item.color} />
                                    <span className="text-sm text-text-light">{item.label}</span>
                                </div>
                            ))
                            : [
                                { icon: Megaphone, label: "Đẩy tin trang nhất", color: "text-gold" },
                                { icon: Unlock, label: "Mở khóa liên hệ", color: "text-accent" },
                                { icon: TrendingUp, label: "Tăng tỷ lệ tiếp cận", color: "text-primary" },
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
   SINH VIÊN — Pricing & Comparison
   ═══════════════════════════════════════════════════════════ */

function StudentComparison() {
    const features = [
        { name: "Tìm bạn cùng phòng", free: "Chỉ xem hồ sơ", premium: "Đầy đủ", icon: Users },
        { name: "Nhắn tin", free: false, premium: true, icon: MessageCircle },
        { name: "Gợi ý AI thông minh", free: false, premium: "Gói có AI", icon: Bot },
        { name: "Xem chi tiết lối sống", free: "Cơ bản", premium: "Đầy đủ", icon: Heart },
        { name: "Ai đã xem hồ sơ bạn", free: false, premium: true, icon: Eye },
        { name: "Đẩy hồ sơ lên top", free: false, premium: true, icon: TrendingUp },
        { name: "Bộ lọc nâng cao", free: false, premium: true, icon: Sparkles },
        { name: "Badge xác minh", free: false, premium: true, icon: Shield },
    ];

    return (
        <section className="py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Miễn phí vs <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Trả phí</span>
                    </h2>
                    <p className="mt-3 text-text-light">Xem bạn đang bỏ lỡ gì</p>
                </FadeSection>

                <FadeSection delay={0.1}>
                    <div className="premium-glass rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 text-center py-4 border-b border-white/20">
                            <div className="text-sm font-semibold text-text">Tính năng</div>
                            <div className="text-sm font-semibold text-text-muted">Miễn phí</div>
                            <div className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Trả phí</div>
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
            name: "1 Tuần",
            subtitle: "Không AI",
            price: 49000,
            duration: "7 ngày",
            contacts: 15,
            hasAI: false,
            badge: null,
            popular: false,
        },
        {
            id: "1w-ai",
            name: "1 Tuần + AI",
            subtitle: "Có AI gợi ý",
            price: 69000,
            duration: "7 ngày",
            contacts: 15,
            hasAI: true,
            badge: null,
            popular: false,
        },
        {
            id: "1m-noai",
            name: "1 Tháng",
            subtitle: "Không AI",
            price: 149000,
            duration: "30 ngày",
            contacts: 60,
            hasAI: false,
            badge: "Phổ biến nhất",
            popular: true,
        },
        {
            id: "1m-ai",
            name: "1 Tháng + AI",
            subtitle: "Có AI gợi ý",
            price: 169000,
            duration: "30 ngày",
            contacts: 60,
            hasAI: true,
            badge: "Đáng giá nhất",
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
                        Dành cho Sinh viên
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Mở khóa tính năng{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tìm bạn cùng phòng</span>
                    </h2>
                    <p className="mt-3 text-text-light">Nhắn tin, kết nối, tìm người phù hợp nhất</p>
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
                                        <span className="text-text-muted text-sm">đ</span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">{plan.duration}</p>
                                </div>

                                <div className="space-y-2.5 mt-5 mb-5 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Send size={14} className="text-secondary flex-shrink-0" />
                                        Nhắn tin tới <strong className="text-text">{plan.contacts} người</strong>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Users size={14} className="text-secondary flex-shrink-0" />
                                        Xem hồ sơ đầy đủ
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Sparkles size={14} className="text-secondary flex-shrink-0" />
                                        Bộ lọc nâng cao
                                    </div>
                                    {plan.hasAI ? (
                                        <div className="flex items-center gap-2 text-sm text-text">
                                            <Bot size={14} className="text-accent flex-shrink-0" />
                                            <span className="font-medium">AI gợi ý bạn cùng phòng</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-text-muted/50">
                                            <Bot size={14} className="flex-shrink-0" />
                                            <span className="line-through">AI gợi ý</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Eye size={14} className="text-secondary flex-shrink-0" />
                                        Xem ai đã xem hồ sơ
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
                                    Mua ngay
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
   CHỦ TRỌ — Pricing sections
   ═══════════════════════════════════════════════════════════ */

function LandlordBoostPricing() {
    const plans = [
        {
            id: "single",
            name: "Đẩy 1 tin",
            price: 19000,
            unit: "/tin",
            duration: "24 giờ hiển thị trang nhất",
            badge: null,
            popular: false,
            features: [
                "Tin nổi bật trang nhất 24h",
                "Badge \"Đang đẩy\" nổi bật",
                "Tăng lượt xem gấp 5x",
            ],
        },
        {
            id: "bundle",
            name: "Gói 10 tin",
            price: 149000,
            unit: "/gói",
            duration: "10 tin × 24 giờ mỗi tin",
            badge: "Tiết kiệm 21%",
            popular: true,
            features: [
                "10 lượt đẩy tin (dùng dần)",
                "Mỗi tin hiển thị trang nhất 24h",
                "Badge \"Đang đẩy\" nổi bật",
                "Tăng lượt xem gấp 5x",
                "Chỉ ~14,900đ/tin",
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
                        Đẩy tin & Giữ trang nhất
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Đẩy tin lên{" "}
                        <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">trang nhất</span>
                    </h2>
                    <p className="mt-3 text-text-light">Tin của bạn sẽ hiển thị ưu tiên, nổi bật hơn trong 24 giờ</p>
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
                                        <span className="text-text-muted text-sm">đ{plan.unit}</span>
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
                                    Mua ngay
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
            name: "Miễn phí",
            price: 0,
            contacts: 3,
            badge: null,
            popular: false,
            perContact: "Miễn phí",
        },
        {
            id: "30",
            name: "30 Liên hệ",
            price: 99000,
            contacts: 30,
            badge: "Phổ biến nhất",
            popular: true,
            perContact: "~3,300đ/liên hệ",
        },
        {
            id: "100",
            name: "100 Liên hệ",
            price: 249000,
            contacts: 100,
            badge: "Tiết kiệm nhất",
            popular: false,
            perContact: "~2,490đ/liên hệ",
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
                        Mở khóa liên hệ Sinh viên
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Mở khóa{" "}
                        <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">liên hệ sinh viên</span>
                    </h2>
                    <p className="mt-3 text-text-light">Xem số điện thoại, email để liên hệ trực tiếp với sinh viên</p>
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
                                            <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">0đ</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                                    {new Intl.NumberFormat("vi-VN").format(plan.price)}
                                                </span>
                                                <span className="text-text-muted text-sm">đ</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">{plan.perContact}</p>
                                </div>

                                <div className="space-y-2.5 mt-5 mb-5 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Check size={16} className="text-secondary flex-shrink-0" />
                                        Mở khóa <strong className="text-text">{plan.contacts} liên hệ</strong> sinh viên
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Check size={16} className="text-secondary flex-shrink-0" />
                                        Xem SĐT, email đầy đủ
                                    </div>
                                    {plan.price > 0 && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-text-light">
                                                <Check size={16} className="text-secondary flex-shrink-0" />
                                                Liên hệ không hết hạn
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-text-light">
                                                <Check size={16} className="text-secondary flex-shrink-0" />
                                                Ưu tiên hiển thị phòng
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
                                    {plan.id === "free" ? "Đang sử dụng" : "Nâng cấp"}
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
            role: "Sinh viên CNTT",
            text: "Gói 1 tháng + AI giúp mình tìm được bạn ở ghép chỉ trong 2 ngày. AI gợi ý cực chuẩn!",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhT",
            rating: 5,
        },
        {
            name: "Linh N.",
            role: "Sinh viên Kinh tế",
            text: "Chỉ 49k mà nhắn tin được 15 người, tìm được bạn cùng phòng hợp tính cách lắm.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LinhN",
            rating: 5,
        },
        {
            name: "Hana K.",
            role: "Sinh viên Ngoại ngữ",
            text: "Mình dùng gói có AI, nó gợi ý 3 bạn phù hợp nhất, mình chọn được người ưng rồi!",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=HanaK",
            rating: 5,
        },
    ];

    const landlordReviews = [
        {
            name: "Anh Tuấn",
            role: "Chủ trọ Q. Ngũ Hành Sơn",
            text: "Đẩy tin 24h mà có ngay 5 sinh viên liên hệ. Gói 10 tin tiết kiệm hơn nhiều so với lẻ.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnhTuan",
            rating: 5,
        },
        {
            name: "Chị Hoa",
            role: "Chủ trọ Hải Châu",
            text: "Gói 30 liên hệ quá đáng giá, chỉ 99k mà liên hệ được nhiều sinh viên, lấp phòng nhanh.",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ChiHoa",
            rating: 5,
        },
        {
            name: "Anh Đức",
            role: "Chủ trọ Thanh Khê",
            text: "Phòng trọ của mình luôn đầy nhờ đẩy tin trang nhất. Rất đáng đầu tư.",
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
                        {role === "student" ? "Sinh viên" : "Chủ trọ"} <span className="text-secondary">nói gì?</span>
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
        { q: "Tôi có thể hủy gói bất cứ lúc nào không?", a: "Gói của bạn sẽ hoạt động đến khi hết thời hạn (7 ngày hoặc 30 ngày). Không có gia hạn tự động." },
        { q: "Khác biệt giữa gói có AI và không AI?", a: "Gói có AI sẽ sử dụng thuật toán AI để phân tích lối sống, sở thích và đề xuất những bạn cùng phòng phù hợp nhất. Gói không AI bạn tự tìm kiếm và nhắn tin." },
        { q: "15 người / 60 người nghĩa là gì?", a: "Đó là số người bạn có thể nhắn tin liên hệ trong gói. Ví dụ gói 1 tuần cho phép nhắn tin tới 15 người khác nhau." },
        { q: "Phương thức thanh toán nào được chấp nhận?", a: "Chúng tôi chấp nhận MoMo, ZaloPay, thẻ ngân hàng nội địa và chuyển khoản." },
    ];

    const landlordFaqs = [
        { q: "Đẩy tin 24 giờ hoạt động như thế nào?", a: "Khi đẩy tin, bài đăng phòng của bạn sẽ hiển thị ưu tiên ở trang nhất trong 24 giờ, kèm badge \"Đang đẩy\" nổi bật, tăng lượt xem gấp 5 lần." },
        { q: "Gói 10 tin có thể dùng dần không?", a: "Có! Bạn mua gói 10 tin và sử dụng dần. Mỗi khi đẩy 1 tin sẽ trừ 1 lượt. Lượt đẩy không có thời hạn sử dụng." },
        { q: "Mở khóa liên hệ sinh viên là gì?", a: "Thông tin liên hệ (SĐT, email) của sinh viên sẽ bị ẩn. Bạn cần mở khóa để xem. Gói miễn phí cho xem 3 liên hệ, muốn nhiều hơn cần nâng cấp." },
        { q: "Liên hệ đã mở có hết hạn không?", a: "Không. Khi bạn đã mở khóa liên hệ của một sinh viên, bạn sẽ xem được vĩnh viễn." },
    ];

    const faqs = role === "student" ? studentFaqs : landlordFaqs;

    return (
        <section className="py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Câu hỏi <span className="text-primary">thường gặp</span>
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
                                {role === "student" ? "Sẵn sàng tìm bạn cùng phòng?" : "Sẵn sàng lấp phòng trống?"}
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                {role === "student"
                                    ? "Hàng ngàn sinh viên đã tìm được bạn cùng phòng lý tưởng. Đến lượt bạn!"
                                    : "Đẩy tin, mở khóa liên hệ — lấp đầy phòng trống nhanh chóng."
                                }
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-glow premium-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                            >
                                <Sparkles size={18} />
                                {role === "student" ? "Mua gói ngay" : "Nâng cấp ngay"}
                            </motion.button>
                            <p className="text-white/50 text-xs mt-4">
                                {role === "student" ? "Không gia hạn tự động · Thanh toán 1 lần" : "Lượt đẩy tin không hết hạn · Liên hệ mở vĩnh viễn"}
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
        <div className="min-h-screen pt-16">
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
