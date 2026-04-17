import { motion } from "framer-motion";

interface Props {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: "primary" | "accent" | "warning";
}

export const CircularProgress = ({
  value,
  size = 160,
  strokeWidth = 12,
  label,
  color = "primary",
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  const stroke =
    color === "accent"
      ? "hsl(var(--accent))"
      : color === "warning"
      ? "hsl(var(--warning))"
      : "hsl(var(--primary))";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stroke} stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
          </linearGradient>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${color})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          filter={`url(#glow-${color})`}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Math.round(value)}
          <span className="text-base text-muted-foreground">%</span>
        </motion.span>
        {label && <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
};
