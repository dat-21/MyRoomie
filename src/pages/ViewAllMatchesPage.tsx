import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Search, MessageCircle, UserPlus, Check } from "lucide-react";
import { roommates, lifestyleOptions, formatCurrency } from "../data/mockData";
import RoommateCard from "../components/RoommateCard";
import ChatPanel from "../components/ChatPanel";

/* ─── Filters ─── */
interface Filters {
    lifestyle: string[];
    sleepSchedule: string;
    cleanliness: string;
    smoking: string;
    gender: string;
    search: string;
}

const defaultFilters: Filters = {
    lifestyle: [],
    sleepSchedule: "All",
    cleanliness: "All",
    smoking: "All",
    gender: "All",
    search: "",
};

type SortOption = "compatibility" | "budget-low" | "budget-high" | "date";

const sleepOptions = ["All", "Early Bird", "Moderate", "Night Owl"];
const cleanlinessOptions = ["All", "Very Clean", "Clean", "Moderate"];
const smokingOptions = ["All", "No", "Yes"];
const genderOptions = ["All", "Male", "Female", "Non-binary"];

export default function ViewAllMatchesPage() {
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>("compatibility");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
    const [chatOpen, setChatOpen] = useState(false);
    const [chatConvoId, setChatConvoId] = useState<string | undefined>();

    const filtered = useMemo(() => {
        let list = roommates.filter((r) => {
            if (filters.gender !== "All" && r.gender !== filters.gender) return false;
            if (filters.sleepSchedule !== "All" && !r.preferences.sleepSchedule.includes(filters.sleepSchedule)) return false;
            if (filters.cleanliness !== "All" && r.preferences.cleanliness !== filters.cleanliness) return false;
            if (filters.smoking !== "All" && r.preferences.smoking !== (filters.smoking === "Yes" ? "Yes" : "No")) return false;
            if (filters.lifestyle.length > 0 && !filters.lifestyle.some((t) => r.lifestyleTags.includes(t))) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!r.name.toLowerCase().includes(q) && !r.bio.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
            }
            return true;
        });

        switch (sortBy) {
            case "compatibility": list.sort((a, b) => b.compatibility - a.compatibility); break;
            case "budget-low": list.sort((a, b) => a.budget.min - b.budget.min); break;
            case "budget-high": list.sort((a, b) => b.budget.max - a.budget.max); break;
            case "date": list.sort((a, b) => new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime()); break;
        }
        return list;
    }, [filters, sortBy]);

    const toggleLifestyle = (tag: string) => {
        setFilters((p) => ({
            ...p,
            lifestyle: p.lifestyle.includes(tag) ? p.lifestyle.filter((t) => t !== tag) : [...p.lifestyle, tag],
        }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    const handleConnect = (id: string) => {
        setConnectedIds((prev) => new Set(prev).add(id));
    };

    const handleMessage = (id: string) => {
        setChatConvoId("c1"); // In real app, create/find conversation for this user
        setChatOpen(true);
    };

    const FilterContent = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={resetFilters} className="text-xs text-primary font-medium cursor-pointer bg-transparent border-0 hover:underline">Reset</button>
            </div>

            {/* Gender */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Gender</label>
                <div className="flex flex-wrap gap-2">
                    {genderOptions.map((g) => (
                        <button
                            key={g}
                            onClick={() => setFilters((p) => ({ ...p, gender: g }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.gender === g ? "bg-primary text-white border-primary" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sleep Schedule */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Sleep Schedule</label>
                <div className="flex flex-wrap gap-2">
                    {sleepOptions.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilters((p) => ({ ...p, sleepSchedule: s }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.sleepSchedule === s ? "bg-primary text-white border-primary" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cleanliness */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Cleanliness</label>
                <div className="flex flex-wrap gap-2">
                    {cleanlinessOptions.map((c) => (
                        <button
                            key={c}
                            onClick={() => setFilters((p) => ({ ...p, cleanliness: c }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.cleanliness === c ? "bg-primary text-white border-primary" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Smoking */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Smoking</label>
                <div className="flex flex-wrap gap-2">
                    {smokingOptions.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilters((p) => ({ ...p, smoking: s }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.smoking === s ? "bg-primary text-white border-primary" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lifestyle Tags */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Lifestyle</label>
                <div className="flex flex-wrap gap-2">
                    {lifestyleOptions.slice(0, 12).map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleLifestyle(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.lifestyle.includes(tag) ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                        Best <span className="text-secondary">Matches</span>
                    </h1>
                    <p className="text-text-light mt-2">Find roommates who share your lifestyle</p>
                </motion.div>

                {/* Search & Sort */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search matches..."
                            value={filters.search}
                            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-0"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-2.5 rounded-xl glass text-sm text-text cursor-pointer border-0 focus:outline-none"
                        >
                            <option value="compatibility">Best Match</option>
                            <option value="budget-low">Lowest Budget</option>
                            <option value="budget-high">Highest Budget</option>
                            <option value="date">Move-in Date</option>
                        </select>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-text cursor-pointer border-0"
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="glass rounded-2xl p-5 sticky top-24">
                            <FilterContent />
                        </div>
                    </div>

                    {/* Mobile Sidebar */}
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
                                <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
                                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl overflow-y-auto">
                                    <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer border-0 bg-transparent">
                                        <X size={18} />
                                    </button>
                                    <FilterContent />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid */}
                    <div className="flex-1">
                        <p className="text-sm text-text-muted mb-4">{filtered.length} matches found</p>
                        {filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-semibold text-text mb-2">No matches found</h3>
                                <p className="text-sm text-text-muted">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filtered.map((rm, i) => (
                                    <div key={rm.id} className="relative">
                                        <RoommateCard roommate={rm} index={i} />
                                        {/* Connect/Message overlay */}
                                        <div className="flex gap-2 mt-2">
                                            {connectedIds.has(rm.id) ? (
                                                <>
                                                    <span className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/10 text-secondary text-xs font-medium">
                                                        <Check size={14} /> Connected
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleMessage(rm.id)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs font-medium cursor-pointer border-0 btn-glow"
                                                    >
                                                        <MessageCircle size={14} /> Message
                                                    </motion.button>
                                                </>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleConnect(rm.id)}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-light text-white text-xs font-medium cursor-pointer border-0 btn-glow"
                                                >
                                                    <UserPlus size={14} /> Connect
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Panel */}
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} initialConversationId={chatConvoId} />
        </div>
    );
}
