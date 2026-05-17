import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Sparkles, X, RotateCcw } from "lucide-react";
import { getRoommates, getConversations } from "../services";
import { LIFESTYLE_OPTIONS as lifestyleOptions } from "../lib/constants";
import type { Roommate, Conversation } from "../types";
import SocialMatchCard from "../components/SocialMatchCard";
import ChatPanel from "../components/ChatPanel";

/* ─── Filters Interface ─── */
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

const SLEEP_OPTIONS = ["All", "Early Bird", "Moderate", "Night Owl"];
const CLEAN_OPTIONS = ["All", "Very Clean", "Clean", "Moderate"];
const SMOKING_OPTIONS = ["All", "No", "Yes"];
const GENDER_OPTIONS = ["All", "Male", "Female", "Non-binary"];

export default function ViewAllMatchesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConvoId, setChatConvoId] = useState<string | undefined>();
  const [allRoommates, setAllRoommates] = useState<Roommate[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);

  // Popover States
  const [activePopover, setActivePopover] = useState<string | null>(null);

  useEffect(() => {
    getRoommates().then(setAllRoommates);
    getConversations().then(setAllConversations);
  }, []);

  const filtered = useMemo(() => {
    return allRoommates.filter((r) => {
      if (filters.gender !== "All" && r.gender !== filters.gender) return false;
      if (filters.sleepSchedule !== "All" && !r.preferences.sleepSchedule.includes(filters.sleepSchedule)) return false;
      if (filters.cleanliness !== "All" && r.preferences.cleanliness !== filters.cleanliness) return false;
      if (filters.smoking !== "All" && r.preferences.smoking !== (filters.smoking === "Yes" ? "Yes" : "No")) return false;
      if (filters.lifestyle.length > 0 && !filters.lifestyle.some((t) => r.lifestyleTags.includes(t))) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.bio.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.compatibility - a.compatibility);
  }, [filters, allRoommates]);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => new Set(prev).add(id));
    const existingConvo = allConversations.find((c) => c.participantId === id);
    setChatConvoId(existingConvo?.id || "c1");
    setTimeout(() => setChatOpen(true), 400);
  };
  const handleMessage = (id: string) => {
    const existingConvo = allConversations.find((c) => c.participantId === id);
    setChatConvoId(existingConvo?.id || "c1");
    setChatOpen(true);
  };

  const toggleLifestyle = (tag: string) => {
    setFilters((p) => ({
      ...p,
      lifestyle: p.lifestyle.includes(tag) ? p.lifestyle.filter((t) => t !== tag) : [...p.lifestyle, tag],
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  /* Popover Component */
  const FilterPopover = ({ label, id, children }: { label: string, id: string, children: React.ReactNode }) => {
    const isOpen = activePopover === id;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setActivePopover(null);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setActivePopover(isOpen ? null : id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
            isOpen || (id !== 'lifestyle' && (filters[id as keyof Filters] !== 'All')) || (id === 'lifestyle' && filters.lifestyle.length > 0)
            ? "bg-primary/10 border-primary text-primary"
            : "bg-white border-border text-text-secondary hover:border-primary/40"
          }`}
        >
          {label}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 top-full mt-2 bg-white border border-border rounded-xl shadow-xl z-50 p-4 min-w-[200px]"
            >
                <div className="flex flex-col gap-1">
                    {children}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header: Social Discovery Focus */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary uppercase font-tag font-bold tracking-[0.1em]">
            <Sparkles size={14} />
            Khám phá đối tác lý tưởng
          </div>
          <h1 className="font-display text-text-primary uppercase tracking-tight">
            Kết Nối <span className="text-primary font-black">Tốt Nhất</span>
          </h1>
          <p className="font-body text-text-secondary max-w-2xl mx-auto">
            Không chỉ là tìm chỗ ở, chúng tôi kết nối bạn với những người bạn cùng phòng có lối sống tương đồng nhất.
          </p>
        </div>

        {/* Horizontal Filter Bar & Feed Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12 bg-white p-4 rounded-full border border-border shadow-sm">
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" />
            <input
              type="text"
              placeholder="Tìm kiếm bạn ghép..."
              value={filters.search}
              onChange={(e) => setFilters(p => ({...p, search: e.target.value}))}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface border-0 focus:ring-2 focus:ring-primary/20 outline-none font-body text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            <FilterPopover label="Giới tính" id="gender">
              {GENDER_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => {setFilters(p => ({...p, gender: g})); setActivePopover(null);}}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface border-0 cursor-pointer ${filters.gender === g ? 'text-primary' : 'text-text-secondary'}`}
                >
                  {t(`matchesPage.${g === 'All' ? 'all' : g.toLowerCase()}`, g)}
                  {filters.gender === g && " ✓"}
                </button>
              ))}
            </FilterPopover>

            <FilterPopover label="Lịch ngủ" id="sleepSchedule">
              {SLEEP_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => {setFilters(p => ({...p, sleepSchedule: s})); setActivePopover(null);}}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface border-0 cursor-pointer ${filters.sleepSchedule === s ? 'text-primary' : 'text-text-secondary'}`}
                >
                  {s}
                  {filters.sleepSchedule === s && " ✓"}
                </button>
              ))}
            </FilterPopover>

            <FilterPopover label="Vệ sinh" id="cleanliness">
              {CLEAN_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => {setFilters(p => ({...p, cleanliness: c})); setActivePopover(null);}}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface border-0 cursor-pointer ${filters.cleanliness === c ? 'text-primary' : 'text-text-secondary'}`}
                >
                  {c}
                  {filters.cleanliness === c && " ✓"}
                </button>
              ))}
            </FilterPopover>

            <FilterPopover label="Hút thuốc" id="smoking">
              {SMOKING_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => {setFilters(p => ({...p, smoking: s})); setActivePopover(null);}}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface border-0 cursor-pointer ${filters.smoking === s ? 'text-primary' : 'text-text-secondary'}`}
                >
                  {s}
                  {filters.smoking === s && " ✓"}
                </button>
              ))}
            </FilterPopover>

            <FilterPopover label="Lối sống" id="lifestyle">
              <div className="grid grid-cols-2 gap-1 w-64">
                {lifestyleOptions.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleLifestyle(tag)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-surface border-0 cursor-pointer ${filters.lifestyle.includes(tag) ? 'bg-primary/10 text-primary' : 'text-text-secondary'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </FilterPopover>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-rose-500 hover:bg-rose-50 border-0 cursor-pointer transition-all"
            >
              <RotateCcw size={14} />
              ĐẶT LẠI
            </button>
          </div>
        </div>

        {/* 3-Column Grid for Discovery Feed */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="font-tag text-text-secondary font-bold uppercase tracking-widest">{filtered.length} kết quả phù hợp</span>
            <div className="h-px bg-border/40 flex-1 ml-6" />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-cards border border-border p-20 text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-primary/40" />
              </div>
              <h3 className="font-h3 text-text-primary">Không có kết quả nào</h3>
              <p className="font-body text-text-secondary mt-2">Hãy thử nới lỏng các bộ lọc của bạn.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((rm, i) => (
                <SocialMatchCard
                  key={rm.id}
                  roommate={rm}
                  index={i}
                  connected={connectedIds.has(rm.id)}
                  onConnect={handleConnect}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} initialConversationId={chatConvoId} />
    </div>
  );
}
