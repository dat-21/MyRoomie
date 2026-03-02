import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, PlusCircle, User, Palette, MessageCircle, Crown, Users, Building, LogIn, LogOut, Clock, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const tenantNavLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/find", label: "Find Roommate", icon: Search },
    { to: "/rooms", label: "Rooms", icon: Building },
    { to: "/matches", label: "Matches", icon: Users },
    { to: "/post", label: "Post Room", icon: PlusCircle },
    { to: "/premium", label: "Premium", icon: Crown },
];

const landlordNavLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/rooms", label: "My Rooms", icon: Building },
    { to: "/post", label: "Post Room", icon: PlusCircle },
    { to: "/premium", label: "Premium", icon: Crown },
];

interface NavbarProps {
    onChatOpen?: () => void;
}

export default function Navbar({ onChatOpen }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isPending, logout } = useAuth();

    const navLinks = user?.role === "landlord" ? landlordNavLinks : tenantNavLinks;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center no-underline">
                        <img src="/logo(1).jpg" alt="My Roomie" className="h-20 w-auto object-contain" />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 no-underline ${isActive
                                        ? "text-primary"
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
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            );
                        })}

                        {/* Chat button */}
                        <button
                            onClick={onChatOpen}
                            className="relative ml-3 p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-text-light hover:text-primary cursor-pointer border-0 bg-transparent"
                            title="Messages"
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
                                        Landlord
                                    </span>
                                )}
                                {user?.role === "tenant" && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                                        <Users size={12} />
                                        Tenant
                                    </span>
                                )}
                                {isPending && (
                                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF8E1", color: "#8A6D00", border: "1px solid #FFC107" }}>
                                        <Clock size={12} />
                                        Chờ duyệt
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
                                    title="Đăng xuất"
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
                                Đăng nhập
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
                                        {link.label}
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
                                                    {user.role === "landlord" ? "Landlord" : "Tenant"}
                                                </span>
                                            </div>
                                        )}
                                        {isPending && (
                                            <div className="flex items-center gap-2 px-4 py-2 mb-1">
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#FFF8E1", color: "#8A6D00", border: "1px solid #FFC107" }}>
                                                    <Clock size={12} />
                                                    Chờ duyệt
                                                </span>
                                            </div>
                                        )}
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-light hover:bg-primary/5 hover:text-primary transition-all no-underline"
                                        >
                                            <User size={18} />
                                            {user?.name || "Hồ sơ"}
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setMobileOpen(false); }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all w-full bg-transparent border-0 cursor-pointer"
                                        >
                                            <LogOut size={18} />
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-all no-underline"
                                    >
                                        <LogIn size={18} />
                                        Đăng nhập
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
