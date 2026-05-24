import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, PlusCircle, User, MessageCircle, Crown, Users, Building, LogIn, LogOut, Clock, Hammer } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavLink {
    to: string;
    labelKey: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    requireAuth?: boolean;
    authRedirect?: string;
}

const tenantNavLinks: NavLink[] = [
    { to: "/", labelKey: "common.home", icon: Home },
    { to: "/find", labelKey: "common.findRoommate", icon: Search, comingSoon: true },
    { to: "/rooms", labelKey: "common.rooms", icon: Building },
    { to: "/post", labelKey: "common.postRoom", icon: PlusCircle, requireAuth: true, authRedirect: "/login" },
    { to: "/premium", labelKey: "common.premium", icon: Crown },
];

interface NavbarProps {
    onChatOpen?: () => void;
}

/* ─── Coming Soon Modal ─── */
function ComingSoonModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", damping: 22, stiffness: 300 }}
                        className="relative z-10 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative blobs */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />

                        {/* Icon */}
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto mb-5 w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
                            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                        >
                            <Hammer size={36} className="text-violet-300" />
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-3 text-white relative z-10"
                            style={{ fontFamily: "var(--font-family-heading)" }}>
                            Đang phát triển
                        </h2>

                        {/* Description */}
                        <p className="text-sm leading-relaxed mb-6 text-white/70 relative z-10">
                            Tính năng <span className="text-violet-300 font-semibold">Tìm bạn cùng phòng</span> hiện đang được phát triển.
                            <br />
                            Chúng tôi sẽ ra mắt sớm nhất có thể! 🚀
                        </p>

                        {/* Progress bar */}
                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
                                <span>Tiến độ phát triển</span>
                                <span>72%</span>
                            </div>
                            <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "72%" }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg, #8b5cf6, #a78bfa)" }}
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-0 relative z-10"
                            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
                        >
                            Đã hiểu, quay lại
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function Navbar({ onChatOpen }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isPending, logout } = useAuth();

    const { t } = useTranslation();
    const navLinks = tenantNavLinks;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleNavClick = (link: NavLink, e: React.MouseEvent) => {
        if (link.comingSoon) {
            e.preventDefault();
            navigate("/");
            setShowComingSoon(true);
            return;
        }
        if (link.requireAuth && !isAuthenticated) {
            e.preventDefault();
            navigate(link.authRedirect || "/login");
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center no-underline">
                            <img src="/logo(1).jpg" alt="My Roomie" className="h-20 w-auto brand-logo" />
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.to && !link.comingSoon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.comingSoon ? "/" : link.to}
                                        onClick={(e) => handleNavClick(link, e)}
                                        className={`relative px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 no-underline flex items-center gap-1.5 ${isActive
                                            ? "text-primary"
                                            : link.comingSoon
                                                ? "text-text-light/60 hover:text-text-light cursor-pointer"
                                                : "text-text-light hover:text-primary"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute inset-0 bg-primary/10 rounded-xl"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{t(link.labelKey)}</span>
                                        {link.comingSoon && (
                                            <span className="relative z-10 text-[9px] px-1.5 py-0.5 rounded-md font-bold"
                                                style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white" }}>
                                                SOON
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Chat button */}
                            <LanguageSwitcher />

                            <button
                                onClick={onChatOpen}
                                className="relative ml-3 p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-text-light hover:text-primary cursor-pointer border-0 bg-transparent"
                                title={t('common.messages')}
                            >
                                <MessageCircle size={24} />
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                    <span className="text-[9px] text-white font-bold">2</span>
                                </span>
                            </button>

                            {/* Auth buttons */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-2 ml-2">
                                    {/* Role badge */}
                                    {user?.role === "landlord" && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                            <Building size={12} />
                                            {t('common.landlord')}
                                        </span>
                                    )}
                                    {user?.role === "tenant" && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                                            <Users size={12} />
                                            {t('common.tenant')}
                                        </span>
                                    )}
                                    {isPending && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF8E1", color: "#8A6D00", border: "1px solid #FFC107" }}>
                                            <Clock size={12} />
                                            {t('navbar.waitingApproval')}
                                        </span>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-text-light hover:text-primary hover:bg-primary/10 transition-all no-underline"
                                    >
                                        <User size={18} />
                                        <span className="hidden lg:inline">{user?.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-xl hover:bg-red-50 text-text-light hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent"
                                        title={t('common.logout')}
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="ml-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm no-underline shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                                >
                                    <LogIn size={16} />
                                    {t('common.login')}
                                </Link>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <div className="md:hidden flex items-center gap-3">
                            <button
                                onClick={onChatOpen}
                                className="relative p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-text cursor-pointer border-0 bg-transparent"
                            >
                                <MessageCircle size={24} />
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                    <span className="text-[9px] text-white font-bold">2</span>
                                </span>
                            </button>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-text cursor-pointer border-0 bg-transparent"
                            >
                                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden glass-strong border-t border-white/20"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.to && !link.comingSoon;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.comingSoon ? "/" : link.to}
                                            onClick={(e) => {
                                                handleNavClick(link, e);
                                                setMobileOpen(false);
                                            }}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : link.comingSoon
                                                    ? "text-text-light/60 hover:bg-gray-50"
                                                    : "text-text-light hover:bg-primary/5 hover:text-primary"
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {t(link.labelKey)}
                                            {link.comingSoon && (
                                                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-bold"
                                                    style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white" }}>
                                                    SOON
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}

                                {/* Mobile auth section */}
                                <div className="pt-2 mt-2 border-t border-border/50">
                                    {isAuthenticated ? (
                                        <>
                                            {/* Mobile role badge */}
                                            {user?.role && (
                                                <div className="flex items-center gap-2 px-4 py-2 mb-1">
                                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${user.role === "landlord"
                                                        ? "bg-primary/10 text-primary border border-primary/20"
                                                        : "bg-secondary/10 text-secondary border border-secondary/20"
                                                        }`}>
                                                        {user.role === "landlord" ? <Building size={12} /> : <Users size={12} />}
                                                        {user.role === "landlord" ? t('common.landlord') : t('common.tenant')}
                                                    </span>
                                                </div>
                                            )}
                                            {isPending && (
                                                <div className="flex items-center gap-2 px-4 py-2 mb-1">
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF8E1", color: "#8A6D00", border: "1px solid #FFC107" }}>
                                                        <Clock size={12} />
                                                        {t('navbar.waitingApproval')}
                                                    </span>
                                                </div>
                                            )}
                                            <Link
                                                to="/profile"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-light hover:bg-primary/5 hover:text-primary transition-all no-underline"
                                            >
                                                <User size={18} />
                                                {user?.name || t('common.profile')}
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setMobileOpen(false); }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all w-full bg-transparent border-0 cursor-pointer"
                                            >
                                                <LogOut size={18} />
                                                {t('common.logout')}
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-all no-underline"
                                        >
                                            <LogIn size={18} />
                                            {t('common.login')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Coming Soon Modal */}
            <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
        </>
    );
}
