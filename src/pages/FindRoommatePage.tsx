import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Search, ChevronDown, Filter, UserCheck, Calendar, Wallet, MapPin, Briefcase, Clock, Heart, Star } from "lucide-react";
import { getRoommates } from "../services";
import { LIFESTYLE_OPTIONS as lifestyleOptions } from "../lib/constants";
import type { Roommate } from "../types";
import RoommateCard from "../components/RoommateCard";

/* ─── Filters Interface ─── */
interface Filters {
  budgetMin: number;
  budgetMax: number;
  gender: string;
  ageMin: number;
  ageMax: number;
  occupations: string[];
  districts: string[];
  moveInBefore: string;
  minDuration: string;
  lifestyleTags: string[];
  habits: string[];
  minCompatibility: number;
  search: string;
}

const defaultFilters: Filters = {
  budgetMin: 0,
  budgetMax: 10000000,
  gender: "All",
  ageMin: 18,
  ageMax: 40,
  occupations: [],
  districts: [],
  moveInBefore: "",
  minDuration: "All",
  lifestyleTags: [],
  habits: [],
  minCompatibility: 50,
  search: "",
};

type SortOption = "compatibility" | "budget-low" | "budget-high" | "date";

const OCCUPATIONS = ["Sinh viên", "Đi làm", "Freelancer", "Giáo viên", "Kỹ sư", "Thiết kế", "Marketing", "Khác"];
const DISTRICTS = ["Hải Châu", "Sơn Trà", "Ngũ Hành Sơn", "Thanh Khê", "Cẩm Lệ", "Liên Chiểu", "Hòa Vang"];
const DURATIONS = ["1 tháng", "3 tháng", "6 tháng", "1 năm+"];
const HABITS = ["Nấu ăn ở nhà", "Đặt đồ ăn", "Có thú cưng", "Không thú cưng", "Học khuya", "Tiệc tùng thỉnh thoảng", "Không tiệc"];

