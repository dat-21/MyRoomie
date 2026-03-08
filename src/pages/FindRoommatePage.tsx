import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    SlidersHorizontal,
    X,
    ChevronDown,
    ChevronUp,
    ArrowUpDown,
    Search,
} from "lucide-react";
import { roommates, lifestyleOptions, formatCurrency } from "../data/mockData";
import RoommateCard from "../components/RoommateCard";
import SkeletonCards from "../components/SkeletonCards";
import EmptyState from "../components/EmptyState";

/* ─── Filters ─── */
interface Filters {
    budgetMin: number;
    budgetMax: number;
    gender: string;
    moveInDate: string;
    lifestyleTags: string[];
    search: string;
}

const defaultFilters: Filters = {
    budgetMin: 0,
    budgetMax: 10000000,
    gender: "All",
    moveInDate: "",
    lifestyleTags: [],
    search: "",
};

type SortOption = "compatibility" | "budget-low" | "budget-high" | "date";

export default function FindRoommatePage() {
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>("compatibility");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lifestyleExpanded, setLifestyleExpanded] = useState(false);
    const { t } = useTranslation();

    // Simulate loading
    useState(() => {
        const t = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(t);
    });

    const filtered = useMemo(() => {
        let list = roommates.filter((r) => {
            if (filters.gender !== "All" && r.gender !== filters.gender) return false;
            if (r.budget.min < filters.budgetMin || r.budget.max > filters.budgetMax) return false;
            if (filters.moveInDate && r.moveInDate > filters.moveInDate) return false;
            if (filters.lifestyleTags.length > 0 && !filters.lifestyleTags.some((t) => r.lifestyleTags.includes(t))) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!r.name.toLowerCase().includes(q) && !r.bio.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
            }
            return true;
        });

        switch (sortBy) {
            case "compatibility":
                list.sort((a, b) => b.compatibility - a.compatibility);
                break;
            case "budget-low":
                list.sort((a, b) => a.budget.min - b.budget.min);
                break;
            case "budget-high":
                list.sort((a, b) => b.budget.max - a.budget.max);
                break;
            case "date":
                list.sort((a, b) => new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime());
                break;
        }

        return list;
    }, [filters, sortBy]);

    const toggleTag = (tag: string) => {
        setFilters((prev) => ({
            ...prev,
            lifestyleTags: prev.lifestyleTags.includes(tag)
                ? prev.lifestyleTags.filter((t) => t !== tag)
                : [...prev.lifestyleTags, tag],
        }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    const displayedLifestyles = lifestyleExpanded ? lifestyleOptions : lifestyleOptions.slice(0, 8);

    /* ─── Sidebar ─── */
    const FilterSidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <div className={`space-y-6 ${mobile ? "" : ""}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    {t('common.filters')}
                </h3>
                <button onClick={resetFilters} className="text-xs text-accent hover:text-accent-dark transition-colors cursor-pointer bg-transparent border-0 font-medium">
                    {t('common.resetAll')}
                </button>
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-medium text-text mb-2">{t('findPage.genderPreference')}</label>
                <div className="grid grid-cols-3 gap-2">
                    {["All", "Male", "Female"].map((g) => (
                        <button
                            key={g}
                            onClick={() => setFilters((p) => ({ ...p, gender: g }))}
                            className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-0 ${filters.gender === g
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-white/60 text-text-light hover:bg-primary/10"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget */}
            <div>
                <label className="block text-sm font-medium text-text mb-2">{t('findPage.budgetRange')}</label>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Min</span>
                            <span>{formatCurrency(filters.budgetMin)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={10000000}
                            step={500000}
                            value={filters.budgetMin}
                            onChange={(e) => setFilters((p) => ({ ...p, budgetMin: Number(e.target.value) }))}
                            className="w-full accent-primary"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Max</span>
                            <span>{formatCurrency(filters.budgetMax)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={10000000}
                            step={500000}
                            value={filters.budgetMax}
                            onChange={(e) => setFilters((p) => ({ ...p, budgetMax: Number(e.target.value) }))}
                            className="w-full accent-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Move-in date */}
            <div>
                <label className="block text-sm font-medium text-text mb-2">{t('findPage.moveInBefore')}</label>
                <input
                    type="date"
                    value={filters.moveInDate}
                    onChange={(e) => setFilters((p) => ({ ...p, moveInDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            {/* Lifestyle Tags */}
            <div>
                <label className="block text-sm font-medium text-text mb-2">{t('findPage.lifestyle')}</label>
                <div className="flex flex-wrap gap-2">
                    {displayedLifestyles.map((tag) => (
                        <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border-0 ${filters.lifestyleTags.includes(tag)
                                ? "bg-secondary text-white shadow-md shadow-secondary/20"
                                : "bg-white/60 text-text-light hover:bg-secondary/10"
                                }`}
                        >
                            {tag}
                        </motion.button>
                    ))}
                </div>
                {lifestyleOptions.length > 8 && (
                    <button
                        onClick={() => setLifestyleExpanded(!lifestyleExpanded)}
                        className="flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary-dark transition-colors cursor-pointer bg-transparent border-0"
                    >
                        {lifestyleExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {lifestyleExpanded ? t('common.showLess') : `${t('common.showAll')} (${lifestyleOptions.length})`}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        {t('findPage.title1')} <span className="text-primary">{t('findPage.title2')}</span>
                    </h1>
                    <p className="mt-2 text-text-light">
                        {t('findPage.subtitle')}
                    </p>
                </motion.div>

                {/* Search & Sort Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t('findPage.searchPlaceholder')}
                            value={filters.search}
                            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={16} className="text-text-muted" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-3 py-2.5 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                            >
                                <option value="compatibility">{t('findPage.sortCompatibility')}</option>
                                <option value="budget-low">{t('findPage.sortBudgetLow')}</option>
                                <option value="budget-high">{t('findPage.sortBudgetHigh')}</option>
                                <option value="date">{t('findPage.sortDate')}</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium cursor-pointer border-0"
                        >
                            <SlidersHorizontal size={16} />
                            {t('common.filters')}
                        </button>
                    </div>
                </motion.div>

                {/* Active filters */}
                <AnimatePresence>
                    {(filters.gender !== "All" || filters.lifestyleTags.length > 0 || filters.moveInDate) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap items-center gap-2 mb-4"
                        >
                            <span className="text-xs text-text-muted">{t('findPage.active')}</span>
                            {filters.gender !== "All" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                    {filters.gender}
                                    <X size={12} className="cursor-pointer" onClick={() => setFilters((p) => ({ ...p, gender: "All" }))} />
                                </span>
                            )}
                            {filters.lifestyleTags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                                    {tag}
                                    <X size={12} className="cursor-pointer" onClick={() => toggleTag(tag)} />
                                </span>
                            ))}
                            {filters.moveInDate && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs">
                                    {t('findPage.before')} {filters.moveInDate}
                                    <X size={12} className="cursor-pointer" onClick={() => setFilters((p) => ({ ...p, moveInDate: "" }))} />
                                </span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main layout */}
                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block w-72 flex-shrink-0"
                    >
                        <div className="glass rounded-2xl p-6 sticky top-24">
                            <FilterSidebar />
                        </div>
                    </motion.aside>

                    {/* Cards grid */}
                    <div className="flex-1">
                        <div className="text-sm text-text-muted mb-4">
                            {loading ? "Loading..." : `${filtered.length} roommate${filtered.length !== 1 ? "s" : ""} found`}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {loading ? (
                                <SkeletonCards count={4} />
                            ) : filtered.length > 0 ? (
                                filtered.map((r, i) => (
                                    <RoommateCard key={r.id} roommate={r} index={i} />
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar drawer */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/30 z-50"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-bg z-50 overflow-y-auto p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">Filters</h3>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer bg-transparent border-0 text-text"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <FilterSidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
