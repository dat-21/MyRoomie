import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, SlidersHorizontal, X, ArrowUpDown, Search, Bed, Bath, Maximize, Star, BadgeCheck } from "lucide-react";
import { rooms, formatCurrency } from "../data/mockData";
import type { RoomListing } from "../data/mockData";
import MatchCircle from "../components/MatchCircle";
import Modal from "../components/Modal";
import RoomDetailContent from "../components/RoomDetailContent";
import { useInView } from "../hooks/useInView";

/* ─── Filters ─── */
interface Filters {
    budgetMin: number;
    budgetMax: number;
    distance: number;
    amenities: string[];
    moveInDate: string;
    roomType: string;
    search: string;
}

const defaultFilters: Filters = {
    budgetMin: 0,
    budgetMax: 15000000,
    distance: 10,
    amenities: [],
    moveInDate: "",
    roomType: "All",
    search: "",
};

type SortOption = "match" | "nearest" | "lowest" | "highest" | "rating";

const amenityOptions = ["WiFi", "Air conditioning", "Kitchen", "Washing Machine", "Parking", "Gym", "Pool", "Balcony", "Security", "Elevator", "Pets allowed"];
const roomTypes = ["All", "Studio", "Private Room", "Shared Room", "Master Bedroom"];

function RoomCard({ room, onClick, index }: { room: RoomListing; onClick: () => void; index: number }) {
    const [ref, inView] = useInView(0.1);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="glass rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img src={room.thumbnail} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                    {room.verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/90 text-white text-[10px] font-medium backdrop-blur-sm">
                            <BadgeCheck size={10} /> Verified
                        </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-text text-[10px] font-medium backdrop-blur-sm">{room.roomType}</span>
                </div>
                <div className="absolute top-3 right-3">
                    <MatchCircle value={room.matchScore} size="sm" />
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-text font-[family-name:var(--font-family-heading)] truncate">{room.title}</h3>
                <div className="flex items-center gap-1 text-text-muted">
                    <MapPin size={12} />
                    <span className="text-xs truncate">{room.district}</span>
                    <span className="text-xs ml-auto">{room.distance}km</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-light">
                    <span className="flex items-center gap-1"><Bed size={12} /> {room.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath size={12} /> {room.bathrooms}</span>
                    <span className="flex items-center gap-1"><Maximize size={12} /> {room.area}m²</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/40">
                    <span className="text-sm font-bold text-text">{formatCurrency(room.rent)}<span className="text-xs font-normal text-text-muted">/mo</span></span>
                    <div className="flex items-center gap-1">
                        <Star size={12} className="text-gold fill-gold" />
                        <span className="text-xs font-medium text-text">{room.rating}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ViewAllRoomsPage() {
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>("match");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);

    const filtered = useMemo(() => {
        let list = rooms.filter((r) => {
            if (r.rent < filters.budgetMin || r.rent > filters.budgetMax) return false;
            if (r.distance > filters.distance) return false;
            if (filters.roomType !== "All" && r.roomType !== filters.roomType) return false;
            if (filters.moveInDate && r.availableFrom > filters.moveInDate) return false;
            if (filters.amenities.length > 0 && !filters.amenities.some((a) => r.amenities.some((ra) => ra.toLowerCase().includes(a.toLowerCase())))) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!r.title.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
            }
            return true;
        });

        switch (sortBy) {
            case "match": list.sort((a, b) => b.matchScore - a.matchScore); break;
            case "nearest": list.sort((a, b) => a.distance - b.distance); break;
            case "lowest": list.sort((a, b) => a.rent - b.rent); break;
            case "highest": list.sort((a, b) => b.rent - a.rent); break;
            case "rating": list.sort((a, b) => b.rating - a.rating); break;
        }
        return list;
    }, [filters, sortBy]);

    const toggleAmenity = (a: string) => {
        setFilters((p) => ({
            ...p,
            amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a],
        }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    const FilterContent = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={resetFilters} className="text-xs text-primary font-medium cursor-pointer bg-transparent border-0 hover:underline">Reset</button>
            </div>

            {/* Budget */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Budget Range</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={filters.budgetMin}
                        onChange={(e) => setFilters((p) => ({ ...p, budgetMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl border border-text/10 text-sm focus:outline-none focus:border-primary/40 bg-bg/50"
                        placeholder="Min"
                    />
                    <span className="text-text-muted">—</span>
                    <input
                        type="number"
                        value={filters.budgetMax}
                        onChange={(e) => setFilters((p) => ({ ...p, budgetMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl border border-text/10 text-sm focus:outline-none focus:border-primary/40 bg-bg/50"
                        placeholder="Max"
                    />
                </div>
            </div>

            {/* Distance */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Max Distance: {filters.distance}km</label>
                <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={filters.distance}
                    onChange={(e) => setFilters((p) => ({ ...p, distance: Number(e.target.value) }))}
                    className="w-full accent-primary"
                />
            </div>

            {/* Room Type */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Room Type</label>
                <div className="flex flex-wrap gap-2">
                    {roomTypes.map((rt) => (
                        <button
                            key={rt}
                            onClick={() => setFilters((p) => ({ ...p, roomType: rt }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.roomType === rt ? "bg-primary text-white border-primary" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {rt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Move-in Date */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Move-in Before</label>
                <input
                    type="date"
                    value={filters.moveInDate}
                    onChange={(e) => setFilters((p) => ({ ...p, moveInDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-text/10 text-sm focus:outline-none focus:border-primary/40 bg-bg/50"
                />
            </div>

            {/* Amenities */}
            <div>
                <label className="text-sm font-medium text-text mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                    {amenityOptions.map((a) => (
                        <button
                            key={a}
                            onClick={() => toggleAmenity(a)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${filters.amenities.includes(a) ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-text-light border-text/10 hover:border-primary/30"
                                }`}
                        >
                            {a}
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
                        Nearby <span className="text-primary">Rooms</span>
                    </h1>
                    <p className="text-text-light mt-2">Find your perfect living space in Da Nang</p>
                </motion.div>

                {/* Search & Sort Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
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
                            <option value="match">Best Match</option>
                            <option value="nearest">Nearest</option>
                            <option value="lowest">Lowest Price</option>
                            <option value="highest">Highest Price</option>
                            <option value="rating">Top Rated</option>
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 lg:hidden"
                            >
                                <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
                                <motion.div
                                    initial={{ x: -300 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: -300 }}
                                    className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl overflow-y-auto"
                                >
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
                        <p className="text-sm text-text-muted mb-4">{filtered.length} rooms found</p>
                        {filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🏠</div>
                                <h3 className="text-lg font-semibold text-text mb-2">No rooms found</h3>
                                <p className="text-sm text-text-muted">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filtered.map((room, i) => (
                                    <RoomCard key={room.id} room={room} index={i} onClick={() => setSelectedRoom(room)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Room Detail Modal */}
            <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} size="xl">
                {selectedRoom && <RoomDetailContent room={selectedRoom} />}
            </Modal>
        </div>
    );
}
