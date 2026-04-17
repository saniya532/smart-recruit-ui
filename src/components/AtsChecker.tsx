import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Shield, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AtsGauge } from "./AtsGauge";
import { checkATS } from "@/lib/api";
import { toast } from "sonner";

interface AtsResult {
  ats_score: number;
  formatting_issues: string[];
  keyword_density: { keyword: string; count: number }[];
  tips: string[];
}

export const AtsChecker = ({ file }: { file: File | null }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);

  const run = async () => {
    if (!file) return toast.error("Upload a resume first");
    setLoading(true);
    try {
      const data = await checkATS(file);
      setResult(data);
      toast.success("ATS analysis complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "ATS check failed";
      setResult({
        ats_score: 78,
        formatting_issues: [
          "2 images detected — ATS parsers may skip them",
          "Multi-column layout may scramble reading order",
        ],
        keyword_density: [
          { keyword: "React", count: 8 },
          { keyword: "TypeScript", count: 6 },
          { keyword: "API", count: 5 },
          { keyword: "Agile", count: 3 },
          { keyword: "AWS", count: 2 },
        ],
        tips: [
          "Use a single-column layout for maximum ATS compatibility",
          "Replace icons with plain-text labels in the contact section",
          "Add a dedicated 'Skills' section with relevant keywords",
        ],
      });
      toast.error(`Backend offline — showing demo. ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const maxCount = Math.max(...(result?.keyword_density.map((k) => k.count) ?? [1]));

  return (
    <section id="ats" className="container py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">
            <span className="h-px w-6 bg-warning" /> 03 — ATS Compatibility
          </span>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Will the parser read it?</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Most resumes never reach a human. We simulate parsers and surface what to fix.
          </p>
        </div>
        <Button onClick={run} disabled={loading} variant="outline-glow">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
          Run ATS check
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass hairline flex flex-col items-center justify-center rounded-2xl p-6">
          {result ? (
            <AtsGauge score={result.ats_score} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No score yet</p>
              <p className="text-xs text-muted-foreground">Run a check to see results</p>
            </div>
          )}
        </div>

        <div className="glass hairline rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">
              <AlertTriangle className="h-3 w-3 text-warning" /> Formatting Issues
            </span>
            {result && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {result.formatting_issues.length}
              </span>
            )}
          </div>
          {result?.formatting_issues.length ? (
            <ul className="space-y-2">
              {result.formatting_issues.map((iss, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2.5 rounded-lg border border-warning/15 bg-warning/[0.04] p-3 text-sm"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                  <span className="text-foreground/90 leading-relaxed">{iss}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No analysis yet</p>
          )}
        </div>

        <div className="glass hairline rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">
              <BarChart3 className="h-3 w-3 text-primary" /> Keyword Density
            </span>
            {result && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {result.keyword_density.length}
              </span>
            )}
          </div>
          {result?.keyword_density.length ? (
            <div className="space-y-3">
              {result.keyword_density.map((k, i) => (
                <motion.div
                  key={k.keyword}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{k.keyword}</span>
                    <span className="font-mono text-muted-foreground">×{k.count}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(k.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                      className="h-full rounded-full bg-gradient-primary"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No analysis yet</p>
          )}
        </div>

        {result && (
          <div className="glass hairline rounded-2xl p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow">
                <Lightbulb className="h-3 w-3 text-warning" /> Improvement Recommendations
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{result.tips.length} TIPS</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {result.tips.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-warning/30 hover:bg-warning/[0.03]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-warning/10 font-mono text-[10px] font-medium text-warning">
                      {i + 1}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tip
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{t}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
