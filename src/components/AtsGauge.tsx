import { motion } from "framer-motion";

interface Props {
  score: number; // 0-100
}

export const AtsGauge = ({ score }: Props) => {
  const clamped = Math.min(Math.max(score, 0), 100);
  // Semi-circle: -90deg (left) → 90deg (right)
  const angle = -90 + (clamped / 100) * 180;

  const colorStop =
    clamped >= 75 ? "hsl(var(--primary))" : clamped >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 95;

  // Build arc path (semi-circle from left to right)
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;

  // Progress arc
  const progressLength = (clamped / 100) * Math.PI * r;
  const totalLength = Math.PI * r;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <defs>
          <linearGradient id="ats-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="50%" stopColor="hsl(var(--warning))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="ats-glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {/* Track */}
        <path d={arcPath} stroke="hsl(var(--border))" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* Progress */}
        <motion.path
          d={arcPath}
          stroke="url(#ats-grad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          initial={{ strokeDashoffset: totalLength }}
          animate={{ strokeDashoffset: totalLength - progressLength }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Needle */}
        <motion.g
          initial={{ rotate: -90, transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: angle, transformOrigin: `${cx}px ${cy}px` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 14} stroke={colorStop} strokeWidth="3" strokeLinecap="round" />
          <circle cx={cx} cy={cy - r + 14} r="5" fill={colorStop} filter="url(#ats-glow)" />
        </motion.g>
        <circle cx={cx} cy={cy} r="8" fill="hsl(var(--background))" stroke={colorStop} strokeWidth="2" />
      </svg>
      <div className="-mt-6 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl font-bold tabular-nums text-gradient"
        >
          {Math.round(clamped)}
        </motion.span>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          ATS Score / 100
        </span>
      </div>
    </div>
  );
};
