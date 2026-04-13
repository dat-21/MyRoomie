import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import LandlordInteractivePricing from "../components/LandlordInteractivePricing";

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
    const { t } = useTranslation();
    return (
        <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-2xl p-1.5 glass-strong">
                {[
                    { id: "student" as Role, label: t('premiumPage.student'), icon: GraduationCap, desc: t('premiumPage.findRoommates') },
                    { id: "landlord" as Role, label: t('premiumPage.landlord'), icon: Building2, desc: t('premiumPage.manageRentals') },
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
    const { t } = useTranslation();
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
                        {isStudent ? t('premiumPage.studentPlan') : t('premiumPage.landlordPlan')}
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                        {isStudent ? (
                            <>
                                {t('premiumPage.heroTitleStudent1')}{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {t('premiumPage.heroTitleStudent2')}
                                </span>
                            </>
                        ) : (
                            <>
                                {t('premiumPage.heroTitleLandlord1')}{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {t('premiumPage.heroTitleLandlord2')}
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="mt-6 text-lg text-text-light leading-relaxed max-w-2xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: isStudent ? t('premiumPage.heroDescStudent') : t('premiumPage.heroDescLandlord') }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10"
                    >
                        {isStudent
                            ? [
                                { icon: Bot, label: t('premiumPage.smartAI'), color: "text-accent" },
                                { icon: MessageCircle, label: t('premiumPage.unlimitedMsg'), color: "text-secondary" },
                                { icon: Shield, label: t('premiumPage.verifiedProfile'), color: "text-primary" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <item.icon size={18} className={item.color} />
                                    <span className="text-sm text-text-light">{item.label}</span>
                                </div>
                            ))
                            : [
                                { icon: Megaphone, label: t('premiumPage.boostFrontPage'), color: "text-gold" },
                                { icon: Unlock, label: t('premiumPage.unlockContacts'), color: "text-accent" },
                                { icon: TrendingUp, label: t('premiumPage.increaseReach'), color: "text-primary" },
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
    const { t } = useTranslation();
    const features = [
        { name: t('premiumPage.featureFindRoommates'), free: t('premiumPage.viewProfilesOnly'), premium: t('premiumPage.fullAccess'), icon: Users },
        { name: t('premiumPage.messaging'), free: false, premium: true, icon: MessageCircle },
        { name: t('premiumPage.aiSuggestions'), free: false, premium: t('premiumPage.aiPlansOnly'), icon: Bot },
        { name: t('premiumPage.lifestyleDetails'), free: t('premiumPage.basic'), premium: t('premiumPage.full'), icon: Heart },
        { name: t('premiumPage.whoViewed'), free: false, premium: true, icon: Eye },
        { name: t('premiumPage.boostProfile'), free: false, premium: true, icon: TrendingUp },
        { name: t('premiumPage.advancedFilters'), free: false, premium: true, icon: Sparkles },
        { name: t('premiumPage.verifiedBadge'), free: false, premium: true, icon: Shield },
    ];

    return (
        <section className="py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        {t('premiumPage.freeVsPremium').split('Premium')[0]}<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium</span>
                    </h2>
                    <p className="mt-3 text-text-light">{t('premiumPage.seeWhatMissing')}</p>
                </FadeSection>

                <FadeSection delay={0.1}>
                    <div className="premium-glass rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 text-center py-4 border-b border-white/20">
                            <div className="text-sm font-semibold text-text">{t('premiumPage.feature')}</div>
                            <div className="text-sm font-semibold text-text-muted">{t('premiumPage.free')}</div>
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
    const { t } = useTranslation();
    const plans = [
        {
            id: "1w-noai",
            name: t('premiumPage.oneWeek'),
            subtitle: t('premiumPage.noAI'),
            price: 49000,
            duration: t('premiumPage.days7'),
            contacts: 15,
            hasAI: false,
            badge: null,
            popular: false,
        },
        {
            id: "1w-ai",
            name: t('premiumPage.oneWeekAI'),
            subtitle: t('premiumPage.withAI'),
            price: 69000,
            duration: t('premiumPage.days7'),
            contacts: 15,
            hasAI: true,
            badge: null,
            popular: false,
        },
        {
            id: "1m-noai",
            name: t('premiumPage.oneMonth'),
            subtitle: t('premiumPage.noAI'),
            price: 149000,
            duration: t('premiumPage.days30'),
            contacts: 60,
            hasAI: false,
            badge: t('premiumPage.mostPopular'),
            popular: true,
        },
        {
            id: "1m-ai",
            name: t('premiumPage.oneMonthAI'),
            subtitle: t('premiumPage.withAI'),
            price: 169000,
            duration: t('premiumPage.days30'),
            contacts: 60,
            hasAI: true,
            badge: t('premiumPage.bestValue'),
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
                        {t('premiumPage.forStudents')}
                    </div>
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        {t('premiumPage.unlockRoommateFinder').split(t('premiumPage.unlockRoommateFinder').split(' ').slice(2).join(' '))[0]}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('premiumPage.unlockRoommateFinder').split(' ').slice(2).join(' ')}</span>
                    </h2>
                    <p className="mt-3 text-text-light">{t('premiumPage.msgConnectFind')}</p>
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
                                        <span dangerouslySetInnerHTML={{ __html: t('premiumPage.messagePeople', { count: plan.contacts }) }} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Users size={14} className="text-secondary flex-shrink-0" />
                                        {t('premiumPage.viewFullProfiles')}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Sparkles size={14} className="text-secondary flex-shrink-0" />
                                        {t('premiumPage.advancedFilters')}
                                    </div>
                                    {plan.hasAI ? (
                                        <div className="flex items-center gap-2 text-sm text-text">
                                            <Bot size={14} className="text-accent flex-shrink-0" />
                                            <span className="font-medium">{t('premiumPage.aiRoommateSuggestions')}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-text-muted/50">
                                            <Bot size={14} className="flex-shrink-0" />
                                            <span className="line-through">{t('premiumPage.aiSuggestions')}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-text-light">
                                        <Eye size={14} className="text-secondary flex-shrink-0" />
                                        {t('premiumPage.seeWhoViewed')}
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
                                    {t('common.buyNow')}
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

function LandlordPricingBoard() {
    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark text-xs font-medium mb-4 border border-primary/20">
                        <Building2 size={14} />
                        Dành cho Chủ trọ
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Bảng Giá <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dịch Vụ Premium</span>
                    </h2>
                    <p className="mt-4 text-text-light max-w-2xl mx-auto text-lg">
                        Lựa chọn gói dịch vụ tối ưu để tăng hiệu quả tiếp cận sinh viên và cho thuê phòng nhanh chóng.
                    </p>
                </FadeSection>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* 1. Mở khóa liên hệ */}
                    <div className="flex flex-col gap-5">
                        <FadeSection>
                            <div className="text-center mb-2 flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 text-primary">
                                    <Unlock size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-text">Mở khóa liên hệ</h3>
                                <p className="text-sm text-text-muted mt-1">Lưu lượng tiếp cận sinh viên</p>
                            </div>
                        </FadeSection>

                        <FadeSection delay={0.1}>
                            <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all flex flex-col h-full relative overflow-hidden">
                                <h4 className="font-bold text-text text-lg">Gói 30 Liên hệ</h4>
                                <div className="mt-2 mb-4">
                                    <span className="text-3xl font-extrabold text-text">99.000</span>
                                    <span className="text-text-muted font-medium"> đ</span>
                                </div>
                                <ul className="space-y-2 mb-6 flex-1 text-sm text-text-light">
                                    <li className="flex gap-2"><Check size={16} className="text-primary flex-shrink-0 mt-0.5"/> 30 lượt xem thông tin sinh viên</li>
                                    <li className="flex gap-2"><Check size={16} className="text-primary flex-shrink-0 mt-0.5"/> Liên hệ không bao giờ hết hạn</li>
                                </ul>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border-0">
                                    Mua gói này
                                </motion.button>
                            </motion.div>
                        </FadeSection>

                        <FadeSection delay={0.2}>
                            <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-6 border-2 border-secondary/30 bg-gradient-to-b from-white to-secondary/5 hover:shadow-xl hover:shadow-secondary/10 transition-all flex flex-col h-full relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                                    🚀 85% chủ trọ đang mua gói này
                                </div>
                                <h4 className="font-bold text-text text-lg pt-2">Gói 100 Liên hệ</h4>
                                <div className="mt-2 mb-4">
                                    <span className="text-3xl font-extrabold text-text">249.000</span>
                                    <span className="text-text-muted font-medium"> đ</span>
                                </div>
                                <ul className="space-y-2 mb-6 flex-1 text-sm text-text-light">
                                    <li className="flex gap-2"><Check size={16} className="text-secondary flex-shrink-0 mt-0.5"/> 100 lượt xem thông tin sinh viên</li>
                                    <li className="flex gap-2"><Check size={16} className="text-secondary flex-shrink-0 mt-0.5"/> Giá siêu ưu đãi tiết kiệm</li>
                                </ul>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition-all btn-glow cursor-pointer border-0">
                                    Mua gói này
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    </div>

                    {/* 2. Tăng hiển thị tin đăng */}
                    <div className="flex flex-col gap-5">
                        <FadeSection>
                            <div className="text-center mb-2 flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 text-secondary">
                                    <TrendingUp size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-text">Tăng hiển thị</h3>
                                <p className="text-sm text-text-muted mt-1">Đẩy tin nổi bật trên trang chủ</p>
                                <div className="text-[11px] text-primary-dark font-semibold px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mt-2 inline-block">Chỉ dành cho chủ trọ chưa có Gold</div>
                            </div>
                        </FadeSection>

                        <FadeSection delay={0.1}>
                            <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all flex flex-col h-full">
                                <h4 className="font-bold text-text text-lg">Gói Thường (1 Tin)</h4>
                                <div className="mt-2 mb-4">
                                    <span className="text-3xl font-extrabold text-text">19.000</span>
                                    <span className="text-text-muted font-medium"> đ</span>
                                    <span className="text-text-muted text-xs"> /24h</span>
                                </div>
                                <ul className="space-y-2 mb-6 flex-1 text-sm text-text-light">
                                    <li className="flex gap-2"><Check size={16} className="text-primary flex-shrink-0 mt-0.5"/> Đẩy 1 tin lên bảng xếp hạng</li>
                                    <li className="flex gap-2"><Check size={16} className="text-primary flex-shrink-0 mt-0.5"/> Thu hút gấp 3 lần lượt xem</li>
                                </ul>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border-0">
                                    Mua gói này
                                </motion.button>
                            </motion.div>
                        </FadeSection>

                        <FadeSection delay={0.2}>
                            <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-6 border-2 border-secondary/30 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/10 transition-all flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-secondary/10 text-secondary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Tiết kiệm 20%</div>
                                <h4 className="font-bold text-text text-lg">Gói Cao Cấp (10 Tin)</h4>
                                <div className="mt-2 mb-4">
                                    <span className="text-3xl font-extrabold text-text">149.000</span>
                                    <span className="text-text-muted font-medium"> đ</span>
                                </div>
                                <ul className="space-y-2 mb-6 flex-1 text-sm text-text-light">
                                    <li className="flex gap-2"><Check size={16} className="text-secondary flex-shrink-0 mt-0.5"/> 10 lượt đẩy tin 24h tùy chọn</li>
                                    <li className="flex gap-2"><Check size={16} className="text-secondary flex-shrink-0 mt-0.5"/> Huy hiệu "Tin đẩy" nổi bật</li>
                                </ul>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border-0">
                                    Mua gói này
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    </div>

                    {/* 3. Gói Gold Subscription */}
                    <div className="flex flex-col gap-5 lg:pl-4">
                        <FadeSection>
                            <div className="text-center mb-2 flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-4 text-white shadow-lg shadow-amber-500/30">
                                    <Crown size={26} />
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">Gold Subscription</h3>
                                <p className="text-sm text-text-muted mt-1">Giải pháp tất cả trong một</p>
                            </div>
                        </FadeSection>

                        <FadeSection delay={0.1} className="flex-1">
                            <motion.div whileHover={{ y: -8 }} className="premium-glass rounded-3xl p-8 border-2 border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/20 bg-gradient-to-b from-amber-50/50 to-white transition-all flex flex-col h-full relative overflow-visible z-10 scale-100 sm:scale-105 mt-2 lg:mt-6">
                                {/* BEST CHOICE Badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black tracking-widest shadow-lg shadow-amber-500/40 flex items-center gap-1.5 border border-white/20">
                                        <Star size={12} className="fill-white" /> BEST CHOICE
                                    </span>
                                </div>

                                <div className="text-center pt-2 mb-6">
                                    <div className="flex justify-center items-end gap-1">
                                        <span className="text-4xl lg:text-5xl font-extrabold text-amber-600">699.000</span>
                                        <span className="text-amber-700/70 font-semibold mb-1">đ/<span className="text-sm">tháng</span></span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1 text-base text-text-light font-medium">
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-amber-100 text-amber-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check size={16} className="stroke-[3]"/></div>
                                        <span><strong className="text-amber-700">Không giới hạn</strong> mở khóa liên hệ sinh viên</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-amber-100 text-amber-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check size={16} className="stroke-[3]"/></div>
                                        <span><strong className="text-amber-700">10 lượt đẩy tin</strong> tự động mỗi tháng</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-amber-100 text-amber-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check size={16} className="stroke-[3]"/></div>
                                        <span>Ưu tiên hiển thị tin đăng trên trang kết quả</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-amber-100 text-amber-600 p-1 rounded-full flex-shrink-0 mt-0.5"><Check size={16} className="stroke-[3]"/></div>
                                        <span>Huy hiệu <strong>Chủ Trọ Xác Thực</strong></span>
                                    </li>
                                </ul>

                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all btn-glow premium-glow border-0 uppercase tracking-wide cursor-pointer">
                                    Đăng ký Gold Ngay
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    </div>

                </div>
            </div>
        </section>
    );
}

/* ─── Testimonials ─── */
function Testimonials({ role }: { role: Role }) {
    const { t } = useTranslation();
    const studentReviews = [
        {
            name: "Minh T.",
            role: t('premiumPage.roleITStudent'),
            text: t('premiumPage.reviewStudent1'),
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MinhT",
            rating: 5,
        },
        {
            name: "Linh N.",
            role: t('premiumPage.roleBusinessStudent'),
            text: t('premiumPage.reviewStudent2'),
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LinhN",
            rating: 5,
        },
        {
            name: "Hana K.",
            role: t('premiumPage.roleLanguageStudent'),
            text: t('premiumPage.reviewStudent3'),
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=HanaK",
            rating: 5,
        },
    ];

    const landlordReviews = [
        {
            name: "Tuan A.",
            role: t('premiumPage.roleLandlordNHS'),
            text: t('premiumPage.reviewLandlord1'),
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnhTuan",
            rating: 5,
        },
        {
            name: "Hoa N.",
            role: t('premiumPage.roleLandlordHC'),
            text: t('premiumPage.reviewLandlord2'),
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ChiHoa",
            rating: 5,
        },
        {
            name: "Duc T.",
            role: t('premiumPage.roleLandlordTK'),
            text: t('premiumPage.reviewLandlord3'),
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
                        {role === "student" ? t('premiumPage.whatStudentsSay') : t('premiumPage.whatLandlordsSay')} <span className="text-secondary">{t('premiumPage.whatSay')}</span>
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
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const studentFaqs = [
        { q: t('premiumPage.studentFaq1Q'), a: t('premiumPage.studentFaq1A') },
        { q: t('premiumPage.studentFaq2Q'), a: t('premiumPage.studentFaq2A') },
        { q: t('premiumPage.studentFaq3Q'), a: t('premiumPage.studentFaq3A') },
        { q: t('premiumPage.studentFaq4Q'), a: t('premiumPage.studentFaq4A') },
    ];

    const landlordFaqs = [
        { q: t('premiumPage.landlordFaq1Q'), a: t('premiumPage.landlordFaq1A') },
        { q: t('premiumPage.landlordFaq2Q'), a: t('premiumPage.landlordFaq2A') },
        { q: t('premiumPage.landlordFaq3Q'), a: t('premiumPage.landlordFaq3A') },
        { q: t('premiumPage.landlordFaq4Q'), a: t('premiumPage.landlordFaq4A') },
    ];

    const faqs = role === "student" ? studentFaqs : landlordFaqs;

    return (
        <section className="py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        {t('premiumPage.faqTitle1')} <span className="text-primary">{t('premiumPage.faqTitle2')}</span>
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
    const { t } = useTranslation();
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
                                {role === "student" ? t('premiumPage.readyStudent') : t('premiumPage.readyLandlord')}
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                {role === "student" ? t('premiumPage.ctaDescStudent') : t('premiumPage.ctaDescLandlord')}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-glow premium-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                            >
                                <Sparkles size={18} />
                                {role === "student" ? t('premiumPage.getStarted') : t('premiumPage.upgradeNow')}
                            </motion.button>
                            <p className="text-white/50 text-xs mt-4">
                                {role === "student" ? t('premiumPage.noAutoRenewal') : t('premiumPage.creditsNeverExpire')}
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
                            <LandlordPricingBoard />
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
