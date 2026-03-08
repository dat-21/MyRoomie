import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    DollarSign,
    Home,
    Users,
    Heart,
    Calendar,
    FileText,
    ChevronRight,
    ChevronLeft,
    Check,
    Send,
} from "lucide-react";
import { lifestyleOptions } from "../data/mockData";

interface FormData {
    location: string;
    rent: string;
    roomType: string;
    availableSlots: string;
    lifestyleExpectations: string[];
    moveInDate: string;
    description: string;
    title: string;
}

const initialFormData: FormData = {
    location: "",
    rent: "",
    roomType: "",
    availableSlots: "1",
    lifestyleExpectations: [],
    moveInDate: "",
    description: "",
    title: "",
};

const steps = [
    { labelKey: "postRoom.stepRoomDetails", icon: Home },
    { labelKey: "postRoom.stepPreferences", icon: Heart },
    { labelKey: "postRoom.stepDescription", icon: FileText },
    { labelKey: "postRoom.stepReview", icon: Check },
];

const roomTypes = [
    { value: "Private Room", labelKey: "postRoom.privateRoom" },
    { value: "Shared Room", labelKey: "postRoom.sharedRoom" },
    { value: "Studio Apartment", labelKey: "postRoom.studioApartment" },
    { value: "Master Bedroom", labelKey: "postRoom.masterBedroom" },
];

