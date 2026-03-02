import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { useCountUp } from "../hooks/useCountUp";
import { MapPin, Calendar, BadgeCheck, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Roommate } from "../data/mockData";
import { formatCurrency } from "../data/mockData";

interface Props {
    roommate: Roommate;
    index?: number;
}

function CompatibilityRing({ value, started }: { value: number; started: boolean }) {
    const count = useCountUp(value, 1200, started);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (count / 100) * circumference;

    const color =
        value >= 85 ? "var(--color-secondary)" : value >= 70 ? "var(--color-primary)" : "var(--color-accent)";

    return (
        <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-divider)" strokeWidth="5" />
                <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color }}>{count}%</span>
            </div>
        </div>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <motion.span
            whileHover={{ scale: 1.08, y: -1 }}
            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-default transition-colors hover:bg-primary/20"
        >
            {label}
        </motion.span>
    );
}

export default function RoommateCard({ roommate, index = 0 }: Props) {
    const [ref, inView] = useInView(0.15);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="relative">
                    <img
                        src={roommate.avatar}
                        alt={roommate.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-primary/10"
                    />
                    {roommate.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                            <BadgeCheck size={12} className="text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-text truncate font-[family-name:var(--font-family-heading)]">
                            {roommate.name}
                        </h3>
                        <span className="text-xs text-text-muted">{roommate.age}y</span>
                    </div>
                    <p className="text-xs text-text-light mt-0.5">{roommate.occupation}</p>
                    <div className="flex items-center gap-1 mt-1 text-text-muted">
                        <MapPin size={12} />
                        <span className="text-xs">{roommate.location}</span>
                    </div>
                </div>

                <CompatibilityRing value={roommate.compatibility} started={inView} />
            </div>

            {/* Bio */}
            <p className="text-sm text-text-light leading-relaxed line-clamp-2">
                {roommate.bio}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
                {roommate.lifestyleTags.slice(0, 4).map((tag) => (
                    <Tag key={tag} label={tag} />
                ))}
                {roommate.lifestyleTags.length > 4 && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-text-muted/10 text-text-muted">
                        +{roommate.lifestyleTags.length - 4}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-text-light">
                        <span className="text-xs font-medium">
                            {formatCurrency(roommate.budget.min)} - {formatCurrency(roommate.budget.max)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted">
                        <Calendar size={12} />
                        <span className="text-xs">
                            {new Date(roommate.moveInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                    </div>
                </div>

                <Link to={`/profile/${roommate.id}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow cursor-pointer border-0"
                    >
                        <Eye size={14} />
                        View Details
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
}
