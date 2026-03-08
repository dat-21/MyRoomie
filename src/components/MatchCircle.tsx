import { useCountUp } from "../hooks/useCountUp";
import { useTranslation } from "react-i18next";

interface Props {
    value: number;
    size?: "sm" | "md" | "lg";
    started?: boolean;
}

const sizes = {
    sm: { w: 14, h: 14, r: 5, sw: 3, fontSize: "text-[10px]" },
    md: { w: 16, h: 16, r: 36, sw: 5, fontSize: "text-xs" },
    lg: { w: 32, h: 32, r: 54, sw: 6, fontSize: "text-2xl" },
};

export default function MatchCircle({ value, size = "md", started = true }: Props) {
    const count = useCountUp(value, size === "lg" ? 1500 : 1200, started);
    const { t } = useTranslation();
    const s = sizes[size];
    const viewBox = size === "sm" ? "0 0 32 32" : size === "md" ? "0 0 80 80" : "0 0 120 120";
    const cx = size === "sm" ? 16 : size === "md" ? 40 : 60;
    const cy = cx;
    const r = size === "sm" ? 12 : s.r;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (count / 100) * circumference;
    const color = value >= 85 ? "var(--color-secondary)" : value >= 70 ? "var(--color-primary)" : "var(--color-accent)";

    return (
        <div className={`relative flex-shrink-0`} style={{ width: `${s.w * 4}px`, height: `${s.h * 4}px` }}>
            <svg className="w-full h-full -rotate-90" viewBox={viewBox}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={s.sw} />
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none" stroke={color} strokeWidth={s.sw}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`${s.fontSize} font-bold`} style={{ color }}>{count}%</span>
                {size === "lg" && <span className="text-[10px] text-text-muted">{t('common.match')}</span>}
            </div>
        </div>
    );
}
