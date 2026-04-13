import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Crown,
    Check,
    X as XIcon,
    Shield,
    TrendingUp,
    Unlock,
    Rocket,
    Star,
    Zap,
    Building2,
    Eye,
    MessageCircle,
    Users,
    Clock,
    Megaphone,
    BadgeCheck,
    Gift,
    ChevronDown,
} from "lucide-react";
import { formatCurrency } from "../data/mockData";
import { useInView } from "../hooks/useInView";
import LandlordInteractivePricing from "../components/LandlordInteractivePricing";

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

/* ─── Types ─── */
type PlanId = "free" | "silver" | "gold";

interface SubscriptionPlan {
    id: PlanId;
    name: string;
    price: number;
    period: string;
    icon: React.ElementType;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    badge?: string;
    features: { text: string; included: boolean; highlight?: boolean }[];
    boostsPerMonth: number;
    contactUnlocks: string;
    priorityDisplay: boolean;
}

/* ─── Plans Data ─── */
const plans: SubscriptionPlan[] = [
    {
        id: "free",
        name: "Miễn phí",
        price: 0,
        period: "",
        icon: Building2,
        color: "text-gray-500",
        gradientFrom: "from-gray-400",
        gradientTo: "to-gray-500",
        features: [
            { text: "Đăng tối đa 2 phòng", included: true },
            { text: "3 lượt liên hệ / tháng", included: true },
            { text: "Đẩy tin", included: false },
            { text: "Ưu tiên hiển thị", included: false },
            { text: "Huy hiệu xác thực", included: false },
            { text: "Thống kê nâng cao", included: false },
        ],
        boostsPerMonth: 0,
        contactUnlocks: "3 / tháng",
        priorityDisplay: false,
    },
    {
        id: "silver",
        name: "Silver",
        price: 299000,
        period: "/ tháng",
        icon: Shield,
        color: "text-slate-600",
        gradientFrom: "from-slate-500",
        gradientTo: "to-slate-600",
        features: [
            { text: "Đăng tối đa 10 phòng", included: true },
            { text: "30 lượt liên hệ / tháng", included: true },
            { text: "3 lượt đẩy tin / tháng", included: true },
            { text: "Ưu tiên hiển thị", included: false },
            { text: "Huy hiệu xác thực", included: false },
            { text: "Thống kê nâng cao", included: true },
        ],
        boostsPerMonth: 3,
        contactUnlocks: "30 / tháng",
        priorityDisplay: false,
    },
    {
        id: "gold",
        name: "Gold",
        price: 699000,
        period: "/ tháng",
        icon: Crown,
        color: "text-amber-600",
        gradientFrom: "from-amber-500",
        gradientTo: "to-yellow-500",
        badge: "Best Choice",
        features: [
            { text: "Đăng không giới hạn phòng", included: true, highlight: true },
            { text: "Unlimited liên hệ", included: true, highlight: true },
            { text: "10 lượt đẩy tin / tháng", included: true, highlight: true },
            { text: "Ưu tiên hiển thị", included: true },
            { text: "Huy hiệu xác thực", included: true },
            { text: "Thống kê nâng cao", included: true },
        ],
        boostsPerMonth: 10,
        contactUnlocks: "Không giới hạn",
        priorityDisplay: true,
    },
];

/* ══════════════════════════════════════════
   Hero Section
   ══════════════════════════════════════════ */
