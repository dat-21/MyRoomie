import { useState, useRef } from "react";
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
    Camera,
    Upload,
    Lock,
    Trash2,
    Zap,
    Droplet,
    Sparkles,
    ShieldAlert,
} from "lucide-react";
import { PiMoneyWavy } from "react-icons/pi";
import { LIFESTYLE_OPTIONS as lifestyleOptions } from "../lib/constants";

interface FormData {
    title: string;
    roomType: string;
    availableSlots: string;
    moveInDate: string;
    location: string;
    area: string;
    
    // Pricing
    rent: string;
    electricityPrice: string;
    waterPrice: string;
    
    additionalFees: {
        serviceFee: { checked: boolean; amount: string };
        parkingFee: { checked: boolean; amount: string };
        internetFee: { checked: boolean; amount: string };
        cleaningFee: { checked: boolean; amount: string };
        otherFee: { checked: boolean; amount: string };
    };

    // Images
    images: {
        angle1: string; // Toàn cảnh
        angle2: string; // Giường ngủ
        angle3: string; // WC
        angle4: string; // Bếp
        angle5: string; // Ban công
    };

    // Legal Documents
    legalDocs: string[]; // Base64 or object URLs

    // Description & Lifestyle
    lifestyleExpectations: string[];
    description: string;
}

const initialFormData: FormData = {
    title: "",
    roomType: "Private Room",
    availableSlots: "1",
    moveInDate: "",
    location: "",
    area: "",
    
    rent: "",
    electricityPrice: "",
    waterPrice: "",
    
    additionalFees: {
        serviceFee: { checked: false, amount: "" },
        parkingFee: { checked: false, amount: "" },
        internetFee: { checked: false, amount: "" },
        cleaningFee: { checked: false, amount: "" },
        otherFee: { checked: false, amount: "" },
    },

    images: {
        angle1: "",
        angle2: "",
        angle3: "",
        angle4: "",
        angle5: "",
    },

    legalDocs: [],

    lifestyleExpectations: [],
    description: "",
};

