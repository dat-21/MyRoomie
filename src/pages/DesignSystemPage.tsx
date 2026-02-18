import { useState } from "react";
import { motion } from "framer-motion";
import {
    Palette,
    Type,
    LayoutGrid,
    Layers,
    Monitor,
    Smartphone,
    Copy,
    Check,
    ArrowRight,
    Heart,
    Search,
    PlusCircle,
    ShieldCheck,
    Sparkles,
    Eye,
} from "lucide-react";
import { useInView } from "../hooks/useInView";
import { roommates } from "../data/mockData";
import RoommateCard from "../components/RoommateCard";

/* ── Section wrapper with fade-in ── */
function Section({
    children,
    className = "",
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    const [ref, inView] = useInView(0.08);
    return (
        <motion.section
            ref={ref}
            id={id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={className}
        >
            {children}
        </motion.section>
    );
}

/* ── Color Swatch ── */
function ColorSwatch({
    name,
    hex,
    variable,
    className = "",
}: {
    name: string;
    hex: string;
    variable: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-2xl overflow-hidden cursor-pointer group"
            onClick={copy}
        >
            <div className={`h-28 sm:h-32 ${className}`} style={{ backgroundColor: hex }} />
            <div className="p-4 relative">
                <div className="text-sm font-semibold text-text font-[family-name:var(--font-family-heading)]">
                    {name}
                </div>
                <div className="text-xs text-text-muted mt-1 font-mono">{hex}</div>
                <div className="text-[10px] text-text-muted/60 mt-0.5 font-mono">{variable}</div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? (
                        <Check size={14} className="text-secondary" />
                    ) : (
                        <Copy size={14} className="text-text-muted" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ── TOC sidebar link ── */
function TOCLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    return (
        <a
            href={href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text-light hover:text-primary hover:bg-primary/5 transition-all no-underline"
        >
            <Icon size={15} />
            {label}
        </a>
    );
}

/* ═══════════════════════════════════════ */
/*               MAIN PAGE                */
/* ═══════════════════════════════════════ */
export default function DesignSystemPage() {
    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        <Palette size={16} />
                        Design System
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-text font-[family-name:var(--font-family-heading)] leading-tight">
                        My Roomie{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Design System
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-text-light max-w-2xl leading-relaxed">
                        A comprehensive visual guide to the design language, components, and patterns
                        used in the My Roomie roommate matching platform.
                    </p>
                </motion.div>

                {/* ── Layout: TOC + Content ── */}
                <div className="flex gap-10">
                    {/* Sticky TOC (desktop) */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="sticky top-24 glass rounded-2xl p-4 space-y-1">
                            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3">
                                On this page
                            </div>
                            <TOCLink href="#colors" label="Colors" icon={Palette} />
                            <TOCLink href="#typography" label="Typography" icon={Type} />
                            <TOCLink href="#components" label="Components" icon={LayoutGrid} />
                            <TOCLink href="#cards" label="Cards" icon={Layers} />
                            <TOCLink href="#pages" label="Page Previews" icon={Monitor} />
                            <TOCLink href="#responsive" label="Responsive" icon={Smartphone} />
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 space-y-16">
                        {/* ═══════════ 1. COLOR PALETTE ═══════════ */}
                        <Section id="colors">
                            <SectionHeader
                                number="01"
                                title="Color Palette"
                                subtitle="A harmonious palette designed to feel safe, smart, and social."
                            />

                            {/* Primary Colors */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Primary Colors
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <ColorSwatch name="Primary" hex="#4A90E2" variable="--color-primary" />
                                    <ColorSwatch name="Primary Light" hex="#6BA5E9" variable="--color-primary-light" />
                                    <ColorSwatch name="Primary Dark" hex="#3578C7" variable="--color-primary-dark" />
                                    <ColorSwatch name="Secondary" hex="#2EC4B6" variable="--color-secondary" />
                                    <ColorSwatch name="Accent" hex="#FF6B6B" variable="--color-accent" />
                                </div>
                            </div>

                            {/* Neutral Colors */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Neutrals & Backgrounds
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <ColorSwatch name="Background" hex="#F7F9FC" variable="--color-bg" className="border border-gray-200" />
                                    <ColorSwatch name="Card BG" hex="rgba(255,255,255,0.7)" variable="--color-bg-card" className="border border-gray-200" />
                                    <ColorSwatch name="Text" hex="#1F2D3D" variable="--color-text" />
                                    <ColorSwatch name="Text Light" hex="#5A6B7F" variable="--color-text-light" />
                                    <ColorSwatch name="Text Muted" hex="#8B9CB5" variable="--color-text-muted" />
                                </div>
                            </div>

                            {/* Gradient showcase */}
                            <div>
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Gradients
                                </h3>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="h-24 rounded-2xl bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Primary Gradient</span>
                                    </div>
                                    <div className="h-24 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Secondary Gradient</span>
                                    </div>
                                    <div className="h-24 rounded-2xl animated-gradient flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Animated Gradient</span>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ═══════════ 2. TYPOGRAPHY ═══════════ */}
                        <Section id="typography">
                            <SectionHeader
                                number="02"
                                title="Typography"
                                subtitle="Poppins for headings, Inter for body. Clean hierarchy with friendly presence."
                            />

                            <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
                                {/* Font families */}
                                <div className="grid sm:grid-cols-2 gap-8 pb-6 border-b border-white/30">
                                    <div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Heading Font</div>
                                        <div className="text-4xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                                            Poppins
                                        </div>
                                        <div className="text-sm text-text-light mt-2 font-[family-name:var(--font-family-heading)]">
                                            ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                            <br />
                                            abcdefghijklmnopqrstuvwxyz
                                            <br />
                                            0123456789
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Body Font</div>
                                        <div className="text-4xl font-bold text-text font-[family-name:var(--font-family-body)]">
                                            Inter
                                        </div>
                                        <div className="text-sm text-text-light mt-2">
                                            ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                            <br />
                                            abcdefghijklmnopqrstuvwxyz
                                            <br />
                                            0123456789
                                        </div>
                                    </div>
                                </div>

                                {/* Type scale */}
                                <div>
                                    <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Type Scale</div>
                                    <div className="space-y-4">
                                        {[
                                            { size: "text-5xl", label: "H1 — 48px", weight: "font-bold", text: "Find Your Perfect Roommate" },
                                            { size: "text-4xl", label: "H2 — 36px", weight: "font-bold", text: "How It Works" },
                                            { size: "text-3xl", label: "H3 — 30px", weight: "font-semibold", text: "Smart Matching System" },
                                            { size: "text-xl", label: "H4 — 20px", weight: "font-semibold", text: "Lifestyle Preferences" },
                                            { size: "text-lg", label: "Body Large", weight: "font-normal", text: "Your ideal roommate is just a few clicks away." },
                                            { size: "text-base", label: "Body — 16px", weight: "font-normal", text: "We match you based on sleep schedules, cleanliness, and more." },
                                            { size: "text-sm", label: "Small — 14px", weight: "font-normal", text: "Compatible lifestyle tags include Non-smoker, Early Bird, Clean." },
                                            { size: "text-xs", label: "Caption — 12px", weight: "font-medium", text: "Last updated 2 hours ago" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-baseline gap-4 py-2 border-b border-white/20 last:border-0">
                                                <span className="text-[10px] text-text-muted font-mono w-28 flex-shrink-0">{item.label}</span>
                                                <span
                                                    className={`${item.size} ${item.weight} text-text font-[family-name:var(--font-family-heading)] leading-tight`}
                                                >
                                                    {item.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ═══════════ 3. COMPONENTS ═══════════ */}
                        <Section id="components">
                            <SectionHeader
                                number="03"
                                title="UI Components"
                                subtitle="Reusable building blocks with glassmorphism, rounded corners, and micro-interactions."
                            />

                            {/* Buttons */}
                            <div className="mb-10">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Buttons
                                </h3>
                                <div className="glass rounded-2xl p-6 sm:p-8">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="btn-glow flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-lg shadow-primary/25 cursor-pointer border-0"
                                        >
                                            <Search size={16} />
                                            Primary CTA
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="btn-glow flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold shadow-lg shadow-secondary/25 cursor-pointer border-0"
                                        >
                                            <Heart size={16} />
                                            Secondary CTA
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/70 text-text font-semibold shadow-md border border-white/40 backdrop-blur-sm cursor-pointer"
                                        >
                                            <PlusCircle size={16} className="text-secondary" />
                                            Ghost Button
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent/10 text-accent font-semibold cursor-pointer border-0"
                                        >
                                            <Sparkles size={16} />
                                            Subtle Button
                                        </motion.button>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs font-medium shadow-md cursor-pointer border-0"
                                        >
                                            <Eye size={14} />
                                            Small Primary
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium cursor-pointer border-0"
                                        >
                                            Small Subtle
                                        </motion.button>
                                        <button className="px-4 py-2 rounded-xl bg-white/40 text-text-muted text-xs font-medium cursor-not-allowed border-0">
                                            Disabled
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tags / Chips */}
                            <div className="mb-10">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Tags & Chips
                                </h3>
                                <div className="glass rounded-2xl p-6 sm:p-8">
                                    <div className="flex flex-wrap gap-2">
                                        {["Early Bird", "Clean", "Non-smoker", "Tech Lover", "Gym Goer", "Night Owl", "Foodie"].map(
                                            (tag) => (
                                                <motion.span
                                                    key={tag}
                                                    whileHover={{ scale: 1.08, y: -1 }}
                                                    className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary cursor-default"
                                                >
                                                    {tag}
                                                </motion.span>
                                            )
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {["Selected Tag", "Active Filter"].map((tag) => (
                                            <motion.span
                                                key={tag}
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-secondary text-white shadow-md shadow-secondary/20 cursor-default"
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent">
                                            Warning Tag
                                        </span>
                                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-text-muted/10 text-text-muted">
                                            +3 more
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Glassmorphism */}
                            <div className="mb-10">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Glassmorphism Cards
                                </h3>
                                <div className="relative">
                                    {/* Colorful background to show glass effect */}
                                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-[60px]" />
                                        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-[50px]" />
                                        <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-accent/20 rounded-full blur-[50px]" />
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-4 p-6">
                                        <div className="glass rounded-2xl p-6">
                                            <div className="text-sm font-semibold text-text mb-2">.glass</div>
                                            <p className="text-xs text-text-light">
                                                60% white background with 16px blur. Standard card surface.
                                            </p>
                                        </div>
                                        <div className="glass-strong rounded-2xl p-6">
                                            <div className="text-sm font-semibold text-text mb-2">.glass-strong</div>
                                            <p className="text-xs text-text-light">
                                                80% white background with 24px blur. For nav and elevated surfaces.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary to-secondary text-white">
                                            <div className="text-sm font-semibold mb-2">Gradient Fill</div>
                                            <p className="text-xs text-white/80">
                                                For CTAs, highlights, and accent sections.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Elements */}
                            <div>
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Form Elements
                                </h3>
                                <div className="glass rounded-2xl p-6 sm:p-8 space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">Text Input</label>
                                            <input
                                                type="text"
                                                placeholder="Enter something..."
                                                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1.5">Select</label>
                                            <select className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
                                                <option>Compatibility</option>
                                                <option>Budget: Low → High</option>
                                                <option>Move-in Date</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">Textarea</label>
                                        <textarea
                                            placeholder="Describe your room..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">Range Slider</label>
                                        <input type="range" className="w-full accent-primary" />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ═══════════ 4. ROOMMATE CARDS ═══════════ */}
                        <Section id="cards">
                            <SectionHeader
                                number="04"
                                title="Roommate Cards"
                                subtitle="The core UI unit — showing compatibility score, lifestyle tags, and key info at a glance."
                            />

                            <div className="grid sm:grid-cols-2 gap-5">
                                {roommates.slice(0, 4).map((r, i) => (
                                    <RoommateCard key={r.id} roommate={r} index={i} />
                                ))}
                            </div>

                            {/* Skeleton */}
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Loading Skeleton
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="glass rounded-2xl p-5 flex flex-col gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl skeleton" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 w-28 skeleton" />
                                                    <div className="h-3 w-20 skeleton" />
                                                    <div className="h-3 w-32 skeleton" />
                                                </div>
                                                <div className="w-16 h-16 rounded-full skeleton" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full skeleton" />
                                                <div className="h-3 w-3/4 skeleton" />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-6 w-16 rounded-full skeleton" />
                                                <div className="h-6 w-20 rounded-full skeleton" />
                                                <div className="h-6 w-14 rounded-full skeleton" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ═══════════ 5. PAGE PREVIEWS ═══════════ */}
                        <Section id="pages">
                            <SectionHeader
                                number="05"
                                title="Page Previews"
                                subtitle="All main application screens with their purpose and key elements."
                            />

                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Landing Page",
                                        path: "/",
                                        description:
                                            "Hero section with animated background blobs, How It Works (3-step flow), Feature highlights, and CTA section with animated gradient.",
                                        features: ["Hero with dual CTA", "Stats counter", "How It Works steps", "Feature grid", "Animated gradient CTA"],
                                        color: "from-primary to-primary-light",
                                    },
                                    {
                                        title: "Find Roommate (Core)",
                                        path: "/find",
                                        description:
                                            "The flagship page. Smart suggestion cards with compatibility scores, filter sidebar (budget, gender, date, lifestyle), search, and sort. Responsive drawer on mobile.",
                                        features: ["Search bar", "Filter sidebar", "Active filter chips", "Sort dropdown", "Animated card grid", "Empty state"],
                                        color: "from-primary to-secondary",
                                    },
                                    {
                                        title: "Post Room Slot",
                                        path: "/post",
                                        description:
                                            "Multi-step wizard with animated progress bar. Room details → Lifestyle expectations → Description → Review & publish.",
                                        features: ["4-step wizard", "Progress indicator", "Animated transitions", "Lifestyle tag picker", "Review summary"],
                                        color: "from-secondary to-secondary-light",
                                    },
                                    {
                                        title: "Profile Page",
                                        path: "/profile",
                                        description:
                                            "User profile with editable bio and lifestyle tags. Detailed preference display. Matching score preview with top matches.",
                                        features: ["Editable bio", "Lifestyle tag editor", "Preference grid", "Match preview", "Large compatibility ring"],
                                        color: "from-accent to-accent-light",
                                    },
                                ].map((page) => (
                                    <motion.div
                                        key={page.title}
                                        whileHover={{ y: -3 }}
                                        className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6"
                                    >
                                        {/* Color bar */}
                                        <div className={`w-full sm:w-2 sm:min-h-full rounded-full bg-gradient-to-b ${page.color} flex-shrink-0 h-2 sm:h-auto`} />

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">
                                                    {page.title}
                                                </h3>
                                                <span className="text-xs font-mono text-text-muted bg-text-muted/10 px-2 py-0.5 rounded-lg">
                                                    {page.path}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-light leading-relaxed mb-4">{page.description}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {page.features.map((f) => (
                                                    <span
                                                        key={f}
                                                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                    >
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <a
                                            href={page.path}
                                            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors no-underline self-start sm:self-center flex-shrink-0"
                                        >
                                            View <ArrowRight size={14} />
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>

                        {/* ═══════════ 6. RESPONSIVE ═══════════ */}
                        <Section id="responsive">
                            <SectionHeader
                                number="06"
                                title="Responsive & Interactions"
                                subtitle="Mobile-first design with smooth animations and micro-interactions throughout."
                            />

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Design principles */}
                                {[
                                    {
                                        icon: Smartphone,
                                        title: "Mobile-First",
                                        items: ["Collapsible nav hamburger", "Drawer filter sidebar", "Stacked card grid", "Touch-friendly targets (44px+)"],
                                    },
                                    {
                                        icon: Monitor,
                                        title: "Desktop Enhanced",
                                        items: ["Persistent filter sidebar", "2-column card grid", "Hover lift effects", "Sticky table of contents"],
                                    },
                                    {
                                        icon: Sparkles,
                                        title: "Micro-Interactions",
                                        items: ["Compatibility count-up animation", "Tag hover scale + lift", "Button glow/ripple on click", "Card hover lift (-6px)"],
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: "UX Philosophy",
                                        items: ["User feels Safe", "User feels Matched", "User feels Understood", "User feels In Control"],
                                    },
                                ].map((block) => {
                                    const Icon = block.icon;
                                    return (
                                        <motion.div
                                            key={block.title}
                                            whileHover={{ y: -4 }}
                                            className="glass rounded-2xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <Icon size={18} className="text-primary" />
                                                </div>
                                                <h3 className="text-base font-semibold text-text font-[family-name:var(--font-family-heading)]">
                                                    {block.title}
                                                </h3>
                                            </div>
                                            <ul className="space-y-2 list-none p-0 m-0">
                                                {block.items.map((item) => (
                                                    <li key={item} className="flex items-center gap-2 text-sm text-text-light">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Spacing & Radius */}
                            <div className="glass rounded-2xl p-6 sm:p-8 mt-8">
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                    Spacing & Corner Radius
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-sm font-medium text-text mb-3">Border Radius</div>
                                        <div className="flex items-end gap-4">
                                            {[
                                                { r: "rounded-lg", label: "8px", size: "w-12 h-12" },
                                                { r: "rounded-xl", label: "12px", size: "w-14 h-14" },
                                                { r: "rounded-2xl", label: "16px", size: "w-16 h-16" },
                                                { r: "rounded-3xl", label: "24px", size: "w-18 h-18" },
                                                { r: "rounded-full", label: "Full", size: "w-16 h-16" },
                                            ].map((item) => (
                                                <div key={item.label} className="text-center">
                                                    <div className={`${item.size} ${item.r} bg-primary/20 border-2 border-primary/40 mx-auto mb-2`} />
                                                    <span className="text-[10px] text-text-muted font-mono">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-text mb-3">Shadow Levels</div>
                                        <div className="flex items-end gap-4">
                                            {[
                                                { s: "shadow-md", label: "Medium" },
                                                { s: "shadow-lg shadow-primary/10", label: "Large" },
                                                { s: "shadow-xl shadow-primary/20", label: "X-Large" },
                                            ].map((item) => (
                                                <div key={item.label} className="text-center">
                                                    <div className={`w-16 h-16 rounded-2xl bg-white ${item.s} mx-auto mb-2`} />
                                                    <span className="text-[10px] text-text-muted font-mono">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Footer separator */}
                        <div className="text-center pt-8 pb-4">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 text-text-muted text-sm">
                                <Palette size={14} className="text-primary" />
                                End of Design System — My Roomie v1.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Section Header ── */
function SectionHeader({
    number,
    title,
    subtitle,
}: {
    number: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-primary/40 font-mono">{number}</span>
                <div className="h-px flex-1 bg-primary/10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                {title}
            </h2>
            <p className="mt-2 text-text-light">{subtitle}</p>
        </div>
    );
}
