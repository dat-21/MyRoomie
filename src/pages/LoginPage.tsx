import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Building2, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuth, type Role } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

type LoginRole = Exclude<Role, null>;

const roleOptions: Array<{ value: LoginRole; label: string; icon: React.ElementType }> = [
    { value: "tenant", label: "Sinh vien", icon: GraduationCap },
    { value: "landlord", label: "Chu tro", icon: Building2 },
    { value: "admin", label: "Admin", icon: ShieldCheck },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState<LoginRole>("tenant");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError(t('login.errorRequired'));
            return;
        }

        setLoading(true);
        try {
            const success = await login(email, password, selectedRole);
            if (success) {
                navigate(selectedRole === "admin" ? "/admin" : "/");
            } else {
                setError(t('login.errorInvalid'));
            }
        } catch {
            setError(t('login.errorGeneral'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block no-underline">
                        <img src="/logo(1).jpg" alt="My Roomie" className="h-20 w-auto mx-auto brand-logo" />
                    </Link>
                </div>

                {/* Card */}
                <div className="glass-strong rounded-3xl shadow-2xl shadow-primary/5 p-8 relative overflow-hidden">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                            {t('login.welcomeBack')}
                        </h1>
                        <p className="text-text-light text-sm mt-2">
                            {t('login.loginSubtitle')}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Dang nhap voi vai tro</label>
                            <div className="grid grid-cols-3 gap-2">
                                {roleOptions.map((role) => {
                                    const Icon = role.icon;
                                    const active = selectedRole === role.value;

                                    return (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => setSelectedRole(role.value)}
                                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${active
                                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                                : "bg-white/70 text-text-light border-border hover:border-primary/40"
                                                }`}
                                        >
                                            <Icon size={14} />
                                            <span>{role.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedRole === "admin" && (
                                <p className="text-xs text-text-muted mt-2">
                                    Demo admin: admin@myroomie.vn / admin123
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-1.5">{t('login.email')}</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-border text-text placeholder:text-text-muted/60 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-text mb-1.5">{t('login.password')}</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/60 border border-border text-text placeholder:text-text-muted/60 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors bg-transparent border-0 cursor-pointer p-0"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                />
                                <span className="text-sm text-text-light">{t('login.rememberMe')}</span>
                            </label>
                            <button type="button" className="text-sm text-primary hover:text-primary-dark transition-colors bg-transparent border-0 cursor-pointer font-medium">
                                {t('login.forgotPassword')}
                            </button>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    {t('login.loginButton')}
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Register link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-light">
                            {t('login.noAccount')}{" "}
                            <Link to="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors no-underline">
                                {t('login.registerNow')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