const steps = [
    { labelKey: "postRoom.stepBasicInfo", icon: Home },
    { labelKey: "postRoom.stepPricing", icon: DollarSign },
    { labelKey: "postRoom.stepPhotos", icon: Camera },
    { labelKey: "postRoom.stepPreferences", icon: Heart },
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

    // Refs for file uploads
    const fileInputRefs = {
        angle1: useRef<HTMLInputElement>(null),
        angle2: useRef<HTMLInputElement>(null),
        angle3: useRef<HTMLInputElement>(null),
        angle4: useRef<HTMLInputElement>(null),
        angle5: useRef<HTMLInputElement>(null),
    };
    const legalDocRef = useRef<HTMLInputElement>(null);

    const updateField = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleFeeCheckbox = (feeKey: keyof FormData["additionalFees"]) => {
        setFormData((prev) => ({
            ...prev,
            additionalFees: {
                ...prev.additionalFees,
                [feeKey]: {
                    ...prev.additionalFees[feeKey],
                    checked: !prev.additionalFees[feeKey].checked,
                    amount: !prev.additionalFees[feeKey].checked ? "" : prev.additionalFees[feeKey].amount,
                },
            },
        }));
    };

    const updateFeeAmount = (feeKey: keyof FormData["additionalFees"], amount: string) => {
        setFormData((prev) => ({
            ...prev,
            additionalFees: {
                ...prev.additionalFees,
                [feeKey]: {
                    ...prev.additionalFees[feeKey],
                    amount,
                },
            },
        }));
    };

    const toggleLifestyleTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            lifestyleExpectations: prev.lifestyleExpectations.includes(tag)
                ? prev.lifestyleExpectations.filter((t) => t !== tag)
                : [...prev.lifestyleExpectations, tag],
        }));
    };

    const handlePhotoUpload = (angleKey: keyof FormData["images"], e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                images: {
                    ...prev.images,
                    [angleKey]: url,
                },
            }));
        }
    };

    const removePhoto = (angleKey: keyof FormData["images"]) => {
        setFormData((prev) => ({
            ...prev,
            images: {
                ...prev.images,
                [angleKey]: "",
            },
        }));
    };

    const handleLegalDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setFormData((prev) => ({
                ...prev,
                legalDocs: [...prev.legalDocs, ...urls],
            }));
        }
    };

    const removeLegalDoc = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            legalDocs: prev.legalDocs.filter((_, idx) => idx !== index),
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

    // Form Validators
    const isStep0Valid = formData.title && formData.location && formData.area;
    const isStep1Valid = formData.rent && formData.electricityPrice && formData.waterPrice;
    const isStep2Valid = formData.images.angle1 && formData.images.angle2 && formData.images.angle3 && formData.images.angle4 && formData.images.angle5;
    
    const isCurrentStepValid = () => {
        if (currentStep === 0) return isStep0Valid;
        if (currentStep === 1) return isStep1Valid;
        if (currentStep === 2) return isStep2Valid;
        return true; // Step 3 & 4 have optional fields
    };

    const variants = {
        enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-28 flex items-center justify-center bg-surface">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass rounded-3xl p-12 text-center max-w-xl mx-4 shadow-2xl border border-white/50 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-accent" />
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                        <Check size={48} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                        {t('postRoom.successTitle')}
                    </h2>
                    <p className="text-text-light mb-8 text-base leading-relaxed">
                        {t('postRoom.successDesc')}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSubmitted(false); setCurrentStep(0); setFormData(initialFormData); }}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold cursor-pointer border-0 shadow-lg shadow-primary/30 transition-all"
                    >
                        {t('postRoom.postAnother')}
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 bg-surface/50 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                {/* Page header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                        <Sparkles size={14} className="animate-spin" /> {t('common.landlord')}
                    </div>
                    <h1 className="text-4xl font-extrabold text-text font-[family-name:var(--font-family-heading)] tracking-tight">
                        {t('postRoom.pageTitle1')} <span className="text-primary">{t('postRoom.pageTitle2')}</span>
                    </h1>
                    <p className="mt-3 text-text-light max-w-2xl text-base">
                        {t('postRoom.pageSubtitle')}
                    </p>
                </motion.div>

                {/* Progress bar */}
                <div className="mb-12 glass rounded-3xl p-6 border border-white/40 shadow-sm">
                    <div className="flex items-center justify-between relative px-2 sm:px-6">
                        {/* Background line */}
                        <div className="absolute top-5 left-10 right-10 h-0.5 bg-border/80 z-0" />
                        <div
                            className="absolute top-5 left-10 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-500 z-0"
                            style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 40px)` }}
                        />

                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const done = i < currentStep;
                            const active = i === currentStep;
                            return (
                                <div key={step.labelKey} className="relative z-10 flex flex-col items-center">
                                    <motion.button
                                        onClick={() => i < currentStep && setCurrentStep(i)}
                                        disabled={i > currentStep}
                                        animate={{
                                            scale: active ? 1.15 : 1,
                                        }}
                                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border cursor-pointer transition-all ${
                                            done
                                                ? "bg-primary text-white border-primary"
                                                : active
                                                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                                                    : "bg-white text-text-muted border-border hover:bg-surface/50"
                                        }`}
                                    >
                                        {done ? (
                                            <Check size={20} className="stroke-[3px]" />
                                        ) : (
                                            <Icon size={18} />
                                        )}
                                    </motion.button>
                                    <span className={`mt-3 text-xs font-semibold hidden sm:inline ${active ? "text-accent" : done ? "text-primary" : "text-text-muted"}`}>
                                        {t(step.labelKey)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form container */}
                <div className="glass-strong rounded-3xl p-6 sm:p-10 min-h-[480px] shadow-xl border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-accent/30" />
                    
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* STEP 0: BASIC INFO */}
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-text flex items-center gap-2 border-b border-border pb-3">
                                        <Home size={24} className="text-primary" />
                                        {t('postRoom.roomDetails')}
                                    </h2>

                                    <div className="grid md:grid-cols-3 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-text mb-2">{t('postRoom.title')} <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder={t('postRoom.titlePlaceholder')}
                                                value={formData.title}
                                                onChange={(e) => updateField("title", e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text mb-2">{t('postRoom.area')} <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                placeholder={t('postRoom.areaPlaceholder')}
                                                value={formData.area}
                                                onChange={(e) => updateField("area", e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">
                                            <MapPin size={16} className="inline mr-1 text-primary" />{t('postRoom.locationLabel')} <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('postRoom.locationPlaceholder')}
                                            value={formData.location}
                                            onChange={(e) => updateField("location", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted transition-all"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-text mb-2">{t('postRoom.roomType')}</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {roomTypes.map((type) => (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => updateField("roomType", type.value)}
                                                        className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                                                            formData.roomType === type.value
                                                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                                                : "bg-white text-text-light border-border hover:bg-primary/5 hover:text-primary"
                                                        }`}
                                                    >
                                                        {t(type.labelKey)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-text mb-2">
                                                    <Users size={16} className="inline mr-1 text-primary" />{t('postRoom.availableSlots')}
                                                </label>
                                                <select
                                                    value={formData.availableSlots}
                                                    onChange={(e) => updateField("availableSlots", e.target.value)}
                                                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-sm text-text cursor-pointer"
                                                >
                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                        <option key={n} value={n}>{n} {n > 1 ? t('postRoom.slots') : t('postRoom.slot')}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-text mb-2">
                                                    <Calendar size={16} className="inline mr-1 text-primary" />{t('postRoom.availableFrom')}
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.moveInDate}
                                                    onChange={(e) => updateField("moveInDate", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 1: PRICING & ADDITIONAL FEES */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-3 flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                                            <PiMoneyWavy size={26} className="text-primary" />
                                            {t('postRoom.pricingTitle')}
                                        </h2>
                                        <span className="text-xs text-text-muted">{t('postRoom.pricingDesc')}</span>
                                    </div>

                                    {/* Rent Price (Mandatory Public) */}
                                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-bl-xl flex items-center gap-1 shadow-sm">
                                            <Check size={12} className="stroke-[3px]" /> {t('postRoom.rentRequired')}
                                        </div>
                                        <label className="block text-sm font-bold text-primary mb-2">
                                            <DollarSign size={16} className="inline mr-0.5" /> {t('postRoom.rent')} <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder={t('postRoom.rentPlaceholder')}
                                            value={formData.rent}
                                            onChange={(e) => updateField("rent", e.target.value)}
                                            className="w-full max-w-md px-4 py-3 rounded-xl border border-primary/30 bg-white text-base font-semibold text-text focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                        <p className="text-xs text-text-light mt-2">{t('postRoom.rentRequiredDesc')}</p>
                                    </div>

                                    {/* Electricity & Water */}
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                                            <label className="block text-sm font-bold text-text mb-2">
                                                <Zap size={16} className="inline mr-1 text-amber-500 fill-amber-500" /> {t('postRoom.electricityLabel')} <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder={t('postRoom.electricityPlaceholder')}
                                                    value={formData.electricityPrice}
                                                    onChange={(e) => updateField("electricityPrice", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface/30 text-sm text-text pr-24"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                                                    {t('postRoom.electricityUnit')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                                            <label className="block text-sm font-bold text-text mb-2">
                                                <Droplet size={16} className="inline mr-1 text-sky-500 fill-sky-500" /> {t('postRoom.waterLabel')} <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder={t('postRoom.waterPlaceholder')}
                                                    value={formData.waterPrice}
                                                    onChange={(e) => updateField("waterPrice", e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface/30 text-sm text-text pr-20"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                                                    {t('postRoom.waterUnit')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional/Extra Costs */}
                                    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
                                        <div>
                                            <h3 className="text-base font-bold text-text">{t('postRoom.additionalFees')}</h3>
                                            <p className="text-xs text-text-light">{t('postRoom.additionalFeesDesc')}</p>
                                        </div>

                                        <div className="space-y-3.5">
                                            {([
                                                { key: "serviceFee", label: t('postRoom.feeService') },
                                                { key: "parkingFee", label: t('postRoom.feeParking') },
                                                { key: "internetFee", label: t('postRoom.feeInternet') },
                                                { key: "cleaningFee", label: t('postRoom.feeCleaning') },
                                                { key: "otherFee", label: t('postRoom.feeOther') },
                                            ] as const).map((fee) => {
                                                const feeData = formData.additionalFees[fee.key];
                                                return (
                                                    <div key={fee.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-surface/50 transition-colors">
                                                        <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-text">
                                                            <input
                                                                type="checkbox"
                                                                checked={feeData.checked}
                                                                onChange={() => toggleFeeCheckbox(fee.key)}
                                                                className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                                                            />
                                                            {fee.label}
                                                        </label>
                                                        {feeData.checked && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="relative w-full sm:w-60"
                                                            >
                                                                <input
                                                                    type="number"
                                                                    placeholder={t('postRoom.feeAmountPlaceholder')}
                                                                    value={feeData.amount}
                                                                    onChange={(e) => updateFeeAmount(fee.key, e.target.value)}
                                                                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-primary bg-white text-text"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-bold">VND/tháng</span>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: PHOTOS & LEGAL DOCS */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-3">
                                        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                                            <Camera size={24} className="text-primary" />
                                            {t('postRoom.photosTitle')}
                                        </h2>
                                        <p className="text-xs text-text-light">{t('postRoom.photosDesc')}</p>
                                    </div>

                                    {/* 5 Required Angle Slots */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {([
                                            { key: "angle1", label: t('postRoom.photoAngle1'), desc: t('postRoom.photoAngle1Desc') },
                                            { key: "angle2", label: t('postRoom.photoAngle2'), desc: t('postRoom.photoAngle2Desc') },
                                            { key: "angle3", label: t('postRoom.photoAngle3'), desc: t('postRoom.photoAngle3Desc') },
                                            { key: "angle4", label: t('postRoom.photoAngle4'), desc: t('postRoom.photoAngle4Desc') },
                                            { key: "angle5", label: t('postRoom.photoAngle5'), desc: t('postRoom.photoAngle5Desc') },
                                        ] as const).map((angle) => {
                                            const photoUrl = formData.images[angle.key];
                                            return (
                                                <div
                                                    key={angle.key}
                                                    className="group relative rounded-xl border border-dashed border-border bg-white p-3 flex flex-col items-center justify-between text-center min-h-[160px] hover:border-primary hover:bg-primary/5 transition-all shadow-sm overflow-hidden"
                                                >
                                                    {photoUrl ? (
                                                        <>
                                                            <img src={photoUrl} alt={angle.label} className="absolute inset-0 w-full h-full object-cover z-0" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => removePhoto(angle.key)}
                                                                    className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white border-0 cursor-pointer shadow"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded py-1 px-1.5 z-20">
                                                                <span className="text-[10px] text-white font-bold block truncate">{angle.label}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                                                <Camera size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-[11px] font-bold text-text block leading-none">{angle.label}</span>
                                                                <span className="text-[9px] text-text-muted leading-tight block px-1">{angle.desc}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => fileInputRefs[angle.key].current?.click()}
                                                                className="mt-3 w-full py-1.5 rounded-lg bg-surface text-[10px] font-bold text-text hover:bg-primary hover:text-white border-0 transition-colors cursor-pointer"
                                                            >
                                                                {t('postRoom.uploadPhoto')}
                                                            </button>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                ref={fileInputRefs[angle.key]}
                                                                onChange={(e) => handlePhotoUpload(angle.key, e)}
                                                                className="hidden"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Upload status message */}
                                    <div className="flex items-center justify-between bg-surface/50 rounded-xl p-3 px-4 text-xs font-semibold text-text">
                                        <span>
                                            {t('postRoom.photosUploaded')}: <strong className="text-primary">{Object.values(formData.images).filter(Boolean).length}/5</strong>
                                        </span>
                                        {!isStep2Valid && (
                                            <span className="text-rose-500 font-bold flex items-center gap-1">
                                                <ShieldAlert size={14} /> {t('postRoom.photosMin')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Legal Documents (Admin Only Verification) */}
                                    <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-base font-bold text-amber-600 flex items-center gap-1.5">
                                                    <Lock size={18} className="fill-amber-500/10 stroke-[2.5px]" />
                                                    {t('postRoom.legalDocsTitle')}
                                                </h3>
                                                <p className="text-xs text-text-light mt-0.5">{t('postRoom.legalDocsDesc')}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-amber-500/20">
                                                <Lock size={10} /> {t('postRoom.legalDocsAdminOnly')}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-amber-700 bg-amber-500/10 p-3 rounded-xl border border-amber-500/15 leading-relaxed">
                                            {t('postRoom.legalDocsPrivacy')}
                                        </p>

                                        {/* File upload selector and previews */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {/* Previews */}
                                            {formData.legalDocs.map((url, index) => (
                                                <div key={index} className="relative aspect-video rounded-xl bg-white border border-border overflow-hidden group shadow-sm">
                                                    <img src={url} alt="LegalDoc" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => removeLegalDoc(index)}
                                                            className="p-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-white border-0 cursor-pointer shadow"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Uploader Card */}
                                            <div
                                                onClick={() => legalDocRef.current?.click()}
                                                className="group aspect-video rounded-xl border-2 border-dashed border-amber-500/30 hover:border-amber-500 bg-white/50 hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm p-3"
                                            >
                                                <Upload size={22} className="text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold text-amber-600">{t('postRoom.uploadDocs')}</span>
                                                <span className="text-[8px] text-text-muted mt-0.5">{formData.legalDocs.length} {t('postRoom.docsUploaded')}</span>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,application/pdf"
                                                ref={legalDocRef}
                                                onChange={handleLegalDocUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: PREFERENCES & LIFESTYLE */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-3">
                                        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                                            <Heart size={24} className="text-secondary" />
                                            {t('postRoom.lifestyleExpectations')}
                                        </h2>
                                        <p className="text-xs text-text-light">{t('postRoom.lifestyleDesc')}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2.5">
                                        {lifestyleOptions.map((tag) => (
                                            <motion.button
                                                key={tag}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => toggleLifestyleTag(tag)}
                                                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                                                    formData.lifestyleExpectations.includes(tag)
                                                        ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/20"
                                                        : "bg-white text-text-light border-border hover:bg-secondary/5 hover:text-secondary"
                                                }`}
                                            >
                                                {t(`lifestyle.${tag}`, tag)}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {formData.lifestyleExpectations.length > 0 && (
                                        <p className="text-[11px] text-text-muted">
                                            {formData.lifestyleExpectations.length} {t('postRoom.selectedTags')}
                                        </p>
                                    )}

                                    {/* Description */}
                                    <div className="space-y-2 mt-6">
                                        <label className="block text-sm font-bold text-text flex items-center gap-1.5">
                                            <FileText size={16} className="text-primary" /> {t('postRoom.description')}
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                            placeholder={t('postRoom.descPlaceholder')}
                                            rows={6}
                                            className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        />
                                        <p className="text-right text-[10px] text-text-muted">{formData.description.length}/500 {t('postRoom.characters')}</p>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: REVIEW & CONFIRM */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-3">
                                        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                                            <Check size={24} className="text-primary" />
                                            {t('postRoom.reviewTitle')}
                                        </h2>
                                        <p className="text-xs text-text-light">{t('postRoom.reviewSubtitle')}</p>
                                    </div>

                                    {/* Detailed breakdown info grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Basic details */}
                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-4">
                                            <h3 className="text-sm font-bold text-primary border-b border-border pb-2 flex items-center gap-1">
                                                <Home size={16} /> {t('postRoom.reviewBasicInfo')}
                                            </h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: t('postRoom.title'), value: formData.title },
                                                    { label: t('postRoom.roomType'), value: formData.roomType },
                                                    { label: t('postRoom.area'), value: `${formData.area} m²` },
                                                    { label: t('postRoom.availableSlots'), value: `${formData.availableSlots} ${formData.availableSlots === "1" ? t('postRoom.slot') : t('postRoom.slots')}` },
                                                    { label: t('postRoom.availableFrom'), value: formData.moveInDate || t('postRoom.notProvided') },
                                                    { label: t('postRoom.locationLabel'), value: formData.location },
                                                ].map((item) => (
                                                    <div key={item.label} className="flex justify-between items-start gap-4 text-xs">
                                                        <span className="text-text-muted">{item.label}</span>
                                                        <span className="font-semibold text-text text-right">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cost details */}
                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-4">
                                            <h3 className="text-sm font-bold text-primary border-b border-border pb-2 flex items-center gap-1">
                                                <PiMoneyWavy size={18} /> {t('postRoom.reviewPricing')}
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs font-bold text-primary py-1 border-b border-primary/10">
                                                    <span>{t('postRoom.rent')}</span>
                                                    <span className="text-sm">{Number(formData.rent).toLocaleString()} VND/tháng</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-text-muted">{t('postRoom.electricityLabel')}</span>
                                                    <span className="font-semibold text-text">{Number(formData.electricityPrice).toLocaleString()} {t('postRoom.electricityUnit')}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-text-muted">{t('postRoom.waterLabel')}</span>
                                                    <span className="font-semibold text-text">{Number(formData.waterPrice).toLocaleString()} {t('postRoom.waterUnit')}</span>
                                                </div>
                                                
                                                {/* Extra service fees */}
                                                {Object.entries(formData.additionalFees).some(([_, f]) => f.checked) && (
                                                    <div className="pt-2 border-t border-border space-y-2">
                                                        <span className="text-[10px] font-bold text-text-light block uppercase tracking-wider">{t('postRoom.additionalFees')}</span>
                                                        {([
                                                            { key: "serviceFee", label: t('postRoom.feeService') },
                                                            { key: "parkingFee", label: t('postRoom.feeParking') },
                                                            { key: "internetFee", label: t('postRoom.feeInternet') },
                                                            { key: "cleaningFee", label: t('postRoom.feeCleaning') },
                                                            { key: "otherFee", label: t('postRoom.feeOther') },
                                                        ] as const).map((fee) => {
                                                            const feeData = formData.additionalFees[fee.key];
                                                            if (!feeData.checked) return null;
                                                            return (
                                                                <div key={fee.key} className="flex justify-between items-center text-xs">
                                                                    <span className="text-text-muted">{fee.label}</span>
                                                                    <span className="font-semibold text-text">+{Number(feeData.amount || 0).toLocaleString()} VND</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Uploaded photos preview list */}
                                    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-3">
                                        <h3 className="text-sm font-bold text-primary border-b border-border pb-2">
                                            {t('postRoom.reviewPhotos')} (5)
                                        </h3>
                                        <div className="grid grid-cols-5 gap-3">
                                            {Object.entries(formData.images).map(([key, url]) => (
                                                <div key={key} className="aspect-video rounded-lg overflow-hidden border border-border bg-surface">
                                                    <img src={url} alt={key} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Admin private files review box */}
                                    <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                <Lock className="text-amber-600 stroke-[2.5px]" size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-700">{t('postRoom.reviewLegalDocs')}</h4>
                                                <p className="text-[10px] text-amber-600/90 mt-0.5">{formData.legalDocs.length} {t('postRoom.docsUploaded')}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                                            <Lock size={10} /> {t('postRoom.securityLocked')}
                                        </span>
                                    </div>

                                    {/* Lifestyle expectations */}
                                    {formData.lifestyleExpectations.length > 0 && (
                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-3">
                                            <span className="text-xs font-bold text-text-light block">{t('postRoom.reviewLifestyle')}</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {formData.lifestyleExpectations.map((tag) => (
                                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary">
                                                        {t(`lifestyle.${tag}`, tag)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description review */}
                                    {formData.description && (
                                        <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-2">
                                            <span className="text-xs font-bold text-text-light block">{t('postRoom.reviewDescription')}</span>
                                            <p className="text-xs text-text leading-relaxed bg-surface/30 p-4 rounded-xl border border-border/50 whitespace-pre-line">
                                                {formData.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={prev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all border cursor-pointer ${
                            currentStep === 0
                                ? "bg-white/40 text-text-muted border-border cursor-not-allowed"
                                : "bg-white text-text border-border hover:bg-surface shadow-sm"
                        }`}
                    >
                        <ChevronLeft size={16} />
                        {t('common.previous')}
                    </motion.button>

                    {currentStep < steps.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={next}
                            disabled={!isCurrentStepValid()}
                            className={`btn-glow flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm border-0 transition-all cursor-pointer ${
                                isCurrentStepValid()
                                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                                    : "bg-text-muted/20 text-text-muted cursor-not-allowed"
                            }`}
                        >
                            {t('common.next')}
                            <ChevronRight size={16} />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className="btn-glow flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-bold text-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 cursor-pointer border-0 transition-all"
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