function PremiumHero() {
    return (
        <section className="relative overflow-hidden pb-8">
            {/* Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/20 to-yellow-300/15 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-orange-300/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 text-sm font-medium mb-6 border border-amber-300/30"
                    >
                        <Crown size={16} className="text-amber-500" />
                        Premium dành cho Chủ trọ
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                        Tăng hiệu quả cho thuê với{" "}
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                            gói Premium
                        </span>
                    </h1>

                    <p className="mt-4 text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                        Mở khóa toàn bộ tiềm năng. Tiếp cận nhiều sinh viên hơn, đẩy tin ưu tiên, và quản lý phòng trọ chuyên nghiệp.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8"
                    >
                        {[
                            { icon: Unlock, label: "Unlimited liên hệ", color: "text-amber-600" },
                            { icon: Rocket, label: "10 đẩy tin / tháng", color: "text-orange-500" },
                            { icon: TrendingUp, label: "Ưu tiên hiển thị", color: "text-yellow-600" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <item.icon size={18} className={item.color} />
                                <span className="text-sm text-text-light">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Current Plan Status
   ══════════════════════════════════════════ */
function CurrentPlanStatus() {
    // Mock: user is on Free plan
    const currentPlan: PlanId = "free";
    const boostsUsed = 0;
    const boostsTotal = 0;
    const contactsUsed = 1;
    const contactsTotal = 3;

    return (
        <FadeSection>
            <div className="glass rounded-2xl p-6 mb-10 border border-amber-200/40 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Building2 size={24} className="text-gray-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-800">Gói hiện tại: <span className="text-gray-500">Miễn phí</span></h3>
                            </div>
                            <p className="text-slate-500 text-sm mt-0.5">Nâng cấp để mở khóa thêm tính năng</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Boost counter */}
                        <div className="text-center">
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                                <Rocket size={12} />
                                Đẩy tin
                            </div>
                            <p className="text-lg font-bold text-slate-800">{boostsUsed}/{boostsTotal}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        {/* Contact counter */}
                        <div className="text-center">
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                                <MessageCircle size={12} />
                                Liên hệ
                            </div>
                            <p className="text-lg font-bold text-slate-800">{contactsUsed}/{contactsTotal}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        {/* Status */}
                        <div className="text-center">
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                                <Clock size={12} />
                                Trạng thái
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Đang hoạt động</span>
                        </div>
                    </div>
                </div>
            </div>
        </FadeSection>
    );
}

/* ══════════════════════════════════════════
   Pricing Cards
   ══════════════════════════════════════════ */
function PricingSection() {
    const currentPlan: PlanId = "free";

    return (
        <section className="py-8">
            <FadeSection className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-4 border border-amber-200/40">
                    <Crown size={14} />
                    Chọn gói phù hợp
                </div>
                <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    Gói đăng ký cho{" "}
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Chủ trọ</span>
                </h2>
                <p className="mt-3 text-text-light">Chọn gói phù hợp với nhu cầu quản lý phòng trọ của bạn</p>
            </FadeSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch max-w-5xl mx-auto">
                {plans.map((plan, i) => {
                    const Icon = plan.icon;
                    const isGold = plan.id === "gold";
                    const isCurrent = plan.id === currentPlan;

                    return (
                        <FadeSection key={plan.id} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className={`relative rounded-3xl p-6 transition-all duration-300 h-full flex flex-col ${
                                    isGold
                                        ? "border-2 border-amber-400/50 shadow-2xl shadow-amber-200/30 bg-gradient-to-b from-amber-50/80 via-white to-yellow-50/50 ring-1 ring-amber-300/20 sm:scale-105 z-10"
                                        : "glass hover:shadow-lg"
                                }`}
                            >
                                {/* Best Choice Badge */}
                                {plan.badge && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                            className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold shadow-lg shadow-amber-400/30 whitespace-nowrap flex items-center gap-1.5"
                                        >
                                            <Star size={12} className="fill-white" />
                                            {plan.badge}
                                        </motion.span>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="text-center pt-2 mb-4">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} mb-3 shadow-lg`}>
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text font-[family-name:var(--font-family-heading)]">{plan.name}</h3>

                                    <div className="mt-3">
                                        {plan.price === 0 ? (
                                            <span className="text-3xl font-bold text-text">Miễn phí</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                                    {new Intl.NumberFormat("vi-VN").format(plan.price)}
                                                </span>
                                                <span className="text-text-muted text-sm">₫ {plan.period}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Key metrics */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="text-center p-2 rounded-lg bg-white/60 border border-border/40">
                                        <div className="text-xs text-text-muted mb-0.5">Đẩy tin</div>
                                        <div className="font-bold text-sm text-text">
                                            {plan.boostsPerMonth === -1 ? "∞" : plan.boostsPerMonth}
                                            <span className="text-text-muted font-normal text-xs"> /tháng</span>
                                        </div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-white/60 border border-border/40">
                                        <div className="text-xs text-text-muted mb-0.5">Liên hệ</div>
                                        <div className="font-bold text-sm text-text">
                                            {plan.contactUnlocks === "Không giới hạn" ? "∞" : plan.contactUnlocks}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature list */}
                                <div className="space-y-2.5 mb-6 flex-1">
                                    {plan.features.map((f) => (
                                        <div key={f.text} className={`flex items-start gap-2 text-sm ${f.included ? (f.highlight ? "text-text font-medium" : "text-text-light") : "text-text-muted/40"}`}>
                                            {f.included ? (
                                                <Check size={16} className={`flex-shrink-0 mt-0.5 ${f.highlight ? "text-amber-500" : "text-green-500"}`} />
                                            ) : (
                                                <XIcon size={16} className="flex-shrink-0 mt-0.5 text-text-muted/30" />
                                            )}
                                            <span className={!f.included ? "line-through" : ""}>{f.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3.5 rounded-2xl font-semibold text-sm cursor-pointer border-0 transition-all ${
                                        isCurrent
                                            ? "bg-gray-100 text-text-muted cursor-default"
                                            : isGold
                                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-400/25 hover:shadow-xl hover:shadow-amber-400/35 btn-glow"
                                                : `bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} text-white shadow-md hover:shadow-lg`
                                    }`}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? (
                                        "Gói hiện tại"
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Zap size={16} />
                                            Nâng cấp ngay
                                        </span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </FadeSection>
                    );
                })}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Gold Highlight Section
   ══════════════════════════════════════════ */
function GoldHighlight() {
    const benefits = [
        {
            icon: Unlock,
            title: "Unlimited liên hệ",
            desc: "Không giới hạn số lượt mở khóa thông tin sinh viên. Tiếp cận mọi người thuê tiềm năng.",
        },
        {
            icon: Rocket,
            title: "10 lượt Đẩy tin / tháng",
            desc: "Phòng của bạn sẽ được hiển thị ưu tiên trên trang chủ, tăng lượt xem gấp 5 lần.",
        },
        {
            icon: TrendingUp,
            title: "Ưu tiên hiển thị",
            desc: "Phòng luôn hiển thị ở vị trí đầu trong kết quả tìm kiếm của sinh viên.",
        },
        {
            icon: BadgeCheck,
            title: "Huy hiệu xác thực",
            desc: "Badge 'Chủ trọ xác thực' tăng uy tín và độ tin cậy cho phòng của bạn.",
        },
        {
            icon: Eye,
            title: "Thống kê nâng cao",
            desc: "Xem chi tiết lượt xem, nguồn truy cập, và hiệu quả từng tin đăng.",
        },
        {
            icon: Gift,
            title: "Hỗ trợ ưu tiên",
            desc: "Được hỗ trợ nhanh chóng qua kênh riêng khi gặp vấn đề.",
        },
    ];

    return (
        <section className="py-16">
            <FadeSection className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-4 border border-amber-200/40">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    Tại sao chọn Gold?
                </div>
                <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    Quyền lợi gói{" "}
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Gold Subscription</span>
                </h2>
                <p className="mt-3 text-text-light max-w-lg mx-auto">
                    Gói được chủ trọ tin dùng nhiều nhất — tối ưu chi phí, tối đa hiệu quả
                </p>
            </FadeSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {benefits.map((b, i) => {
                    const Icon = b.icon;
                    return (
                        <FadeSection key={b.title} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="glass rounded-2xl p-6 h-full border border-amber-100/50 hover:border-amber-200/60 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-4 shadow-md shadow-amber-400/20">
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="text-base font-bold text-text mb-2 font-[family-name:var(--font-family-heading)]">{b.title}</h3>
                                <p className="text-sm text-text-light leading-relaxed">{b.desc}</p>
                            </motion.div>
                        </FadeSection>
                    );
                })}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Comparison Table
   ══════════════════════════════════════════ */
function ComparisonTable() {
    const rows = [
        { feature: "Số phòng đăng", free: "2", silver: "10", gold: "Không giới hạn" },
        { feature: "Lượt liên hệ / tháng", free: "3", silver: "30", gold: "Unlimited" },
        { feature: "Đẩy tin / tháng", free: "—", silver: "3", gold: "10" },
        { feature: "Ưu tiên hiển thị", free: false, silver: false, gold: true },
        { feature: "Huy hiệu xác thực", free: false, silver: false, gold: true },
        { feature: "Thống kê nâng cao", free: false, silver: true, gold: true },
        { feature: "Xuất báo cáo", free: false, silver: false, gold: true },
        { feature: "Hỗ trợ ưu tiên", free: false, silver: false, gold: true },
    ];

    return (
        <section className="py-16">
            <FadeSection className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    So sánh <span className="text-amber-500">chi tiết</span>
                </h2>
            </FadeSection>

            <FadeSection delay={0.1}>
                <div className="max-w-5xl mx-auto overflow-x-auto">
                    <div className="min-w-[600px] glass rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-4 border-b border-border/50">
                            <div className="p-4 text-sm font-semibold text-text">Tính năng</div>
                            {plans.map(p => (
                                <div
                                    key={p.id}
                                    className={`p-4 text-center text-sm font-bold ${p.id === "gold" ? "bg-amber-50/50 text-amber-700" : "text-text"}`}
                                >
                                    {p.name}
                                    {p.id === "gold" && (
                                        <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold align-middle">
                                            <Star size={8} className="fill-white" />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Rows */}
                        {rows.map((row, i) => (
                            <div
                                key={row.feature}
                                className={`grid grid-cols-4 items-center border-b border-border/30 last:border-0 hover:bg-primary/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/30"}`}
                            >
                                <div className="p-4 text-sm text-text">{row.feature}</div>
                                {(["free", "silver", "gold"] as PlanId[]).map(planId => {
                                    const val = row[planId as keyof typeof row];
                                    const isGoldCol = planId === "gold";
                                    return (
                                        <div key={planId} className={`p-4 text-center ${isGoldCol ? "bg-amber-50/30" : ""}`}>
                                            {typeof val === "boolean" ? (
                                                val ? (
                                                    <Check size={18} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <XIcon size={18} className="text-text-muted/30 mx-auto" />
                                                )
                                            ) : (
                                                <span className={`text-sm ${isGoldCol ? "font-bold text-amber-700" : "text-text-light"}`}>
                                                    {val}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </FadeSection>
        </section>
    );
}

/* ══════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════ */
function LandlordFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "Gói Gold có cam kết thời hạn không?", a: "Không, bạn có thể huỷ bất cứ lúc nào. Gói sẽ hoạt động cho đến hết chu kỳ thanh toán hiện tại." },
        { q: "Lượt đẩy tin chưa dùng có chuyển sang tháng sau?", a: "Lượt đẩy tin sẽ reset vào đầu mỗi chu kỳ thanh toán. Hãy tận dụng hết trong tháng!" },
        { q: "Unlimited liên hệ nghĩa là gì?", a: "Bạn có thể xem thông tin (SĐT, email, Zalo) của tất cả sinh viên đang tìm phòng mà không bị giới hạn số lượt." },
        { q: "Tôi có thể nâng cấp hoặc hạ gói không?", a: "Có, bạn có thể thay đổi gói bất cứ lúc nào. Phí sẽ được tính theo tỷ lệ thời gian còn lại." },
        { q: "Ưu tiên hiển thị hoạt động như thế nào?", a: "Phòng của bạn sẽ luôn xuất hiện ở vị trí cao hơn trong kết quả tìm kiếm so với phòng của chủ trọ không có Premium." },
    ];

    return (
        <section className="py-16">
            <FadeSection className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    Câu hỏi <span className="text-primary">thường gặp</span>
                </h2>
            </FadeSection>

            <div className="max-w-2xl mx-auto space-y-3">
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
                                    <ChevronDown size={16} />
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-4 text-sm text-text-light leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </FadeSection>
                ))}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Bottom CTA
   ══════════════════════════════════════════ */
function BottomCTA() {
    return (
        <section className="py-16">
            <FadeSection>
                <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400">
                    <div className="absolute inset-0 bg-black/5" />
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-8 opacity-20"><Star size={32} className="text-white fill-white" /></div>
                    <div className="absolute bottom-6 right-12 opacity-20"><Crown size={40} className="text-white" /></div>
                    <div className="absolute top-1/2 left-1/4 opacity-10"><Zap size={48} className="text-white" /></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-family-heading)]">
                            Sẵn sàng tăng tốc cho thuê?
                        </h2>
                        <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                            Nâng cấp lên Gold hôm nay và tận hưởng quyền lợi unlimited ngay lập tức
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-glow inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-amber-600 font-bold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                        >
                            <Crown size={20} />
                            Nâng cấp Gold — {formatCurrency(699000)}/tháng
                        </motion.button>
                        <p className="text-white/60 text-xs mt-4">Huỷ bất cứ lúc nào · Không cam kết hợp đồng</p>
                    </div>
                </div>
            </FadeSection>
        </section>
    );
}

/* ══════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════ */
export default function LandlordPremiumPage() {
    return (
        <div className="pb-12 bg-[#fafafa] min-h-screen">
            <PremiumHero />
            <CurrentPlanStatus />
            <div className="py-8">
                <LandlordInteractivePricing />
            </div>
            <GoldHighlight />
            <LandlordFAQ />
            <BottomCTA />
        </div>
    );
}
