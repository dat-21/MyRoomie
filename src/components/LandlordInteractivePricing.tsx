import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, TrendingUp, Crown, Check, Star, ShoppingCart, ChevronRight, X as XIcon, Info } from "lucide-react";

const CONTACT_PACKS = [
    { id: 10, contact: 10, price: 39000, bestValue: false },
    { id: 30, contact: 30, price: 99000, bestValue: false },
    { id: 50, contact: 50, price: 149000, bestValue: false },
    { id: 100, contact: 100, price: 249000, bestValue: true },
    { id: 200, contact: 200, price: 399000, bestValue: false },
];

const BOOST_QUANTITIES = [1, 3, 5, 10, 20];
const BOOST_DURATIONS = [
    { days: 1, label: "24h", unitPrice: 19000 },
    { days: 3, label: "3 ngày", unitPrice: 49000 },
    { days: 7, label: "7 ngày", unitPrice: 99000 },
    { days: 15, label: "15 ngày", unitPrice: 149000 },
    { days: 30, label: "30 ngày", unitPrice: 249000 },
];

const GOLD_SUBSCRIPTIONS = [
    { months: 1, price: 699000, label: "1 tháng", discount: 0, badge: null },
    { months: 3, price: 1799000, label: "3 tháng", discount: 15, badge: null },
    { months: 6, price: 2999000, label: "6 tháng", discount: 25, badge: null },
    { months: 12, price: 4999000, label: "12 tháng", discount: 40, badge: "BEST VALUE" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function LandlordInteractivePricing() {
    const [selectedContact, setSelectedContact] = useState<number | null>(null);
    const [boostQuantity, setBoostQuantity] = useState<number | null>(null);
    const [boostDuration, setBoostDuration] = useState<number | null>(null);
    const [goldDuration, setGoldDuration] = useState<number | null>(null);

    const getContactPrice = () => CONTACT_PACKS.find(p => p.id === selectedContact)?.price || 0;
    const getBoostPrice = () => {
        if (!boostQuantity || !boostDuration) return 0;
        const dur = BOOST_DURATIONS.find(d => d.days === boostDuration);
        return dur ? dur.unitPrice * boostQuantity : 0;
    };
    const getGoldPrice = () => GOLD_SUBSCRIPTIONS.find(g => g.months === goldDuration)?.price || 0;

    const totalPrice = getContactPrice() + getBoostPrice() + getGoldPrice();
    const showGoldSuggestion = !goldDuration && (getContactPrice() + getBoostPrice()) >= 350000;

    const hasSelection = selectedContact !== null || (boostQuantity !== null && boostDuration !== null) || goldDuration !== null;

    return (
        <div className="relative pb-40 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                    Tùy chọn <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Linh Hoạt</span>
                </h2>
                <p className="mt-3 text-text-light text-sm max-w-2xl mx-auto">
                    Thiết kế gói dịch vụ phù hợp nhất với nhu cầu của bạn. Chọn từng phần hoặc nâng cấp toàn diện với Gold.
                </p>
            </div>

            <div className="space-y-12">
                {/* 1. Mở khóa liên hệ */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                            <Unlock size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-text">Mở khóa liên hệ</h3>
                            <p className="text-xs text-text-muted">Mua theo số lượng sinh viên bạn muốn tiếp cận</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CONTACT_PACKS.map(pack => {
                            const isSelected = selectedContact === pack.id;
                            const pricePerContact = Math.round(pack.price / pack.contact);
                            return (
                                <motion.button
                                    key={pack.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedContact(isSelected ? null : pack.id)}
                                    className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                        isSelected 
                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                                        : "border-border/60 bg-white/50 hover:border-primary/30"
                                    }`}
                                >
                                    {pack.bestValue && (
                                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            Tiết kiệm nhất
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-text text-base">{pack.contact} liên hệ</span>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${isSelected ? "text-primary" : "text-text"}`}>
                                        {formatCurrency(pack.price)}
                                    </div>
                                    <div className="text-[11px] text-text-muted mt-1">
                                        ~{formatCurrency(pricePerContact)}/contact
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </section>

                <div className="h-px bg-border/50 w-full" />

                {/* 2. Tăng hiển thị */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary flex-shrink-0">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-text">Tăng hiển thị tin đăng</h3>
                            <p className="text-xs text-text-muted">Đẩy tin nổi bật trên trang kết quả tìm kiếm</p>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-5 border border-border/60 space-y-6">
                        {/* 2a. Chọn số lượng */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-text">2a. Chọn số lượt đẩy:</h4>
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Các gói lớn sắp ra mắt</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {BOOST_QUANTITIES.map(q => {
                                    const isDisabled = q !== 1 && q !== 10;
                                    return (
                                        <button
                                            key={q}
                                            disabled={isDisabled}
                                            onClick={() => setBoostQuantity(boostQuantity === q ? null : q)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border-2 ${
                                                isDisabled 
                                                ? "opacity-40 cursor-not-allowed border-border/30 bg-gray-50 text-text-muted"
                                                : boostQuantity === q
                                                    ? "border-secondary bg-secondary/10 text-secondary cursor-pointer"
                                                    : "border-border/50 text-text-light hover:border-secondary/30 cursor-pointer"
                                            }`}
                                        >
                                            {q} lượt
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2b. Chọn thời gian */}
                        <div>
                            <h4 className="text-sm font-semibold text-text mb-3">2b. Thời lượng mỗi lượt:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {BOOST_DURATIONS.map(dur => {
                                    const isSelected = boostDuration === dur.days;
                                    const isDisabled = dur.days !== 1; // disable all except 24h
                                    return (
                                        <button
                                            key={dur.days}
                                            disabled={isDisabled}
                                            onClick={() => setBoostDuration(isSelected ? null : dur.days)}
                                            className={`text-left p-3 rounded-xl border-2 transition-colors flex justify-between items-center ${
                                                isDisabled
                                                ? "opacity-40 cursor-not-allowed border-border/30 bg-gray-50"
                                                : isSelected
                                                    ? "border-secondary bg-secondary/5 text-secondary shadow-sm cursor-pointer"
                                                    : "border-border/50 text-text hover:border-secondary/30 cursor-pointer"
                                            }`}
                                        >
                                            <div>
                                                <div className={`font-semibold text-sm ${isDisabled ? "text-text-muted" : ""}`}>{dur.label}</div>
                                                <div className="text-[11px] opacity-70 mt-0.5">{formatCurrency(dur.unitPrice)}/lượt</div>
                                            </div>
                                            {isSelected && !isDisabled && <Check size={16} className="text-secondary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {boostQuantity && boostDuration && (
                            <div className="mt-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex justify-between items-center">
                                <span className="text-sm text-text-light">
                                    Đã chọn: <strong className="text-text">{boostQuantity} lượt</strong> × <strong className="text-text">{BOOST_DURATIONS.find(d=>d.days===boostDuration)?.label}</strong>
                                </span>
                                <span className="font-bold text-secondary text-lg">
                                    {formatCurrency(getBoostPrice())}
                                </span>
                            </div>
                        )}
                        {(!boostQuantity || !boostDuration) && (boostQuantity || boostDuration) && (
                            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
                                <Info size={14} /> Vui lòng chọn cả **số lượt** và **thời lượng** để tính phí hiển thị.
                            </div>
                        )}
                    </div>
                </section>

                <div className="h-px bg-border/50 w-full" />

                {/* 3. Gold Subscription */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0 shadow-sm">
                            <Crown size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">Gold Subscription</h3>
                            <p className="text-xs text-text-muted">Giải pháp trọn gói: Không giới hạn liên hệ + 10 lượt đẩy tin mỗi tháng</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {GOLD_SUBSCRIPTIONS.map(gold => {
                            const isSelected = goldDuration === gold.months;
                            const pricePerMonth = Math.round(gold.price / gold.months);
                            return (
                                <motion.button
                                    key={gold.months}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setGoldDuration(isSelected ? null : gold.months)}
                                    className={`relative text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                                        isSelected 
                                        ? "border-amber-400 bg-gradient-to-br from-amber-50/50 to-white shadow-lg shadow-amber-200/50" 
                                        : "border-border/60 bg-white/50 hover:border-amber-300/50 hover:shadow-md"
                                    }`}
                                >
                                    {gold.badge && (
                                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md tracking-wider">
                                            {gold.badge}
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-bold text-lg ${isSelected ? "text-amber-600" : "text-text"}`}>{gold.label}</span>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                    </div>
                                    
                                    <div className={`text-xl font-extrabold mb-2 ${isSelected ? "text-text" : "text-text"}`}>
                                        {formatCurrency(gold.price)}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                        <span className="text-text-light font-medium bg-gray-100 px-2 py-1 rounded-md">
                                            {formatCurrency(pricePerMonth)} / tháng
                                        </span>
                                        {gold.discount > 0 && (
                                            <span className="text-green-600 font-bold">
                                                Tiết kiệm {gold.discount}%
                                            </span>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* 4. Sticky Cart Summary */}
            <AnimatePresence>
                {hasSelection && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 sm:bottom-6 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 z-50 px-0 sm:px-6 w-full lg:max-w-4xl"
                    >
                        <div className="bg-white/95 backdrop-blur-xl border border-border/80 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:rounded-3xl p-4 sm:p-5">
                            {showGoldSuggestion && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max max-w-[90vw] mx-auto">
                                    <motion.div 
                                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        className="bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-t-xl sm:rounded-xl shadow-sm flex items-center gap-2 cursor-pointer border border-amber-200"
                                        onClick={() => { setGoldDuration(1); setSelectedContact(null); setBoostQuantity(null); setBoostDuration(null); }}
                                    >
                                        <Star size={14} className="fill-amber-500 text-amber-500" />
                                        Gợi ý: Chỉ với 699k gói Gold, bạn được KHÔNG GIỚI HẠN! Đăng ký ngay 
                                        <ChevronRight size={14} />
                                    </motion.div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="w-full flex-1">
                                    <div className="text-xs text-text-light font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <ShoppingCart size={14} /> Tóm tắt đơn hàng
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {selectedContact && (
                                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary-dark px-2 py-1 rounded-md">
                                                <Unlock size={12}/> {CONTACT_PACKS.find(p=>p.id===selectedContact)?.contact} liên hệ
                                            </span>
                                        )}
                                        {boostQuantity && boostDuration && (
                                            <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary-dark px-2 py-1 rounded-md">
                                                <TrendingUp size={12}/> {boostQuantity} tin ({BOOST_DURATIONS.find(d=>d.days===boostDuration)?.label})
                                            </span>
                                        )}
                                        {goldDuration && (
                                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
                                                <Crown size={12} className="fill-amber-500 text-amber-500" /> Gold {goldDuration} tháng
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center w-full sm:w-auto gap-4 justify-between sm:justify-end">
                                    <div className="text-left sm:text-right">
                                        <div className="text-[11px] text-text-muted">Tổng thành tiền</div>
                                        <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            {formatCurrency(totalPrice)}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold cursor-pointer border-0 shadow-lg shrink-0 whitespace-nowrap lg:px-8"
                                    >
                                        Thanh toán ngay <ChevronRight size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
