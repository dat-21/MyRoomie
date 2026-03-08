import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building, Users, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff,
    User, Phone, MapPin, DollarSign, Home, FileText, CheckCircle2
} from "lucide-react";
import { useAuth, type Role, type UserData } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

/* ─── Success Popup ─── */
function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useTranslation();
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

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl"
                        style={{
                            background: "#FFF8E1",
                            border: "2px solid #FFC107",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FFF0B3" }}>
                            <CheckCircle2 size={36} style={{ color: "#F59E0B" }} />
                        </div>

                        <h2 className="text-xl font-bold mb-3 font-[family-name:var(--font-family-heading)]" style={{ color: "#8A6D00" }}>
                            {t('registerPage.successTitle')}
                        </h2>

                        <p className="text-sm leading-relaxed mb-6" style={{ color: "#8A6D00" }}>
                            {t('registerPage.successDesc')}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-xl font-semibold text-white cursor-pointer border-0 shadow-md text-sm"
                            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
                        >
                            {t('common.ok')}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Step Indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: total }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= current
                            ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/20"
                            : "bg-white/60 text-text-muted border border-border"
                            }`}
                    >
                        {i + 1}
                    </div>
                    {i < total - 1 && (
                        <div className={`w-12 h-0.5 rounded transition-all duration-300 ${i < current ? "bg-primary" : "bg-border"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── Role Selection ─── */
function RoleSelection({ onSelect }: { onSelect: (role: Role) => void }) {
    const [hovered, setHovered] = useState<Role>(null);
    const { t } = useTranslation();

    const roles = [
        {
            id: "landlord" as Role,
            icon: Building,
            title: t('registerPage.landlordTitle'),
            desc: t('registerPage.landlordDesc'),
            color: "from-primary to-primary-light",
        },
        {
            id: "tenant" as Role,
            icon: Users,
            title: t('registerPage.tenantTitle'),
            desc: t('registerPage.tenantDesc'),
            color: "from-secondary to-secondary-light",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    {t('registerPage.whoAreYou')}
                </h2>
                <p className="text-text-light text-sm mt-2">
                    {t('registerPage.chooseRole')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isHovered = hovered === role.id;
                    return (
                        <motion.button
                            key={role.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(role.id)}
                            onMouseEnter={() => setHovered(role.id)}
                            onMouseLeave={() => setHovered(null)}
                            className={`relative p-6 rounded-2xl text-left cursor-pointer border-2 transition-all duration-300 bg-white/60 ${isHovered
                                ? "border-primary shadow-lg shadow-primary/10"
                                : "border-border hover:border-primary/40"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 shadow-md`}>
                                <Icon size={26} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-text font-[family-name:var(--font-family-heading)] mb-1">
                                {role.title}
                            </h3>
                            <p className="text-sm text-text-light leading-relaxed">
                                {role.desc}
                            </p>
                            <div className="mt-4 flex items-center gap-1 text-primary font-medium text-sm">
                                {t('registerPage.choose')} <ArrowRight size={14} />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Registration Form ─── */
interface FormFieldProps {
    label: string;
    icon: React.ElementType;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    textarea?: boolean;
}

function FormField({ label, icon: Icon, value, onChange, placeholder, type = "text", textarea }: FormFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
            <div className="relative">
                <Icon size={18} className="absolute left-3.5 top-3.5 text-text-muted" />
                {textarea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-border text-text placeholder:text-text-muted/60 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-border text-text placeholder:text-text-muted/60 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                )}
            </div>
        </div>
    );
}

/* ─── Main Register Page ─── */
export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const { t } = useTranslation();

    const [step, setStep] = useState(0); // 0=role, 1=form
    const [role, setRole] = useState<Role>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Common fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Landlord fields
    const [area, setArea] = useState("");
    const [rooms, setRooms] = useState("");
    const [description, setDescription] = useState("");

    // Tenant fields
    const [budget, setBudget] = useState("");
    const [desiredArea, setDesiredArea] = useState("");
    const [intro, setIntro] = useState("");

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !name || !phone) {
            setError(t('registerPage.errorRequired'));
            return;
        }

        setLoading(true);
        try {
            const userData: UserData = {
                email,
                name,
                role,
                status: "pending",
                phone,
                ...(role === "landlord"
                    ? { area, rooms, description }
                    : { budget, area: desiredArea, intro }
                ),
            };
            await register(userData);
            setShowSuccess(true);
        } catch {
            setError(t('registerPage.errorGeneral'));
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg"
            >
                {/* Logo */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block no-underline">
                        <img src="/logo(1).jpg" alt="My Roomie" className="h-20 w-auto mx-auto object-contain" />
                    </Link>
                </div>

                {/* Card */}
                <div className="glass-strong rounded-3xl shadow-2xl shadow-primary/5 p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary/0 via-primary to-secondary/0" />

                    <StepIndicator current={step} total={2} />

                    <AnimatePresence mode="wait">
                        {step === 0 ? (
                            <motion.div
                                key="role"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RoleSelection onSelect={handleRoleSelect} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-6">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="flex items-center gap-1.5 text-sm text-text-light hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0 mb-4"
                                    >
                                        <ArrowLeft size={16} /> {t('registerPage.backToRole')}
                                    </button>
                                    <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                        {role === "landlord" ? t('registerPage.landlordInfo') : t('registerPage.tenantInfo')}
                                    </h2>
                                    <p className="text-text-light text-sm mt-1">
                                        {t('registerPage.completeRegister')}
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Common fields */}
                                    <FormField label={t('registerPage.emailLabel')} icon={Mail} value={email} onChange={setEmail} placeholder="you@example.com" type="email" />

                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">{t('registerPage.passwordLabel')}</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
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

                                    <FormField label={t('registerPage.fullName')} icon={User} value={name} onChange={setName} placeholder={t('registerPage.fullNamePlaceholder')} />
                                    <FormField label={t('registerPage.phone')} icon={Phone} value={phone} onChange={setPhone} placeholder={t('registerPage.phonePlaceholder')} type="tel" />

                                    {/* Role-specific fields */}
                                    {role === "landlord" ? (
                                        <>
                                            <FormField label={t('registerPage.rentalArea')} icon={MapPin} value={area} onChange={setArea} placeholder={t('registerPage.rentalAreaPlaceholder')} />
                                            <FormField label={t('registerPage.numberOfRooms')} icon={Home} value={rooms} onChange={setRooms} placeholder={t('registerPage.numberOfRoomsPlaceholder')} />
                                            <FormField label={t('registerPage.descriptionLabel')} icon={FileText} value={description} onChange={setDescription} placeholder={t('registerPage.descriptionPlaceholder')} textarea />
                                        </>
                                    ) : (
                                        <>
                                            <FormField label={t('registerPage.budgetLabel')} icon={DollarSign} value={budget} onChange={setBudget} placeholder={t('registerPage.budgetPlaceholder')} />
                                            <FormField label={t('registerPage.desiredArea')} icon={MapPin} value={desiredArea} onChange={setDesiredArea} placeholder={t('registerPage.desiredAreaPlaceholder')} />
                                            <FormField label={t('registerPage.introLabel')} icon={FileText} value={intro} onChange={setIntro} placeholder={t('registerPage.introPlaceholder')} textarea />
                                        </>
                                    )}

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>{t('registerPage.registerButton')}</>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-light">
                            {t('registerPage.haveAccount')}{" "}
                            <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors no-underline">
                                {t('registerPage.loginNow')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Success Modal */}
            <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </div>
    );
}
