import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: number;
  color: string;
  delay?: number;
}

export default function AdminStatsCard({
  icon: Icon,
  value,
  label,
  trend,
  color,
  delay = 0,
}: AdminStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-5 flex items-center gap-4"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
          {value}
        </div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
      {trend !== undefined && (
        <div
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend >= 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </div>
      )}
    </motion.div>
  );
}
