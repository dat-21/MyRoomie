import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
    Pencil,
    Save,
    X,
    Heart,
    UserPlus,
    MessageCircle,
    Check,
} from "lucide-react";
import { roommates, currentUser, formatCurrency, lifestyleOptions } from "../data/mockData";
import { useCountUp } from "../hooks/useCountUp";
import ChatPanel from "../components/ChatPanel";
import type { Roommate } from "../data/mockData";

/* ─── Preference item ─── */
function PrefItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-white/20 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs text-text-muted">{label}</div>
                <div className="text-sm font-medium text-text truncate">{value}</div>
            </div>
        </div>
    );
}

/* ─── Compatibility Ring (Large) ─── */
function LargeCompatRing({ value }: { value: number }) {
    const count = useCountUp(value, 1500, true);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (count / 100) * circumference;
    const color = value >= 85 ? "var(--color-secondary)" : value >= 70 ? "var(--color-primary)" : "var(--color-accent)";

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-divider)" strokeWidth="6" />
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color }}>{count}%</span>
                <span className="text-[10px] text-text-muted">Match</span>
            </div>
        </div>
    );
}

/* ─── Profile page for a roommate (view) ─── */
function RoommateProfile({ person }: { person: Roommate }) {
    const [connected, setConnected] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <div className="min-h-screen pt-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-6 sm:p-10"
                >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="relative flex-shrink-0">
                            <img
                                src={person.avatar}
                                alt={person.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-primary/10"
                            />
                            {person.verified && (
                                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow-md">
                                    <BadgeCheck size={16} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                    {person.name}
                                </h1>
                                <span className="text-sm text-text-muted">{person.age}y, {person.gender}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-text-light mt-1">
                                <span className="flex items-center gap-1"><Briefcase size={14} />{person.occupation}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} />{person.location}</span>
                            </div>
                            <p className="mt-4 text-sm text-text-light leading-relaxed">{person.bio}</p>

                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                <div>
                                    <span className="text-text-muted">Budget: </span>
                                    <span className="font-medium text-text">{formatCurrency(person.budget.min)} - {formatCurrency(person.budget.max)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} className="text-text-muted" />
                                    <span className="text-text-muted">Move-in: </span>
                                    <span className="font-medium text-text">
                                        {new Date(person.moveInDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <LargeCompatRing value={person.compatibility} />
                    </div>
                </motion.div>

                {/* Lifestyle Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-6 sm:p-8 mt-6"
                >
                    <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                        <Heart size={18} className="text-accent" />
                        Lifestyle
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {person.lifestyleTags.map((tag) => (
                            <motion.span
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-6 sm:p-8 mt-6"
                >
                    <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                        Living Preferences
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-8">
                        <PrefItem icon={Moon} label="Sleep Schedule" value={person.preferences.sleepSchedule} />
                        <PrefItem icon={Sparkles} label="Cleanliness" value={person.preferences.cleanliness} />
                        <PrefItem icon={Volume2} label="Noise Level" value={person.preferences.noise} />
                        <PrefItem icon={Users} label="Guests" value={person.preferences.guests} />
                        <PrefItem icon={Cigarette} label="Smoking" value={person.preferences.smoking} />
                        <PrefItem icon={Dog} label="Pets" value={person.preferences.pets} />
                        <PrefItem icon={CookingPot} label="Cooking" value={person.preferences.cooking} />
                    </div>
                </motion.div>

                {/* Connect / Message CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex justify-center gap-3"
                >
                    {connected ? (
                        <>
                            <span className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/10 text-secondary font-semibold text-base">
                                <Check size={18} /> Connected
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setChatOpen(true)}
                                className="btn-glow flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 text-base"
                            >
                                <MessageCircle size={18} />
                                Message {person.name.split(" ")[0]}
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setConnected(true)}
                            className="btn-glow flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 text-base"
                        >
                            <UserPlus size={18} />
                            Connect with {person.name.split(" ")[0]}
                        </motion.button>
                    )}
                </motion.div>
            </div>

            {/* Chat Panel */}
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}

/* ─── Own Profile (editable) ─── */
function OwnProfile() {
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState(currentUser.bio);
    const [tags, setTags] = useState(currentUser.lifestyleTags);

    const toggleTag = (tag: string) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-6 sm:p-10"
                >
                    <div className="flex items-start justify-between mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                            My <span className="text-primary">Profile</span>
                        </h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditing(!editing)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-0 ${editing
                                ? "bg-accent/10 text-accent"
                                : "bg-primary/10 text-primary"
                                }`}
                        >
                            {editing ? <X size={14} /> : <Pencil size={14} />}
                            {editing ? "Cancel" : "Edit Profile"}
                        </motion.button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="relative flex-shrink-0">
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-primary/10"
                            />
                            {currentUser.verified && (
                                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow-md">
                                    <BadgeCheck size={16} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                    {currentUser.name === "You" ? "Your Name" : currentUser.name}
                                </h2>
                                <span className="text-sm text-text-muted">{currentUser.age}y, {currentUser.gender}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-text-light mt-1">
                                <span className="flex items-center gap-1"><Briefcase size={14} />{currentUser.occupation}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} />{currentUser.location}</span>
                            </div>

                            {editing ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full mt-4 px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                />
                            ) : (
                                <p className="mt-4 text-sm text-text-light leading-relaxed">{bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                <div>
                                    <span className="text-text-muted">Budget: </span>
                                    <span className="font-medium text-text">{formatCurrency(currentUser.budget.min)} - {formatCurrency(currentUser.budget.max)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lifestyle Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-6 sm:p-8 mt-6"
                >
                    <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)] flex items-center gap-2">
                        <Heart size={18} className="text-accent" />
                        My Lifestyle
                    </h2>

                    {editing ? (
                        <div className="flex flex-wrap gap-2">
                            {lifestyleOptions.map((tag) => (
                                <motion.button
                                    key={tag}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border-0 ${tags.includes(tag)
                                        ? "bg-secondary text-white shadow-md"
                                        : "bg-white/60 text-text-light hover:bg-secondary/10"
                                        }`}
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-6 sm:p-8 mt-6"
                >
                    <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                        Living Preferences
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-8">
                        <PrefItem icon={Moon} label="Sleep Schedule" value={currentUser.preferences.sleepSchedule} />
                        <PrefItem icon={Sparkles} label="Cleanliness" value={currentUser.preferences.cleanliness} />
                        <PrefItem icon={Volume2} label="Noise Level" value={currentUser.preferences.noise} />
                        <PrefItem icon={Users} label="Guests" value={currentUser.preferences.guests} />
                        <PrefItem icon={Cigarette} label="Smoking" value={currentUser.preferences.smoking} />
                        <PrefItem icon={Dog} label="Pets" value={currentUser.preferences.pets} />
                        <PrefItem icon={CookingPot} label="Cooking" value={currentUser.preferences.cooking} />
                    </div>
                </motion.div>

                {/* Matching Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-3xl p-6 sm:p-8 mt-6"
                >
                    <h2 className="text-lg font-semibold text-text mb-4 font-[family-name:var(--font-family-heading)]">
                        Matching Score Preview
                    </h2>
                    <p className="text-sm text-text-light mb-4">
                        Here's how you match with some potential roommates:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {roommates.slice(0, 4).map((r) => (
                            <div key={r.id} className="text-center">
                                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-xl mx-auto mb-2 bg-primary/10" />
                                <div className="text-xs font-medium text-text">{r.name.split(" ")[0]}</div>
                                <div className="text-lg font-bold text-primary">{r.compatibility}%</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Save button (editing mode) */}
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setEditing(false)}
                            className="btn-glow flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0 text-base"
                        >
                            <Save size={18} />
                            Save Changes
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Profile Page ─── */
export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();

    // If an id is provided, show that roommate's profile
    if (id) {
        const person = roommates.find((r) => r.id === id);
        if (!person) {
            return (
                <div className="min-h-screen pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">Profile Not Found</h2>
                        <p className="text-text-light mt-2">This user doesn't exist or has been removed.</p>
                    </div>
                </div>
            );
        }
        return <RoommateProfile person={person} />;
    }

    // Otherwise show current user's profile
    return <OwnProfile />;
}