export default function PostRoomPage() {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitted, setSubmitted] = useState(false);
    const [direction, setDirection] = useState(1);

    const update = (field: keyof FormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            lifestyleExpectations: prev.lifestyleExpectations.includes(tag)
                ? prev.lifestyleExpectations.filter((t) => t !== tag)
                : [...prev.lifestyleExpectations, tag],
        }));
    };

    const next = () => {
        setDirection(1);
        setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    };

    const prev = () => {
        setDirection(-1);
        setCurrentStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const variants = {
        enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-28 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass rounded-3xl p-12 text-center max-w-md mx-4"
                >
                    <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                        <Check size={36} className="text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-text mb-3 font-[family-name:var(--font-family-heading)]">
                        {t('postRoom.successTitle')}
                    </h2>
                    <p className="text-text-light mb-6">
                        {t('postRoom.successDesc')}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSubmitted(false); setCurrentStep(0); setFormData(initialFormData); }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium cursor-pointer border-0 shadow-md"
                    >
                        {t('postRoom.postAnother')}
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Page header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        {t('postRoom.pageTitle1')} <span className="text-secondary">{t('postRoom.pageTitle2')}</span>
                    </h1>
                    <p className="mt-2 text-text-light">
                        {t('postRoom.pageSubtitle')}
                    </p>
                </motion.div>

                {/* Progress bar */}
                <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                        {/* Background line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/40" />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const done = i < currentStep;
                            const active = i === currentStep;
                            return (
                                <div key={step.labelKey} className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        animate={{
                                            scale: active ? 1.1 : 1,
                                            backgroundColor: done
                                                ? "var(--color-secondary)"
                                                : active
                                                    ? "var(--color-primary)"
                                                    : "rgba(255,255,255,0.7)",
                                        }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/40"
                                    >
                                        {done ? (
                                            <Check size={18} className="text-white" />
                                        ) : (
                                            <Icon size={18} className={active ? "text-white" : "text-text-muted"} />
                                        )}
                                    </motion.div>
                                    <span className={`mt-2 text-xs font-medium ${active ? "text-primary" : done ? "text-secondary" : "text-text-muted"}`}>
                                        {t(step.labelKey)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form steps */}
                <div className="glass rounded-3xl p-6 sm:p-10 min-h-[380px] relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <div className="space-y-5">
                                    <h2 className="text-xl font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                        <Home size={20} className="text-primary" />
                                        {t('postRoom.roomDetails')}
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">{t('postRoom.title')}</label>
                                        <input
                                            type="text"
                                            placeholder={t('postRoom.titlePlaceholder')}
                                            value={formData.title}
                                            onChange={(e) => update("title", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">
                                                <MapPin size={14} className="inline mr-1" />{t('postRoom.locationLabel')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t('postRoom.locationPlaceholder')}
                                                value={formData.location}
                                                onChange={(e) => update("location", e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">
                                                <DollarSign size={14} className="inline mr-1" />{t('postRoom.rent')}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder={t('postRoom.rentPlaceholder')}
                                                value={formData.rent}
                                                onChange={(e) => update("rent", e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">{t('postRoom.roomType')}</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {roomTypes.map((type) => (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => update("roomType", type.value)}
                                                        className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer border-0 ${formData.roomType === type.value
                                                            ? "bg-primary text-white shadow-md"
                                                            : "bg-white/60 text-text-light hover:bg-primary/10"
                                                            }`}
                                                    >
                                                        {t(type.labelKey)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">
                                                <Users size={14} className="inline mr-1" />{t('postRoom.availableSlots')}
                                            </label>
                                            <select
                                                value={formData.availableSlots}
                                                onChange={(e) => update("availableSlots", e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                                            >
                                                {[1, 2, 3, 4].map((n) => (
                                                    <option key={n} value={n}>{n} {n > 1 ? t('postRoom.slots') : t('postRoom.slot')}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">
                                            <Calendar size={14} className="inline mr-1" />{t('postRoom.availableFrom')}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.moveInDate}
                                            onChange={(e) => update("moveInDate", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-5">
                                    <h2 className="text-xl font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                        <Heart size={20} className="text-secondary" />
                                        {t('postRoom.lifestyleExpectations')}
                                    </h2>
                                    <p className="text-sm text-text-light">
                                        {t('postRoom.lifestyleDesc')}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {lifestyleOptions.map((tag) => (
                                            <motion.button
                                                key={tag}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleTag(tag)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border-0 ${formData.lifestyleExpectations.includes(tag)
                                                    ? "bg-secondary text-white shadow-md shadow-secondary/20"
                                                    : "bg-white/60 text-text-light hover:bg-secondary/10"
                                                    }`}
                                            >
                                                {t(`lifestyle.${tag}`, tag)}
                                            </motion.button>
                                        ))}
                                    </div>
                                    {formData.lifestyleExpectations.length > 0 && (
                                        <p className="text-xs text-text-muted">
                                            {formData.lifestyleExpectations.length} {t('postRoom.selectedTags')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-5">
                                    <h2 className="text-xl font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                        <FileText size={20} className="text-accent" />
                                        {t('postRoom.description')}
                                    </h2>
                                    <p className="text-sm text-text-light">
                                        {t('postRoom.descIntro')}
                                    </p>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => update("description", e.target.value)}
                                        placeholder={t('postRoom.descPlaceholder')}
                                        rows={8}
                                        className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    />
                                    <p className="text-xs text-text-muted">{formData.description.length}/500 {t('postRoom.characters')}</p>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-5">
                                    <h2 className="text-xl font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                                        <Check size={20} className="text-secondary" />
                                        {t('postRoom.reviewTitle')}
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            { label: t('postRoom.title'), value: formData.title || "—" },
                                            { label: t('postRoom.locationLabel'), value: formData.location || "—" },
                                            { label: t('postRoom.rent'), value: formData.rent ? `${Number(formData.rent).toLocaleString()} VND${t('common.perMonth')}` : "—" },
                                            { label: t('postRoom.roomType'), value: formData.roomType || "—" },
                                            { label: t('postRoom.availableSlots'), value: formData.availableSlots },
                                            { label: t('postRoom.availableFrom'), value: formData.moveInDate || "—" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/30">
                                                <span className="text-sm text-text-light">{item.label}</span>
                                                <span className="text-sm font-medium text-text">{item.value}</span>
                                            </div>
                                        ))}

                                        {formData.lifestyleExpectations.length > 0 && (
                                            <div className="py-2">
                                                <span className="text-sm text-text-light block mb-2">{t('postRoom.lifestyleLabel')}</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {formData.lifestyleExpectations.map((tag) => (
                                                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                            {t(`lifestyle.${tag}`, tag)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {formData.description && (
                                            <div className="py-2">
                                                <span className="text-sm text-text-light block mb-2">{t('postRoom.descriptionLabel')}</span>
                                                <p className="text-sm text-text leading-relaxed bg-white/40 p-4 rounded-xl">
                                                    {formData.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={prev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer border-0 ${currentStep === 0
                            ? "bg-white/40 text-text-muted cursor-not-allowed"
                            : "bg-white/70 text-text hover:bg-white/90 shadow-md"
                            }`}
                    >
                        <ChevronLeft size={16} />
                        {t('common.previous')}
                    </motion.button>

                    {currentStep < steps.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={next}
                            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm shadow-md shadow-primary/20 cursor-pointer border-0"
                        >
                            {t('common.next')}
                            <ChevronRight size={16} />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSubmit}
                            className="btn-glow flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-light text-white font-medium text-sm shadow-md shadow-secondary/20 cursor-pointer border-0"
                        >
                            <Send size={16} />
                            {t('postRoom.publish')}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
