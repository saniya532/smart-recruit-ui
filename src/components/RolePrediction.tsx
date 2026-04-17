import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, TrendingUp, AlertCircle } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { SkillTags } from "./SkillTags";

interface RoleResult {
  predicted_role: string;
  match_percentage: number;
  top_roles: { role: string; score: number }[];
  missing_skills: string[];
}

const SectionHeader = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="mb-8 flex flex-col gap-2">
    <span className="eyebrow">
      <span className="h-px w-6 bg-primary" /> {eyebrow}
    </span>
    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
  </div>
);

export const RolePrediction = ({ data }: { data: RoleResult }) => {
  return (
    <motion.section
      id="analysis"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-12 md:py-16"
    >
      <SectionHeader
        eyebrow="01 — Role Intelligence"
        title="Predicted career path"
        description="Our model ranks the most likely roles based on skills, experience, and language signals in the resume."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Predicted Role + ring */}
        <div className="glass hairline rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="eyebrow">
              <Briefcase className="h-3 w-3" /> Best Match
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
              TOP 1
            </span>
          </div>
          <h3 className="mb-6 text-xl font-semibold leading-tight">{data.predicted_role}</h3>
          <div className="flex items-center justify-center pb-2">
            <CircularProgress value={data.match_percentage} label="Match" />
          </div>
        </div>

        {/* Top 3 roles bar chart */}
        <div className="glass hairline rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <span className="eyebrow">
              <TrendingUp className="h-3 w-3" /> Role Ranking
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">PROBABILITY · %</span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_roles} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="bar-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="role"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={150}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: "0 8px 24px hsl(220 30% 2% / 0.5)",
                  }}
                />
                <Bar dataKey="score" fill="url(#bar-grad)" radius={[0, 6, 6, 0]} barSize={18}>
                  {data.top_roles.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing skills */}
        <div className="glass hairline rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">
              <AlertCircle className="h-3 w-3 text-warning" /> Skills Gap
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{data.missing_skills.length} GAPS DETECTED</span>
          </div>
          <SkillTags tags={data.missing_skills} variant="missing" />
        </div>
      </div>
    </motion.section>
  );
};
