import { motion } from "framer-motion";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: PieChartData[];
  title: string;
  size?: number;
}

export default function AdminPieChart({ data, title, size = 200 }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    const endAngle = currentAngle;

    // Calculate path for arc
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return {
      ...item,
      percentage,
      pathData,
      midAngle: startAngle + angle / 2,
    };
  });

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] mb-4">
        {title}
      </h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* SVG Pie Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice, index) => (
              <motion.path
                key={slice.label}
                d={slice.pathData}
                fill={slice.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              />
            ))}
            {/* Center circle for donut effect */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.55}
              fill="white"
              className="drop-shadow-sm"
            />
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              className="text-2xl font-bold fill-text"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              {total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              className="text-xs fill-text-muted"
            >
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {slices.map((slice, index) => (
            <motion.div
              key={slice.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-text">{slice.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-text">
                  {slice.value.toLocaleString()}
                </span>
                <span className="text-xs text-text-muted w-12 text-right">
                  {slice.percentage.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
