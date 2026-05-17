import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Calendar,
  BadgeCheck,
  Moon,
  Sparkles,
  Volume2,
  Users,
  Cigarette,
  Dog,
  CookingPot,
  Heart,
  UserPlus,
  MessageCircle,
  Check,
  ArrowLeft,
  Share2,
  Flag,
  Shield,
  Clock,
  DollarSign,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import { getRoommateWithReviews, getCurrentUser, getConversations } from "../services";
import { formatCurrency } from "../lib/format";
import type { Roommate, UserReview, Conversation, ChatMessage } from "../types";
import { useCountUp } from "../hooks/useCountUp";
import ChatPanel from "../components/ChatPanel";
import ProfileRatings from "../components/ProfileRatings";
import StarRating from "../components/StarRating";

/* ─── Compatibility Ring (Large, Animated) ─── */
function CompatibilityRing({ value }: { value: number }) {
  const count = useCountUp(value, 1500, true);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (count / 100) * circumference;
  const color =
    value >= 85
      ? "var(--color-secondary)"
      : value >= 70
        ? "var(--color-primary)"
        : "var(--color-accent)";
  const label =
    value >= 85 ? "Rất phù hợp" : value >= 70 ? "Phù hợp" : "Khá phù hợp";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--color-divider)"
            strokeWidth="5"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color }}>
            {count}%
          </span>
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
            Match
          </span>
        </div>
      </div>
      <span
        className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}15` }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Preference Item ─── */
function PrefItem({
  icon: Icon,
  label,
  value,
  match,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  match?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 py-3.5 border-b border-border/30 last:border-0 group cursor-default"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          match ? "bg-secondary/10" : "bg-primary/8"
        }`}
      >
        <Icon
          size={18}
          className={match ? "text-secondary" : "text-primary"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
          {label}
        </div>
        <div className="text-sm font-semibold text-text-primary truncate">
          {value}
        </div>
      </div>
      {match && (
        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <Check size={12} className="text-secondary" />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Lifestyle Tag with match indicator ─── */
function LifestyleTag({ tag, isMatch }: { tag: string; isMatch: boolean }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isMatch
          ? "bg-secondary/10 text-secondary border border-secondary/20"
          : "bg-primary/8 text-primary/80 border border-primary/10"
      }`}
    >
      {isMatch && <Check size={12} />}
      {tag}
    </motion.span>
  );
}

/* ─── Quick Stat Card ─── */
function QuickStat({
  icon: Icon,
  label,
  value,
  color = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/8 text-primary",
    secondary: "bg-secondary/8 text-secondary",
    accent: "bg-accent/8 text-accent",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 p-4 text-center space-y-2 hover:shadow-sm transition-shadow">
      <div
        className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mx-auto`}
      >
        <Icon size={18} />
      </div>
      <div className="text-sm font-bold text-text-primary">{value}</div>
      <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
}

/* ─── Main UserDetailPage ─── */
export default function UserDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConvoId, setChatConvoId] = useState<string | undefined>();
  const [showConnectAnim, setShowConnectAnim] = useState(false);
  const [person, setPerson] = useState<Roommate | null>(null);
  const [currentUserData, setCurrentUserData] = useState<{ preferences: Roommate["preferences"]; lifestyleTags: string[] } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    if (!id) return;
    getRoommateWithReviews(id).then((data) => {
      if (data) {
        setPerson(data);
        setReviews(data.reviews);
      }
    });
    getCurrentUser().then(setCurrentUserData);
    getConversations().then(setConversations);
  }, [id]);

  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Check matching preferences
  const getPreferenceMatch = (key: keyof Roommate["preferences"]) => {
    if (!person || !currentUserData) return false;
    return currentUserData.preferences[key] === person.preferences[key];
  };

  const matchingTags = person && currentUserData
    ? currentUserData.lifestyleTags.filter((tag) => person.lifestyleTags.includes(tag))
    : [];

  // Handle connect → open chat
  const handleConnect = () => {
    setShowConnectAnim(true);

    setTimeout(() => {
      setConnected(true);
      setShowConnectAnim(false);

      const existingConvo = conversations.find((c) => c.participantId === person?.id);

      if (existingConvo) {
        setChatConvoId(existingConvo.id);
      } else {
        setChatConvoId("c1");
      }

      // Open chat after brief delay for the animation
      setTimeout(() => {
        setChatOpen(true);
      }, 400);
    }, 800);
  };

  const handleMessage = () => {
    const existingConvo = conversations.find((c) => c.participantId === person?.id);
    setChatConvoId(existingConvo?.id || "c1");
    setChatOpen(true);
  };

  const handleAddReview = (newRating: number, text: string) => {
    const newReview: UserReview = {
      id: `ur${Date.now()}`,
      author: "You",
      authorId: "current",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=CurrentUser`,
      date: new Date().toISOString().split("T")[0],
      rating: newRating,
      text: text || "Great experience!",
    };
    setReviews([newReview, ...reviews]);
  };

  // Not found state
  if (!person) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Users size={40} className="text-primary/30" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            Không tìm thấy người dùng
          </h2>
          <p className="text-text-secondary">
            Người dùng này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold border-0 cursor-pointer hover:bg-primary-dark transition-colors"
          >
            Quay lại
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface">
      {/* Connection Success Animation Overlay */}
      <AnimatePresence>
        {showConnectAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Zap size={48} className="text-secondary" fill="currentColor" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Button & Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-border text-text-secondary font-medium text-sm hover:bg-surface transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all cursor-pointer">
              <Share2 size={16} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-text-muted hover:text-rose-500 hover:border-rose-200 transition-all cursor-pointer">
              <Flag size={16} />
            </button>
          </div>
        </motion.div>

        {/* ═══ Hero Section ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-border/50 overflow-hidden shadow-sm"
        >
          {/* Gradient Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9zdmc+')] opacity-50" />
          </div>

          <div className="px-6 sm:px-10 pb-8 -mt-16 relative">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  src={person.avatar}
                  alt={person.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-lg bg-primary/10"
                />
                {person.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-md border-2 border-white"
                  >
                    <BadgeCheck size={18} className="text-white" />
                  </motion.div>
                )}
                {/* Online indicator */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              </div>

              {/* Info */}
              <div className="flex-1 pt-2 lg:pt-16">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    {person.name}
                  </h1>
                  <span className="text-sm text-text-muted font-medium">
                    {person.age} tuổi · {person.gender === "Male" ? "Nam" : person.gender === "Female" ? "Nữ" : "Khác"}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      person.status === "HAS_ROOM"
                        ? "bg-badge-blue-bg text-badge-blue-text"
                        : "bg-badge-green-bg text-badge-green-text"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        person.status === "HAS_ROOM"
                          ? "bg-badge-blue-text"
                          : "bg-badge-green-text"
                      }`}
                    />
                    {person.status === "HAS_ROOM"
                      ? "Đã có phòng"
                      : "Đang tìm phòng"}
                  </span>
                  {person.verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary uppercase tracking-wider">
                      <Shield size={10} />
                      Đã xác minh
                    </span>
                  )}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <StarRating
                        rating={rating}
                        size={14}
                        showValue
                        reviewCount={reviews.length}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-primary" />
                    {person.occupation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {person.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    Dọn vào:{" "}
                    {new Date(person.moveInDate).toLocaleDateString(
                      "vi-VN",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </span>
                </div>

                <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-2xl">
                  {person.bio}
                </p>
              </div>

              {/* Compatibility Ring */}
              <div className="flex-shrink-0 self-center lg:self-start lg:pt-16">
                <CompatibilityRing value={person.compatibility} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <QuickStat
                icon={DollarSign}
                label="Ngân sách"
                value={`${(person.budget.max / 1000000).toFixed(1)}tr/tháng`}
                color="primary"
              />
              <QuickStat
                icon={Zap}
                label="Sở thích chung"
                value={`${matchingTags.length} điểm`}
                color="secondary"
              />
              <QuickStat
                icon={Star}
                label="Đánh giá"
                value={rating > 0 ? `${rating.toFixed(1)}/5` : "Chưa có"}
                color="accent"
              />
              <QuickStat
                icon={Clock}
                label="Tham gia"
                value="2 tháng trước"
                color="emerald"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              {connected ? (
                <>
                  <span className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/10 text-secondary font-semibold text-sm">
                    <Check size={16} /> Đã kết nối
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMessage}
                    className="btn-glow flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-bold shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 text-sm"
                  >
                    <MessageCircle size={16} />
                    Nhắn tin cho {person.name.split(" ")[0]}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConnect}
                  className="btn-glow flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-white font-bold shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 text-sm"
                >
                  <UserPlus size={16} />
                  Kết nối với {person.name.split(" ")[0]}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══ Two Column Layout ═══ */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lifestyle Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-border/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-5">
                <Heart size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-text-primary">
                  Phong cách sống
                </h2>
                {matchingTags.length > 0 && (
                  <span className="ml-auto text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                    {matchingTags.length} điểm chung
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {person.lifestyleTags.map((tag) => (
                  <LifestyleTag
                    key={tag}
                    tag={tag}
                    isMatch={matchingTags.includes(tag)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-border/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-text-primary">
                  Sở thích sinh hoạt
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8">
                <PrefItem
                  icon={Moon}
                  label="Lịch ngủ"
                  value={person.preferences.sleepSchedule}
                  match={getPreferenceMatch("sleepSchedule")}
                />
                <PrefItem
                  icon={Sparkles}
                  label="Vệ sinh"
                  value={person.preferences.cleanliness}
                  match={getPreferenceMatch("cleanliness")}
                />
                <PrefItem
                  icon={Volume2}
                  label="Mức ồn"
                  value={person.preferences.noise}
                  match={getPreferenceMatch("noise")}
                />
                <PrefItem
                  icon={Users}
                  label="Khách đến"
                  value={person.preferences.guests}
                  match={getPreferenceMatch("guests")}
                />
                <PrefItem
                  icon={Cigarette}
                  label="Hút thuốc"
                  value={person.preferences.smoking}
                  match={getPreferenceMatch("smoking")}
                />
                <PrefItem
                  icon={Dog}
                  label="Thú cưng"
                  value={person.preferences.pets}
                  match={getPreferenceMatch("pets")}
                />
                <PrefItem
                  icon={CookingPot}
                  label="Nấu ăn"
                  value={person.preferences.cooking}
                  match={getPreferenceMatch("cooking")}
                />
              </div>
            </motion.div>

            {/* Ratings & Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfileRatings
                reviews={reviews}
                rating={rating}
                reviewCount={reviews.length}
                targetName={person.name}
                targetAvatar={person.avatar}
                canReview={true}
                onAddReview={handleAddReview}
              />
            </motion.div>
          </div>

          {/* Right Column - 1/3 Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-border/50 p-6"
            >
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                Ngân sách
              </h3>
              <div className="bg-primary/5 rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">
                  {formatCurrency(person.budget.min)}
                </div>
                <div className="text-xs text-text-muted my-1">đến</div>
                <div className="text-2xl font-extrabold text-primary">
                  {formatCurrency(person.budget.max)}
                </div>
                <div className="text-xs text-text-muted mt-1 font-medium">
                  / tháng
                </div>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-border/50 p-6"
            >
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Khu vực mong muốn
              </h3>
              <div className="bg-surface rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {person.location}
                    </div>
                    <div className="text-xs text-text-muted">Đà Nẵng</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Similar Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl border border-border/50 p-6"
            >
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Hồ sơ tương tự
              </h3>
              <div className="space-y-3">
                {roommates
                  .filter((r) => r.id !== person.id)
                  .sort((a, b) => b.compatibility - a.compatibility)
                  .slice(0, 3)
                  .map((r) => (
                    <motion.button
                      key={r.id}
                      whileHover={{ x: 4 }}
                      onClick={() => navigate(`/user/${r.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all cursor-pointer border-0 bg-transparent text-left"
                    >
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="w-10 h-10 rounded-xl object-cover bg-primary/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text-primary truncate">
                          {r.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {r.occupation}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-primary">
                          {r.compatibility}%
                        </span>
                        <ChevronRight size={14} className="text-text-muted" />
                      </div>
                    </motion.button>
                  ))}
              </div>
            </motion.div>

            {/* Safety Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-primary/10 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-text-primary">
                  An toàn khi kết nối
                </h3>
              </div>
              <ul className="text-xs text-text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <Check
                    size={12}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  Xác minh danh tính trước khi gặp mặt
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    size={12}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  Gặp nhau tại nơi công cộng lần đầu
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    size={12}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  Không chia sẻ thông tin tài chính cá nhân
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    size={12}
                    className="text-secondary mt-0.5 flex-shrink-0"
                  />
                  Thỏa thuận rõ ràng bằng hợp đồng
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Sticky Bottom CTA (mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-border p-4 z-50">
          <div className="max-w-5xl mx-auto flex gap-3">
            {connected ? (
              <>
                <span className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-semibold text-sm flex-shrink-0">
                  <Check size={14} /> Đã kết nối
                </span>
                <button
                  onClick={handleMessage}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold text-sm cursor-pointer border-0 shadow-lg"
                >
                  <MessageCircle size={16} />
                  Nhắn tin
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-light text-white font-bold text-sm cursor-pointer border-0 shadow-lg"
              >
                <UserPlus size={16} />
                Kết nối với {person.name.split(" ")[0]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialConversationId={chatConvoId}
      />
    </div>
  );
}
