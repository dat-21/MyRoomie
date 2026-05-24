import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    GraduationCap,
    Building2,
    Search,
    Users,
    Heart,
    Home,
    TrendingUp,
    Megaphone,
    Unlock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Star,
    MessageCircle,
    CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView } from "../hooks/useInView";

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

/* ══════════════════════════════════════════
   Hero — Role Selection
   ══════════════════════════════════════════ */
function HeroRoleSelection() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
            {/* Animated background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
                    >
                        <Sparkles size={16} />
                        Nền tảng kết nối phòng trọ #1 cho sinh viên
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight font-[family-name:var(--font-family-heading)]">
                        Chào mừng đến{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            My Roomie
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                        Dù bạn là sinh viên tìm phòng hay chủ trọ cho thuê — hãy chọn vai trò để bắt đầu trải nghiệm phù hợp nhất
                    </p>
                </motion.div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Landlord Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <Link to="/register?role=landlord" className="no-underline block h-full">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative h-full rounded-3xl p-8 pb-6 bg-gradient-to-br from-white/80 via-white/60 to-amber-50/50 backdrop-blur-xl border-2 border-amber-300/20 hover:border-amber-400/40 shadow-lg hover:shadow-2xl hover:shadow-amber-400/15 transition-all cursor-pointer overflow-hidden group"
                            >
                                {/* Decorative */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-[60px] group-hover:bg-amber-400/10 transition-colors" />

                                {/* Icon */}
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-6 shadow-xl shadow-amber-400/20 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 size={36} className="text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-text mb-2 font-[family-name:var(--font-family-heading)]">
                                    Tôi là Chủ trọ
                                </h2>
                                <p className="text-text-light text-sm mb-6 leading-relaxed">
                                    Đăng phòng, quản lý tin đăng, và tiếp cận hàng nghìn sinh viên đang tìm phòng
                                </p>

                                {/* Feature pills */}
                                <div className="space-y-2.5 mb-6">
                                    {[
                                        { icon: Megaphone, text: "Đăng & quản lý phòng dễ dàng" },
                                        { icon: Unlock, text: "Tiếp cận sinh viên tìm phòng" },
                                        { icon: TrendingUp, text: "Đẩy tin & tăng hiệu quả" },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-3 text-sm text-text-light">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                                <item.icon size={16} className="text-amber-600" />
                                            </div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    Bắt đầu đăng phòng
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <Link to="/register?role=tenant" className="no-underline block h-full">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative h-full rounded-3xl p-8 pb-6 bg-gradient-to-br from-white/80 via-white/60 to-primary/5 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-all cursor-pointer overflow-hidden group"
                            >
                                {/* Decorative */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors" />

                                {/* Icon */}
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap size={36} className="text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-text mb-2 font-[family-name:var(--font-family-heading)]">
                                    Tôi là Sinh viên
                                </h2>
                                <p className="text-text-light text-sm mb-6 leading-relaxed">
                                    Tìm phòng trọ phù hợp, kết nối bạn cùng phòng, và khám phá khu vực lý tưởng
                                </p>

                                {/* Feature pills */}
                                <div className="space-y-2.5 mb-6">
                                    {[
                                        { icon: Search, text: "Tìm phòng theo khu vực & giá" },
                                        { icon: Users, text: "Tìm bạn ở ghép phù hợp" },
                                        { icon: Heart, text: "Gợi ý thông minh theo lifestyle" },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-3 text-sm text-text-light">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <item.icon size={16} className="text-primary" />
                                            </div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                                    Bắt đầu tìm phòng
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>

                {/* Already have account */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10"
                >
                    <p className="text-text-muted text-sm">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center gap-10 mt-16"
                >
                    {[
                        { value: "2,500+", label: "Người dùng" },
                        { value: "1,200+", label: "Phòng đã đăng" },
                        { value: "89%", label: "Tỷ lệ match" },
                        { value: "95%", label: "Hài lòng" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{stat.value}</div>
                            <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   How It Works — For Both Roles
   ══════════════════════════════════════════ */
function HowItWorksSection() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Hoạt động như <span className="text-primary">thế nào?</span>
                    </h2>
                    <p className="mt-4 text-text-light max-w-xl mx-auto">
                        Quy trình đơn giản cho cả sinh viên và chủ trọ
                    </p>
                </FadeSection>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Student Flow */}
                    <FadeSection delay={0.1}>
                        <div className="glass rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                                    <GraduationCap size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                    Dành cho Sinh viên
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { step: "1", title: "Tạo hồ sơ", desc: "Điền thông tin cá nhân, sở thích, lối sống" },
                                    { step: "2", title: "Khám phá", desc: "Tìm phòng theo khu vực, giá, hoặc tìm bạn ở ghép" },
                                    { step: "3", title: "Kết nối", desc: "Nhắn tin, liên hệ và chuyển đến nhà mới!" },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-text">{item.title}</h4>
                                            <p className="text-xs text-text-light mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeSection>

                    {/* Landlord Flow */}
                    <FadeSection delay={0.2}>
                        <div className="glass rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                                    <Building2 size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                    Dành cho Chủ trọ
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { step: "1", title: "Đăng phòng", desc: "Tạo tin đăng với ảnh, mô tả, giá thuê" },
                                    { step: "2", title: "Quản lý", desc: "Theo dõi lượt xem, liên hệ, đẩy tin" },
                                    { step: "3", title: "Cho thuê", desc: "Tiếp cận sinh viên & hoàn tất hợp đồng" },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-600 font-bold text-sm">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-text">{item.title}</h4>
                                            <p className="text-xs text-text-light mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeSection>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Trust Section
   ══════════════════════════════════════════ */
function TrustSection() {
    const features = [
        { icon: ShieldCheck, title: "Xác thực danh tính", desc: "Mọi tài khoản được xác minh, đảm bảo an toàn" },
        { icon: Star, title: "Đánh giá minh bạch", desc: "Hệ thống review từ người thực, khách thực" },
        { icon: MessageCircle, title: "Chat an toàn", desc: "Nhắn tin trực tiếp, không cần chia sẻ SĐT" },
        { icon: CheckCircle2, title: "Cam kết chất lượng", desc: "Phòng được kiểm duyệt trước khi hiển thị" },
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
                        Tại sao chọn <span className="text-secondary">My Roomie</span>?
                    </h2>
                    <p className="mt-4 text-text-light max-w-xl mx-auto">
                        Nền tảng được thiết kế đặc biệt cho nhu cầu nhà ở của sinh viên Việt Nam
                    </p>
                </FadeSection>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <FadeSection key={f.title} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    className="glass rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-primary/5 transition-shadow"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon size={22} className="text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold text-text mb-2 font-[family-name:var(--font-family-heading)]">{f.title}</h3>
                                    <p className="text-sm text-text-light leading-relaxed">{f.desc}</p>
                                </motion.div>
                            </FadeSection>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Bottom CTA
   ══════════════════════════════════════════ */
function BottomCTA() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeSection>
                    <div className="animated-gradient rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-family-heading)]">
                                Sẵn sàng bắt đầu?
                            </h2>
                            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                                Tham gia cộng đồng hàng nghìn sinh viên và chủ trọ trên My Roomie
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/register?role=landlord">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-amber-600 font-semibold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border-0 text-base"
                                    >
                                        <Building2 size={18} />
                                        Tôi là Chủ trọ
                                    </motion.button>
                                </Link>
                                <Link to="/register?role=tenant">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/20 backdrop-blur text-white font-semibold border border-white/30 hover:bg-white/30 transition-all cursor-pointer text-base"
                                    >
                                        <GraduationCap size={18} />
                                        Tôi là Sinh viên
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </FadeSection>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════ */
export default function RoleSelectionPage() {
    return (
        <div>
            <HeroRoleSelection />
            <HowItWorksSection />
            <TrustSection />
            <BottomCTA />
        </div>
    );
}