export default function FindRoommatePage() {
  const [roommateType, setRoommateType] = useState<"HAS_ROOM" | "NEEDS_ROOM">("HAS_ROOM");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("compatibility");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lifestyleExpanded, setLifestyleExpanded] = useState(true);
  const [allRoommates, setAllRoommates] = useState<Roommate[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getRoommates().then((data) => {
      setAllRoommates(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = allRoommates.filter((r) => {
      // Filter by selected tab type: we look for someone who has what we DON'T have
      // If we "HAS_ROOM", we look for "NEEDS_ROOM"
      if (r.status !== (roommateType === "HAS_ROOM" ? "NEEDS_ROOM" : "HAS_ROOM")) return false;

      // Basic Filters
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.bio.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
      }
      if (filters.gender !== "All" && r.gender !== filters.gender) return false;
      if (r.budget.max < filters.budgetMin || r.budget.max > filters.budgetMax) return false;
      if (r.age < filters.ageMin || r.age > filters.ageMax) return false;
      if (r.compatibility < filters.minCompatibility) return false;

      // Advanced Filters
      if (filters.lifestyleTags.length > 0 && !filters.lifestyleTags.some(tag => r.lifestyleTags.includes(tag))) return false;
      if (filters.occupations.length > 0 && !filters.occupations.includes(r.occupation)) return false;
      // Note: Districts/MoveIn/Duration/Habits would need real data fields in mockData.ts
      // For this redesign demo, we'll keep the UI functional even if mapping is partial

      return true;
    });

    switch (sortBy) {
      case "compatibility": list.sort((a, b) => b.compatibility - a.compatibility); break;
      case "budget-low": list.sort((a, b) => a.budget.max - b.budget.max); break;
      case "budget-high": list.sort((a, b) => b.budget.max - a.budget.max); break;
      case "date": list.sort((a, b) => new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime()); break;
    }

    return list;
  }, [filters, sortBy, roommateType]);

  const toggleFilterItem = (category: keyof Filters, item: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      return {
        ...prev,
        [category]: current.includes(item) ? current.filter(i => i !== item) : [...current, item]
      };
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  /* ─── Sidebar Content (Filter Panel) ─── */
  const FilterContent = () => (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="font-h3 text-text-primary flex items-center gap-2">
          <Filter size={18} />
          BỘ LỌC
        </h3>
        <button onClick={resetFilters} className="font-tag text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">
          ĐẶT LẠI
        </button>
      </div>

      {/* 1. KHOẢNG NGÂN SÁCH */}
      <div className="space-y-4">
        <label className="filter-section-header">KHOẢNG NGÂN SÁCH</label>
        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <span className="font-tag text-text-secondary">Tối thiểu</span>
              <input 
                type="number" 
                value={filters.budgetMin}
                onChange={e => setFilters(p => ({...p, budgetMin: Number(e.target.value)}))}
                className="w-full p-2 bg-white border border-border rounded-lg font-body text-text-primary"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="font-tag text-text-secondary">Tối đa</span>
              <input 
                type="number"
                value={filters.budgetMax}
                onChange={e => setFilters(p => ({...p, budgetMax: Number(e.target.value)}))}
                className="w-full p-2 bg-white border border-border rounded-lg font-body text-text-primary"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10000000"
            step="500000"
            value={filters.budgetMax}
            onChange={(e) => setFilters((p) => ({ ...p, budgetMax: parseInt(e.target.value) }))}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
          <p className="font-caption text-text-secondary text-right">
            {filters.budgetMin.toLocaleString()}đ – {filters.budgetMax.toLocaleString()}đ
          </p>
        </div>
      </div>

      {/* 2. GIỚI TÍNH */}
      <div className="space-y-4">
        <label className="filter-section-header">GIỚI TÍNH</label>
        <div className="flex p-1 bg-white border border-border rounded-full">
          {["All", "Male", "Female"].map((g) => (
            <button
              key={g}
              onClick={() => setFilters((p) => ({ ...p, gender: g }))}
              className={`flex-1 py-1.5 rounded-full font-tag font-bold transition-all border-0 cursor-pointer ${
                filters.gender === g ? "bg-primary text-white shadow-sm" : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {g === "All" ? "Tất cả" : g === "Male" ? "Nam" : "Nữ"}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ĐỘ TUỔI */}
      <div className="space-y-4">
        <label className="filter-section-header">ĐỘ TUỔI</label>
        <div className="space-y-2">
           <input
            type="range"
            min="18"
            max="60"
            value={filters.ageMax}
            onChange={(e) => setFilters((p) => ({ ...p, ageMax: parseInt(e.target.value) }))}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
          <p className="font-caption text-text-secondary text-center font-semibold">
            {filters.ageMin} – {filters.ageMax} tuổi
          </p>
        </div>
      </div>

      {/* 4. NGHỀ NGHIỆP / HỌC VẤN */}
      <div className="space-y-4">
        <label className="filter-section-header">NGHỀ NGHIỆP / HỌC VẤN</label>
        <div className="flex flex-wrap gap-2">
          {OCCUPATIONS.map(occ => (
            <button
              key={occ}
              onClick={() => toggleFilterItem('occupations', occ)}
              className={`font-tag px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                filters.occupations.includes(occ) ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* 5. KHU VỰC / VỊ TRÍ */}
      <div className="space-y-4">
        <label className="filter-section-header">KHU VỰC / VỊ TRÍ</label>
        <div className="flex flex-wrap gap-2">
          {DISTRICTS.map(d => (
            <button
              key={d}
              onClick={() => toggleFilterItem('districts', d)}
              className={`font-tag px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                filters.districts.includes(d) ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 6. CHUYỂN VÀO TRƯỚC */}
      <div className="space-y-4">
        <label className="filter-section-header">CHUYỂN VÀO TRƯỚC</label>
        <div className="relative">
          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="date"
            value={filters.moveInBefore}
            onChange={e => setFilters(p => ({...p, moveInBefore: e.target.value}))}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg font-caption text-text-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

       {/* 7. THỜI GIAN THUÊ TỐI THIỂU */}
       <div className="space-y-4">
        <label className="filter-section-header">THỜI GIAN THUÊ TỐI THIỂU</label>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map(dur => (
            <button
              key={dur}
              onClick={() => setFilters(p => ({...p, minDuration: dur}))}
              className={`font-tag px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                filters.minDuration === dur ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* 8. LỐI SỐNG (Expanded Accordion) */}
      <div className="space-y-4">
        <button 
          onClick={() => setLifestyleExpanded(!lifestyleExpanded)}
          className="w-full flex items-center justify-between group cursor-pointer border-0 bg-transparent p-0"
        >
          <label className="filter-section-header cursor-pointer group-hover:text-primary transition-colors">LỐI SỐNG</label>
          <ChevronDown size={14} className={`text-text-secondary transition-transform ${lifestyleExpanded ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {lifestyleExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
               <div className="flex flex-wrap gap-1.5 pt-2">
                {lifestyleOptions.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleFilterItem('lifestyleTags', tag)}
                    className={`font-tag px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                      filters.lifestyleTags.includes(tag) ? "bg-primary text-white border-primary" : "bg-gray-100/50 text-text-secondary border-transparent hover:border-primary/20"
                    }`}
                  >
                    {t(`lifestyle.${tag}`, tag)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 9. THÓI QUEN */}
      <div className="space-y-4">
        <label className="filter-section-header">THÓI QUEN</label>
        <div className="flex flex-wrap gap-2">
          {HABITS.map(h => (
            <button
              key={h}
              onClick={() => toggleFilterItem('habits', h)}
              className={`font-tag px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                filters.habits.includes(h) ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* 10. ĐỘ TƯƠNG THÍCH TỐI THIỂU */}
      <div className="space-y-4">
        <label className="filter-section-header">ĐỘ TƯƠNG THÍCH TỐI THIỂU</label>
        <div className="space-y-3">
           <input
            type="range"
            min="50"
            max="100"
            value={filters.minCompatibility}
            onChange={(e) => setFilters((p) => ({ ...p, minCompatibility: parseInt(e.target.value) }))}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
          <p className="font-caption text-text-secondary font-bold">
            Chỉ hiển thị người có độ phù hợp ≥ {filters.minCompatibility}%
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="font-display text-text-primary uppercase tracking-tight">Tìm người ở ghép</h1>
              <p className="font-body text-text-secondary max-w-xl">
                Khám phá những người bạn cùng phòng lý tưởng dựa trên sở thích và phong cách sống của bạn.
              </p>
            </div>

            {/* Segmented Control Toggle */}
            <div className="flex p-1 bg-white border border-border rounded-full w-full md:w-80 shadow-sm relative z-10">
              <button
                onClick={() => setRoommateType("HAS_ROOM")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-tag font-bold transition-all border-0 cursor-pointer ${
                  roommateType === "HAS_ROOM" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <UserCheck size={16} />
                ĐÃ CÓ PHÒNG
              </button>
              <button
                onClick={() => setRoommateType("NEEDS_ROOM")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-tag font-bold transition-all border-0 cursor-pointer ${
                  roommateType === "NEEDS_ROOM" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <Search size={16} />
                ĐANG TÌM PHÒNG
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: expanded with categories */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-[#F8FAFA] rounded-filter-panel border border-border p-6 sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">
              <FilterContent />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" />
                <input
                  type="text"
                  placeholder={t('findPage.searchPlaceholder')}
                  className="w-full pl-12 pr-6 py-4 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body text-text-primary"
                  value={filters.search}
                  onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                />
              </div>
              <div className="flex gap-3">
                <select 
                  className="px-6 py-4 rounded-xl bg-white border border-border font-body text-text-primary outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="compatibility">Độ tương thích</option>
                  <option value="budget-low">Ngân sách thấp</option>
                  <option value="budget-high">Ngân sách cao</option>
                  <option value="date">Ngày chuyển vào</option>
                </select>
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-4 rounded-xl bg-white border border-border text-text-primary hover:bg-gray-50 cursor-pointer">
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Listing Grid: 2-column consistent */}
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[480px] rounded-cards skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filtered.map((roommate, idx) => (
                    <RoommateCard key={roommate.id} roommate={roommate} index={idx} />
                  ))}
                </AnimatePresence>
                
                {filtered.length === 0 && (
                  <div className="col-span-full py-24 flex flex-col items-center text-center bg-white rounded-cards border border-border border-dashed">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-text-secondary">
                      <Search size={24} />
                    </div>
                    <h3 className="font-h3 text-text-primary">Không tìm thấy bạn cùng phòng</h3>
                    <p className="font-body text-text-secondary mt-2 max-w-xs mx-auto">Hãy thử thay đổi tiêu chí tìm kiếm hoặc đặt lại bộ lọc.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

       {/* Mobile Sidebar Overlay */}
       <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] p-8 lg:hidden shadow-2xl overflow-y-auto">
              <div className="flex justify-end mb-6">
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl bg-gray-100 text-text-secondary cursor-pointer border-0">
                  <X size={20} />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
