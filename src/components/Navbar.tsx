import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, PlusCircle, User, Palette } from "lucide-react";

const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/find", label: "Find Roommate", icon: Search },
    { to: "/post", label: "Post Room", icon: PlusCircle },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/design", label: "Design System", icon: Palette },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-bold text-sm font-[family-name:var(--font-family-heading)]">MR</span>
                        </div>
                        <span className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                            My <span className="text-primary">Roomie</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 no-underline ${isActive
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
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors text-text"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
