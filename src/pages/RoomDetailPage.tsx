import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Star, BadgeCheck, Bed, Bath, Maximize, Wifi, Wind, Car, PawPrint,
    ChevronLeft, ChevronRight, Share2, Bookmark, Phone, Send, MessageSquarePlus,
    ChevronDown, ArrowLeft, Calendar, Clock, Home, Shield, Zap, Droplets,
    Tv, Utensils, Dumbbell, Waves, Building, Eye, Heart, Users, Navigation
} from "lucide-react";
import { rooms, formatCurrency, currentUser } from "../data/mockData";
import type { RoomListing } from "../data/mockData";
import MatchCircle from "../components/MatchCircle";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";

interface RoomReview {
    author: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
}

const amenityIcons: Record<string, React.ElementType> = {
    wifi: Wifi,
    air: Wind,
    parking: Car,
    pet: PawPrint,
    security: Shield,
    elevator: Building,
    gym: Dumbbell,
    pool: Waves,
    kitchen: Utensils,
    tv: Tv,
    water: Droplets,
    electric: Zap,
};

function getAmenityIcon(amenity: string) {
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
        if (lowerAmenity.includes(key)) return Icon;
    }
    return BadgeCheck;
}

export default function RoomDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const room = rooms.find((r) => r.id === id);

    const [currentImage, setCurrentImage] = useState(0);
    const [contactMessage, setContactMessage] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [reviews, setReviews] = useState<RoomReview[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);

    useEffect(() => {
        if (room) {
            setReviews(room.reviews);
            setContactMessage(t('roomDetail.defaultMessage'));
        }
    }, [room, t]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!room) {
        return (
            <div className="min-h-screen pt-28 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h2 className="text-2xl font-bold text-text mb-2">{t('roomDetail.notFound')}</h2>
                    <p className="text-text-muted mb-6">{t('roomDetail.notFoundDescription')}</p>
                    <Link
                        to="/rooms"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                    >
                        <ArrowLeft size={18} />
                        {t('roomDetail.backToRooms')}
                    </Link>
                </div>
            </div>
        );
    }

    const currentRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : room.rating;

    const nextImage = () => setCurrentImage((i) => (i + 1) % room.images.length);
    const prevImage = () => setCurrentImage((i) => (i - 1 + room.images.length) % room.images.length);

    const handleAddReview = (newRating: number, text: string) => {
        const newReview: RoomReview = {
            author: currentUser.name,
            avatar: currentUser.avatar,
            date: new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' }),
            rating: newRating,
            text: text || t('rating.excellent'),
        };
        setReviews([newReview, ...reviews]);
    };

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);
    const displayedAmenities = showAllAmenities ? room.amenities : room.amenities.slice(0, 8);

    // Similar rooms (same district or room type)
    const similarRooms = rooms
        .filter((r) => r.id !== room.id && (r.district === room.district || r.roomType === room.roomType))
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-bg">
            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {fullscreenImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <button
                            onClick={() => setFullscreenImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer border-0"
                        >
                            <ChevronDown size={24} className="rotate-45" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenImage((i) => (i! - 1 + room.images.length) % room.images.length); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer border-0"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <img
                            src={room.images[fullscreenImage]}
                            alt={`${room.title} - ${fullscreenImage + 1}`}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenImage((i) => (i! + 1) % room.images.length); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer border-0"
                        >
                            <ChevronRight size={28} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                            {fullscreenImage + 1} / {room.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header with Back Button */}
            <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0 mb-4"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">{t('common.back')}</span>
                </motion.button>
            </div>

            {/* Image Gallery */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-2xl overflow-hidden"
                >
                    {/* Main Image */}
                    <div
                        className="relative h-72 sm:h-96 lg:h-[500px] bg-gray-100 cursor-pointer group"
                        onClick={() => setFullscreenImage(currentImage)}
                    >
                        <motion.img
                            key={currentImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            src={room.images[currentImage]}
                            alt={room.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        {room.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer border-0"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer border-0"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {room.verified && (
                                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/90 text-white text-xs font-medium backdrop-blur-sm">
                                    <BadgeCheck size={14} /> {t('roomDetail.verified')}
                                </span>
                            )}
                            <span className="px-3 py-1.5 rounded-full bg-white/90 text-text text-xs font-medium backdrop-blur-sm uppercase">
                                {room.roomType}
                            </span>
                        </div>
                        {/* Match Score */}
                        <div className="absolute top-4 right-4">
                            <MatchCircle value={room.matchScore} size="lg" />
                        </div>
                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm flex items-center gap-1.5">
                            <Eye size={12} />
                            {currentImage + 1} / {room.images.length}
                        </div>
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="hidden lg:grid grid-cols-2 gap-2 h-[500px]">
                        {room.images.slice(1, 5).map((img, i) => (
                            <div
                                key={i}
                                className="relative bg-gray-100 cursor-pointer group overflow-hidden"
                                onClick={() => setFullscreenImage(i + 1)}
                            >
                                <img
                                    src={img}
                                    alt={`${room.title} - ${i + 2}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {i === 3 && room.images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-lg font-semibold">+{room.images.length - 5}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Mobile Image Dots */}
                <div className="flex justify-center gap-1.5 mt-3 lg:hidden">
                    {room.images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${i === currentImage ? "bg-primary w-6" : "bg-text/20"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={currentRating} size={18} showValue reviewCount={reviews.length} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                {t(`room.${room.id}.title`, room.title)}
                            </h1>
                            <div className="flex items-center gap-2 mt-2 text-text-muted">
                                <MapPin size={16} />
                                <span>{t(`roomLocation.${room.location}`, room.location)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-text-muted">
                                <Navigation size={14} />
                                <span className="text-sm">{t('common.kmAway', { distance: room.distance })}</span>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                            <div className="glass rounded-xl p-4 text-center">
                                <Bed size={24} className="text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-text">{room.bedrooms}</div>
                                <div className="text-xs text-text-muted">{room.bedrooms > 1 ? t('roomDetail.bedrooms') : t('roomDetail.bedroom')}</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <Bath size={24} className="text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-text">{room.bathrooms}</div>
                                <div className="text-xs text-text-muted">{room.bathrooms > 1 ? t('roomDetail.bathrooms') : t('roomDetail.bathroom')}</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <Maximize size={24} className="text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-text">{room.area}</div>
                                <div className="text-xs text-text-muted">m²</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <Home size={24} className="text-primary mx-auto mb-2" />
                                <div className="text-lg font-bold text-text">{room.roomType}</div>
                                <div className="text-xs text-text-muted">{t('roomDetail.roomType')}</div>
                            </div>
                        </motion.div>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                                {t('roomDetail.highlights')}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Calendar size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text">{t('roomDetail.availableFrom')}</div>
                                        <div className="text-sm text-text-muted">
                                            {new Date(room.availableFrom).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                                                month: "long", day: "numeric", year: "numeric"
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock size={18} className="text-secondary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text">{t('roomDetail.minDuration')}</div>
                                        <div className="text-sm text-text-muted">{room.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                        <Users size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text">{t('roomDetail.currentRoommates')}</div>
                                        <div className="text-sm text-text-muted">
                                            {room.currentRoommates.length > 0
                                                ? `${room.currentRoommates.length} ${t('roomDetail.people')}`
                                                : t('roomDetail.noRoommates')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                                        <PawPrint size={18} className="text-gold" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text">{t('roomDetail.pets')}</div>
                                        <div className="text-sm text-text-muted">
                                            {room.petsAllowed ? t('roomDetail.petsAllowed') : t('roomDetail.noPets')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Current Roommates */}
                        {room.currentRoommates.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="glass rounded-2xl p-6"
                            >
                                <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                                    {t('roomDetail.meetYourRoommates')}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {room.currentRoommates.map((rm) => (
                                        <div key={rm.name} className="flex items-start gap-3 p-4 rounded-xl bg-white/40">
                                            <img src={rm.avatar} alt={rm.name} className="w-12 h-12 rounded-xl bg-primary/10" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-text">{rm.name}</div>
                                                <div className="text-xs text-text-muted">{t(`occupation.${rm.occupation}`, rm.occupation)} · {rm.age}y</div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {rm.tags.map((tag) => (
                                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                                                            {t(`lifestyle.${tag}`, tag)}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-text-light mt-2 italic">"{rm.quote}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* About */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                                {t('roomDetail.aboutThisPlace')}
                            </h2>
                            <p className="text-sm text-text-light leading-relaxed whitespace-pre-line">
                                {t(`room.${room.id}.description`, room.description)}
                            </p>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="glass rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                                {t('roomDetail.whatOffers')}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {displayedAmenities.map((a) => {
                                    const Icon = getAmenityIcon(a);
                                    return (
                                        <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-white/40">
                                            <Icon size={18} className="text-primary flex-shrink-0" />
                                            <span className="text-sm text-text-light">{t(`amenity.${a}`, a)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {room.amenities.length > 8 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                                    className="mt-4 px-4 py-2.5 rounded-xl border border-text/20 text-sm font-medium text-text hover:bg-bg transition-colors cursor-pointer bg-transparent flex items-center gap-2"
                                >
                                    {showAllAmenities ? t('common.showLess') : t('roomDetail.showAllAmenities', { count: room.amenities.length })}
                                    <ChevronDown size={16} className={showAllAmenities ? "rotate-180" : ""} />
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Reviews */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass rounded-2xl p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Star size={22} className="text-gold fill-gold" />
                                    <span className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                        {currentRating.toFixed(1)}
                                    </span>
                                    <span className="text-text-muted">
                                        ({reviews.length} {t('roomDetail.reviews')})
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowReviewForm(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer border-0"
                                >
                                    <MessageSquarePlus size={14} />
                                    {t('rating.writeReview')}
                                </motion.button>
                            </div>

                            {/* Rating Distribution */}
                            <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-white/20">
                                <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-white/20 flex-shrink-0">
                                    <div className="text-5xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                        {currentRating.toFixed(1)}
                                    </div>
                                    <StarRating rating={currentRating} size={20} />
                                    <div className="text-sm text-text-muted mt-1">
                                        {reviews.length} {reviews.length === 1 ? t('common.review') : t('common.reviews')}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {ratingDistribution.map(({ star, count, percentage }) => (
                                        <div key={star} className="flex items-center gap-2 text-sm">
                                            <span className="w-3 text-text-muted">{star}</span>
                                            <Star size={14} className="text-gold fill-gold" />
                                            <div className="flex-1 h-2.5 bg-white/40 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 * (5 - star) }}
                                                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                                                />
                                            </div>
                                            <span className="w-8 text-right text-text-muted">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {displayedReviews.map((review, index) => (
                                    <motion.div
                                        key={`${review.author}-${index}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 rounded-xl bg-white/40 space-y-2"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-xl bg-primary/10" />
                                                <div>
                                                    <div className="text-sm font-semibold text-text">{review.author}</div>
                                                    <div className="text-xs text-text-muted">{review.date}</div>
                                                </div>
                                            </div>
                                            <StarRating rating={review.rating} size={12} />
                                        </div>
                                        <p className="text-sm text-text-light leading-relaxed">"{review.text}"</p>
                                    </motion.div>
                                ))}
                            </div>

                            {reviews.length > 4 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/40 bg-white/40 text-text text-sm font-medium hover:bg-white/60 transition-colors cursor-pointer"
                                >
                                    {showAllReviews ? (
                                        <>
                                            {t('common.showLess')}
                                            <ChevronDown size={16} className="rotate-180" />
                                        </>
                                    ) : (
                                        <>
                                            {t('roomDetail.showAllReviews', { count: reviews.length })}
                                            <ChevronDown size={16} />
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Review Form Modal */}
                        <ReviewForm
                            isOpen={showReviewForm}
                            onClose={() => setShowReviewForm(false)}
                            onSubmit={handleAddReview}
                            targetName={room.title}
                            targetAvatar={room.thumbnail}
                        />
                    </div>

                    {/* Right Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-24"
                        >
                            <div className="glass rounded-2xl p-6 space-y-5">
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <span className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                            {formatCurrency(room.rent)}
                                        </span>
                                        <span className="text-text-muted text-sm"> / {t('common.month')}</span>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                        {t('roomDetail.availableNow')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-3 rounded-xl bg-bg/50">
                                        <div className="text-xs text-text-muted mb-1">{t('roomDetail.moveIn')}</div>
                                        <div className="text-text font-medium">
                                            {new Date(room.availableFrom).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                                                month: "short", day: "numeric", year: "numeric"
                                            })}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-bg/50">
                                        <div className="text-xs text-text-muted mb-1">{t('roomDetail.duration')}</div>
                                        <div className="text-text font-medium">{room.duration}</div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow cursor-pointer border-0 text-base btn-glow"
                                >
                                    {t('roomDetail.bookViewing')}
                                </motion.button>

                                <div className="text-center text-xs text-text-muted">{t('roomDetail.orContactHost')}</div>

                                <textarea
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-text/10 text-sm text-text resize-none focus:outline-none focus:border-primary/40 bg-bg/50"
                                    rows={3}
                                    placeholder={t('roomDetail.messagePlaceholder')}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl border border-text/20 text-text font-medium text-sm hover:bg-bg transition-colors cursor-pointer bg-transparent flex items-center justify-center gap-2"
                                >
                                    <Send size={16} /> {t('roomDetail.sendMessage')}
                                </motion.button>

                                <p className="text-[10px] text-text-muted text-center">{t('roomDetail.notChargedYet')}</p>

                                <div className="flex justify-center gap-6 pt-3 border-t border-white/30">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0"
                                    >
                                        <Share2 size={16} /> {t('common.share')}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsSaved(!isSaved)}
                                        className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer bg-transparent border-0 ${isSaved ? "text-red-500" : "text-text-muted hover:text-text"
                                            }`}
                                    >
                                        <Heart size={16} className={isSaved ? "fill-current" : ""} /> {t('common.save')}
                                    </motion.button>
                                </div>

                                {/* Owner Info */}
                                <div className="pt-4 border-t border-white/30">
                                    <div className="flex items-center gap-3">
                                        <img src={room.owner.avatar} alt={room.owner.name} className="w-12 h-12 rounded-full bg-primary/10" />
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-text">{room.owner.name}</div>
                                            <div className="text-xs text-text-muted">{room.owner.responseTime}</div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer border-0 hover:bg-primary/20 transition-colors"
                                        >
                                            <Phone size={16} className="text-primary" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-4 glass rounded-2xl p-4 h-48 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                                <div className="text-center">
                                    <MapPin size={32} className="text-primary mx-auto mb-2" />
                                    <div className="text-sm font-medium text-text">{t(`roomDistrict.${room.district}`, room.district)}</div>
                                    <div className="text-xs text-text-muted">{t('roomDetail.viewOnMap')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Similar Rooms */}
                {similarRooms.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <h2 className="text-xl font-bold text-text mb-6 font-[family-name:var(--font-family-heading)]">
                            {t('roomDetail.similarRooms')}
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {similarRooms.map((r) => (
                                <Link key={r.id} to={`/rooms/${r.id}`} className="block">
                                    <motion.div
                                        whileHover={{ y: -6 }}
                                        className="glass rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                                    >
                                        <div className="relative h-40 overflow-hidden">
                                            <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 right-3">
                                                <MatchCircle value={r.matchScore} size="sm" />
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3 className="text-sm font-semibold text-text truncate">{t(`room.${r.id}.title`, r.title)}</h3>
                                            <div className="flex items-center gap-1 text-text-muted">
                                                <MapPin size={12} />
                                                <span className="text-xs">{t(`roomDistrict.${r.district}`, r.district)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-white/40">
                                                <span className="text-sm font-bold text-text">{formatCurrency(r.rent)}<span className="text-xs font-normal text-text-muted">{t('common.perMonth')}</span></span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-gold fill-gold" />
                                                    <span className="text-xs font-medium text-text">{r.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
