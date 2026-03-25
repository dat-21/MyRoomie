import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Building, PlusCircle, Crown, User, LogOut, MessageCircle, Clock, Settings, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const landlordNavLinks = [
    { to: "/", labelKey: "common.dashboard", icon: LayoutDashboard, premium: false },
    { to: "/rooms", labelKey: "common.myRooms", icon: Building, premium: false },
    { to: "/explore", labelKey: "common.explore", icon: Search, premium: false },
    { to: "/post", labelKey: "common.postRoom", icon: PlusCircle, premium: false },
    { to: "/premium", labelKey: "common.premium", icon: Crown, premium: true },
];

interface LandlordSidebarProps {
    onChatOpen?: () => void;
}

export default function LandlordSidebar({ onChatOpen }: LandlordSidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isPending, logout } = useAuth();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-strong border-r border-border/50 z-40">
                <div className="p-6 flex items-center justify-center border-b border-border/50">
                    <Link to="/" className="inline-block no-underline">
                        <img src="/logo(1).jpg" alt="My Roomie" className="h-12 w-auto brand-logo" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <div className="mb-4 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {t('common.mainMenu', 'Main Menu')}
                    </div>
                    {landlordNavLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.to;
                        const isPremiumLink = link.premium;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${isActive
                                        ? isPremiumLink
                                            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-400/20"
                                            : "bg-primary text-white shadow-md shadow-primary/20"
                                        : isPremiumLink
                                            ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                            : "text-text-light hover:bg-primary/10 hover:text-primary"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-white" : isPremiumLink ? "text-amber-500" : ""} />
                                {t(link.labelKey)}
                                {isPremiumLink && !isActive && (
                                    <span className="ml-auto px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600 text-[9px] font-bold">PRO</span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50 space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <LanguageSwitcher />
                        <button
                            onClick={onChatOpen}
                            className="relative p-2 rounded-xl hover:bg-primary/10 transition-colors text-text-light hover:text-primary cursor-pointer border-0 bg-transparent"
                            title={t('common.messages')}
                        >
                            <MessageCircle size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">2</span>
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {(user?.name || "L").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                            <p className="text-xs text-text-muted truncate capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Link to="/profile" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors no-underline">
                            <Settings size={14} />
                            {t('common.profile', 'Profile')}
                        </Link>
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors border-0 cursor-pointer w-full">
                            <LogOut size={14} />
                            {t('common.logout', 'Logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Menu */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-20 glass-strong z-50 flex items-center justify-between px-4 border-b border-border/50">
                <Link to="/" className="inline-block no-underline">
                    <img src="/logo(1).jpg" alt="My Roomie" className="h-10 w-auto brand-logo" />
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onChatOpen}
                        className="relative p-2 rounded-xl hover:bg-primary/10 transition-colors text-text cursor-pointer border-0 bg-transparent"
                    >
                        <MessageCircle size={24} />
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full" />
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-xl hover:bg-primary/10 transition-colors text-text cursor-pointer border-0 bg-transparent"
                    >
                        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed top-20 left-0 right-0 bg-white shadow-xl z-40 border-b border-border/50 max-h-[calc(100vh-5rem)] overflow-y-auto"
                    >
                        <div className="p-4 space-y-2">
                            {landlordNavLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-light hover:bg-primary/5 hover:text-primary"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {t(link.labelKey)}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-2">
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-light hover:bg-primary/5 hover:text-primary transition-all no-underline"
                                >
                                    <Settings size={18} />
                                    {t('common.profile', 'Profile')}
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left bg-transparent border-0 cursor-pointer"
                                >
                                    <LogOut size={18} />
                                    {t('common.logout')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
