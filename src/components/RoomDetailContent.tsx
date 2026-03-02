import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Bed, Bath, Maximize, Wifi, Wind, Car, PawPrint, ChevronLeft, ChevronRight, Share2, Bookmark, Phone, Send, Users } from "lucide-react";
import type { RoomListing } from "../data/mockData";
import { formatCurrency } from "../data/mockData";
import MatchCircle from "./MatchCircle";

interface Props {
    room: RoomListing;
}

export default function RoomDetailContent({ room }: Props) {
    const [currentImage, setCurrentImage] = useState(0);
    const [contactMessage, setContactMessage] = useState("Hi, I'm interested in this room...");

    const nextImage = () => setCurrentImage((i) => (i + 1) % room.images.length);
    const prevImage = () => setCurrentImage((i) => (i - 1 + room.images.length) % room.images.length);

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
                            <BadgeCheck size={12} /> Verified
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
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-semibold text-text">{room.rating}</span>
                                <span className="text-sm text-text-muted">({room.reviewCount} reviews)</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{room.title}</h2>
                            <div className="flex items-center gap-1.5 mt-1 text-text-muted">
                                <MapPin size={14} />
                                <span className="text-sm">{room.location}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Bed size={16} className="text-primary" />
                                <span>{room.bedrooms} Bedroom{room.bedrooms > 1 ? "s" : ""}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Bath size={16} className="text-primary" />
                                <span>{room.bathrooms} Bathroom{room.bathrooms > 1 ? "s" : ""}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg text-sm">
                                <Maximize size={16} className="text-primary" />
                                <span>{room.area} m²</span>
                            </div>
                        </div>

                        {/* Current Roommates */}
                        {room.currentRoommates.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">Current Roommates</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {room.currentRoommates.map((rm) => (
                                        <div key={rm.name} className="flex items-start gap-3 p-3 rounded-xl bg-bg">
                                            <img src={rm.avatar} alt={rm.name} className="w-10 h-10 rounded-xl bg-primary/10" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-text">{rm.name}</div>
                                                <div className="text-xs text-text-muted">{rm.occupation} · {rm.age}y</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {rm.tags.map((t) => (
                                                        <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{t}</span>
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
                            <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">About this place</h3>
                            <p className="text-sm text-text-light leading-relaxed whitespace-pre-line">{room.description}</p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-semibold text-text mb-3 font-[family-name:var(--font-family-heading)]">What this place offers</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {room.amenities.slice(0, 6).map((a) => (
                                    <div key={a} className="flex items-center gap-2 text-sm text-text-light py-1">
                                        {a.toLowerCase().includes("wifi") ? <Wifi size={16} className="text-primary" /> :
                                            a.toLowerCase().includes("air") ? <Wind size={16} className="text-primary" /> :
                                                a.toLowerCase().includes("parking") ? <Car size={16} className="text-primary" /> :
                                                    a.toLowerCase().includes("pet") ? <PawPrint size={16} className="text-primary" /> :
                                                        <BadgeCheck size={16} className="text-primary" />}
                                        {a}
                                    </div>
                                ))}
                            </div>
                            {room.amenities.length > 6 && (
                                <button className="mt-3 px-4 py-2 rounded-xl border border-text/20 text-sm font-medium text-text hover:bg-bg transition-colors cursor-pointer bg-transparent">
                                    Show all {room.amenities.length} amenities
                                </button>
                            )}
                        </div>

                        {/* Reviews */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-lg font-bold text-text">{room.rating}</span>
                                <span className="text-text-muted">{room.reviewCount} reviews</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {room.reviews.map((review) => (
                                    <div key={review.author} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <img src={review.avatar} alt={review.author} className="w-8 h-8 rounded-full bg-primary/10" />
                                            <div>
                                                <div className="text-sm font-semibold text-text">{review.author}</div>
                                                <div className="text-xs text-text-muted">{review.date}</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-light leading-relaxed">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                            {room.reviewCount > 2 && (
                                <button className="mt-3 px-4 py-2 rounded-xl border border-text/20 text-sm font-medium text-text hover:bg-bg transition-colors cursor-pointer bg-transparent">
                                    Show all {room.reviewCount} reviews
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 glass rounded-2xl p-6 space-y-4">
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">{formatCurrency(room.rent)}</span>
                                    <span className="text-text-muted text-sm"> / month</span>
                                </div>
                                <span className="text-xs text-secondary font-medium">Available now</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-xs text-text-muted mb-1">MOVE-IN</div>
                                    <div className="text-text font-medium">{new Date(room.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-muted mb-1">DURATION</div>
                                    <div className="text-text font-medium">{room.duration}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-text-muted mb-1">ROOM TYPE</div>
                                <div className="text-text font-medium text-sm">{room.roomType}</div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow cursor-pointer border-0 text-base btn-glow"
                            >
                                Book a Viewing
                            </motion.button>

                            <div className="text-center text-xs text-text-muted">or contact host</div>

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
                                <Send size={14} /> Send Message
                            </motion.button>

                            <p className="text-[10px] text-text-muted text-center">You won't be charged yet</p>

                            <div className="flex justify-center gap-6 pt-2 border-t border-white/30">
                                <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0">
                                    <Share2 size={14} /> Share
                                </button>
                                <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-0">
                                    <Bookmark size={14} /> Save
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
