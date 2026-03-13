import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Bed, Bath, Maximize, Wifi, Wind, Car, PawPrint, ChevronLeft, ChevronRight, Share2, Bookmark, Phone, Send, Users, MessageSquarePlus, ChevronDown } from "lucide-react";
import type { RoomListing } from "../data/mockData";
import { formatCurrency, currentUser } from "../data/mockData";
import MatchCircle from "./MatchCircle";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

interface Props {
    room: RoomListing;
}

interface RoomReview {
    author: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
}

export default function RoomDetailContent({ room }: Props) {
    const { t, i18n } = useTranslation();
    const [currentImage, setCurrentImage] = useState(0);
    const [contactMessage, setContactMessage] = useState(t('roomDetail.defaultMessage'));
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviews, setReviews] = useState<RoomReview[]>(room.reviews);

    // Calculate current rating
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

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

    return (
        <div className="overflow-hidden rounded-3xl">
            {/* Image Carousel */}
            <div className="relative h-72 sm:h-96 bg-gray-100 overflow-hidden">
                <motion.img
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={room.images[currentImage]}
                    alt={room.title}
                    className="w-full h-full object-cover"
                />
                {room.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer border-0">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextImage} className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer border-0">
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {room.images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${i === currentImage ? "bg-white w-6" : "bg-white/60"}`}
                        />
                    ))}
                </div>
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {room.verified && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/90 text-white text-xs font-medium backdrop-blur-sm">
                            <BadgeCheck size={12} /> {t('roomDetail.verified')}
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-white/90 text-text text-xs font-medium backdrop-blur-sm uppercase">{room.roomType}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <StarRating rating={currentRating} size={16} showValue reviewCount={reviews.length} />
                            </div>
                            <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{t(`room.${room.id}.title`, room.title)}</h2>
                            <div className="flex items-center gap-1.5 mt-1 text-text-muted">
                                <MapPin size={14} />
                                <span className="text-sm">{t(`roomLocation.${room.location}`, room.location)}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Bed size={16} className="text-primary" />
                                <span>{room.bedrooms} {room.bedrooms > 1 ? t('roomDetail.bedrooms') : t('roomDetail.bedroom')}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Bath size={16} className="text-primary" />
                                <span>{room.bathrooms} {room.bathrooms > 1 ? t('roomDetail.bathrooms') : t('roomDetail.bathroom')}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Maximize size={16} className="text-primary" />
                                <span>{room.area} m²</span>
                            </div>
                        </div>

                        {/* Current Roommates */}
                        {room.currentRoommates.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">{t('roomDetail.currentRoommates')}</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {room.currentRoommates.map((rm) => (
                                        <div key={rm.name} className="flex items-start gap-3 p-3 rounded-xl bg-bg">
                                            <img src={rm.avatar} alt={rm.name} className="w-10 h-10 rounded-xl bg-primary/10" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-text">{rm.name}</div>
                                                <div className="text-xs text-text-muted">{t(`occupation.${rm.occupation}`, rm.occupation)} · {rm.age}y</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {rm.tags.map((tag) => (
                                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{t(`lifestyle.${tag}`, tag)}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-text-light mt-1 italic">"{rm.quote}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* About */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">{t('roomDetail.aboutThisPlace')}</h3>
                            <p className="text-sm text-text-light leading-relaxed whitespace-pre-line">{t(`room.${room.id}.description`, room.description)}</p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">{t('roomDetail.whatOffers')}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {room.amenities.slice(0, 6).map((a) => (
                                    <div key={a} className="flex items-center gap-2 text-sm text-text-light py-1">
                                        {a.toLowerCase().includes("wifi") ? <Wifi size={16} className="text-primary" /> :
                                            a.toLowerCase().includes("air") ? <Wind size={16} className="text-primary" /> :
                                                a.toLowerCase().includes("parking") ? <Car size={16} className="text-primary" /> :
                                                    a.toLowerCase().includes("pet") ? <PawPrint size={16} className="text-primary" /> :
                                                        <BadgeCheck size={16} className="text-primary" />}
                                        {t(`amenity.${a}`, a)}
                                    </div>
                                ))}
                            </div>
                            {room.amenities.length > 6 && (
                                <button className="mt-3 px-4 py-2 rounded-xl border border-text/20 text-sm font-medium text-text hover:bg-bg transition-colors cursor-pointer bg-transparent">
                                    {t('roomDetail.showAllAmenities', { count: room.amenities.length })}
                                </button>
                            )}
                        </div>

                        {/* Reviews */}
                        <div className="glass rounded-2xl p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Star size={20} className="text-gold fill-gold" />
                                    <span className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
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
                                {/* Overall Rating */}
                                <div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-white/20 flex-shrink-0">
                                    <div className="text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                        {currentRating.toFixed(1)}
                                    </div>
                                    <StarRating rating={currentRating} size={18} />
                                    <div className="text-sm text-text-muted mt-1">
                                        {reviews.length} {reviews.length === 1 ? t('common.review') : t('common.reviews')}
                                    </div>
                                </div>

                                {/* Distribution Bars */}
                                <div className="flex-1 space-y-2">
                                    {ratingDistribution.map(({ star, count, percentage }) => (
                                        <div key={star} className="flex items-center gap-2 text-sm">
                                            <span className="w-3 text-text-muted">{star}</span>
                                            <Star size={12} className="text-gold fill-gold" />
                                            <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 * (5 - star) }}
                                                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                                                />
                                            </div>
                                            <span className="w-6 text-right text-text-muted">{count}</span>
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
                                                <img src={review.avatar} alt={review.author} className="w-9 h-9 rounded-xl bg-primary/10" />
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

                            {/* Show More Button */}
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
                        </div>

                        {/* Review Form Modal */}
                        <ReviewForm
                            isOpen={showReviewForm}
                            onClose={() => setShowReviewForm(false)}
                            onSubmit={handleAddReview}
                            targetName={room.title}
                            targetAvatar={room.thumbnail}
                        />
                    </div>

                    {/* Right - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 glass rounded-2xl p-6 space-y-4">
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{formatCurrency(room.rent)}</span>
                                    <span className="text-text-muted text-sm"> / {t('common.month')}</span>
                                </div>
                                <span className="text-xs text-secondary font-medium">{t('roomDetail.availableNow')}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-xs text-text-muted mb-1">{t('roomDetail.moveIn')}</div>
                                    <div className="text-text font-medium">{new Date(room.availableFrom).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { month: "short", day: "numeric", year: "numeric" })}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-muted mb-1">{t('roomDetail.duration')}</div>
                                    <div className="text-text font-medium">{room.duration}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-text-muted mb-1">{t('roomDetail.roomType')}</div>
                                <div className="text-text font-medium text-sm">{room.roomType}</div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow cursor-pointer border-0 text-base btn-glow"
                            >
                                {t('roomDetail.bookViewing')}
                            </motion.button>

                            <div className="text-center text-xs text-text-muted">{t('roomDetail.orContactHost')}</div>

                            <textarea
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                className="w-full p-3 rounded-xl border border-text/10 text-sm text-text resize-none focus:outline-none focus:border-primary/40 bg-bg/50"
                                rows={3}
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-2.5 rounded-xl border border-text/20 text-text font-medium text-sm hover:bg-bg transition-colors cursor-pointer bg-transparent flex items-center justify-center gap-2"
                            >
                                <Send size={14} /> {t('roomDetail.sendMessage')}
                            </motion.button>

                            <p className="text-[10px] text-text-muted text-center">{t('roomDetail.notChargedYet')}</p>

                            <div className="flex justify-center gap-6 pt-2 border-t border-white/30">
                                <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0">
                                    <Share2 size={14} /> {t('common.share')}
                                </button>
                                <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0">
                                    <Bookmark size={14} /> {t('common.save')}
                                </button>
                            </div>

                            {/* Owner Info */}
                            <div className="pt-4 border-t border-white/30">
                                <div className="flex items-center gap-3">
                                    <img src={room.owner.avatar} alt={room.owner.name} className="w-10 h-10 rounded-full bg-primary/10" />
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-text">{room.owner.name}</div>
                                        <div className="text-xs text-text-muted">{room.owner.responseTime}</div>
                                    </div>
                                    <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer border-0 hover:bg-primary/20 transition-colors">
                                        <Phone size={14} className="text-primary" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
