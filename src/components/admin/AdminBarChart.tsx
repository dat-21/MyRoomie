import { motion } from "framer-motion";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: BarChartData[];
  title: string;
  horizontal?: boolean;
  showValues?: boolean;
  maxValue?: number;
  barHeight?: number;
  animate?: boolean;
}

export default function AdminBarChart({
  data,
  title,
  horizontal = false,
  showValues = true,
  maxValue,
  barHeight = 32,
  animate = true,
}: Props) {
  const max = maxValue || Math.max(...data.map((d) => d.value));
  const defaultColors = [
    "#6366f1", // primary
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#14b8a6", // teal
  ];

  if (horizontal) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] mb-6">
          {title}
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100;
            const color = item.color || defaultColors[index % defaultColors.length];

            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-light">{item.label}</span>
                  {showValues && (
                    <span className="font-semibold text-text">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
                <div
                  className="w-full bg-white/40 rounded-full overflow-hidden"
                  style={{ height: barHeight / 2 }}
                >
                  <motion.div
                    initial={animate ? { width: 0 } : { width: `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical bar chart
  const chartHeight = 200;
  const barWidth = Math.min(40, (300 - data.length * 8) / data.length);

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] mb-6">
        {title}
      </h3>
      <div className="flex items-end justify-center gap-2 sm:gap-4" style={{ height: chartHeight }}>
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const color = item.color || defaultColors[index % defaultColors.length];
          const barHeightPx = (percentage / 100) * (chartHeight - 40);

          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2"
              style={{ width: barWidth }}
            >
              {showValues && (
                <motion.span
                  initial={animate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-xs font-semibold text-text"
                >
                  {item.value >= 1000
                    ? `${(item.value / 1000).toFixed(1)}k`
                    : item.value}
                </motion.span>
              )}
              <motion.div
                initial={animate ? { height: 0 } : { height: barHeightPx }}
                animate={{ height: barHeightPx }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="rounded-t-lg w-full"
                style={{
                  background: `linear-gradient(180deg, ${color}, ${color}aa)`,
                  minHeight: 4,
                }}
              />
              <span className="text-[10px] text-text-muted text-center leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Y-axis labels */}
      <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
        <span className="text-[10px] text-text-muted">0</span>
        <span className="text-[10px] text-text-muted">{Math.round(max / 2).toLocaleString()}</span>
        <span className="text-[10px] text-text-muted">{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
