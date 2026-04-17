import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface Props {
  data: { skill: string; value: number }[];
}

export const SkillsRadar = ({ data }: Props) => {
  return (
    <div className="glass hairline rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="eyebrow">
          <Activity className="h-3 w-3 text-accent" /> Skill Radar
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">{data.length} DIMENSIONS</span>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <defs>
              <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
            />
            <Radar
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              fill="url(#radar-fill)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
