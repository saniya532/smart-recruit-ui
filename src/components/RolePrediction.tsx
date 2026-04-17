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

export const RolePrediction = ({ data }: { data: RoleResult }) => {
  return (
    <motion.section
      id="analysis"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container space-y-6 py-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Intelligence</h2>
          <p className="text-sm text-muted-foreground">AI-predicted career path & skill gaps</p>
        </div>
        <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary md:inline-flex">
          MODEL · v3.2
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Predicted Role + ring */}
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" /> Predicted Role
          </div>
          <h3 className="mb-6 text-xl font-bold leading-tight">{data.predicted_role}</h3>
          <div className="flex items-center justify-center pb-2">
            <CircularProgress value={data.match_percentage} label="Match" />
          </div>
        </div>

        {/* Top 3 roles bar chart */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Top Role Matches
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_roles} layout="vertical" margin={{ left: 20, right: 30 }}>
                <defs>
                  <linearGradient id="bar-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  dataKey="role"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={140}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" fill="url(#bar-grad)" radius={[0, 8, 8, 0]} barSize={22}>
                  {data.top_roles.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing skills */}
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Missing Skills To Strengthen
          </div>
          <SkillTags tags={data.missing_skills} variant="missing" />
        </div>
      </div>
    </motion.section>
  );
};
