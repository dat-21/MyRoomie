import { motion } from "framer-motion";

interface LineChartData {
  label: string;
  value: number;
}

interface Props {
  data: LineChartData[];
  title: string;
  color?: string;
  showArea?: boolean;
  height?: number;
}

export default function AdminLineChart({
  data,
  title,
  color = "#6366f1",
  showArea = true,
  height = 200,
}: Props) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const padding = { top: 20, right: 20, bottom: 30, left: 20 };
  const chartWidth = 100; // percentage-based
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - item.value) / (maxValue - minValue || 1)) * chartHeight + padding.top;
    return { x, y, ...item };
  });

  // Create path
  const linePath = points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${point.x}% ${point.y}`;
    })
    .join(" ");

  // Create area path
  const areaPath = `${linePath} L 100% ${chartHeight + padding.top} L 0% ${chartHeight + padding.top} Z`;

  // Calculate trend
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const trendPercent = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = trendPercent >= 0;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">
          {title}
        </h3>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? "+" : ""}
          {trendPercent.toFixed(1)}%
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = (percent / 100) * chartHeight + padding.top;
            return (
              <line
                key={percent}
                x1="0%"
                y1={y}
                x2="100%"
                y2={y}
                stroke="rgba(0,0,0,0.05)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area under the line */}
          {showArea && (
            <motion.path
              d={areaPath}
              fill={`url(#gradient-${title.replace(/\s+/g, "")})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={`${point.x}%`}
              cy={point.y}
              r="3"
              fill="white"
              stroke={color}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${title.replace(/\s+/g, "")}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          {data.map((item, index) => (
            <span
              key={index}
              className="text-[10px] text-text-muted"
              style={{
                position: "absolute",
                left: `${(index / (data.length - 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex justify-between mt-4 pt-4 border-t border-white/20">
        <div>
          <div className="text-xs text-text-muted">Min</div>
          <div className="text-sm font-semibold text-text">{minValue.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-text-muted">Average</div>
          <div className="text-sm font-semibold text-text">
            {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-muted">Max</div>
          <div className="text-sm font-semibold text-text">{maxValue.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
