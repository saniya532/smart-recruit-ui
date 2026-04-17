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
    <section id="ats" className="container space-y-6 py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ATS Compatibility</h2>
          <p className="text-sm text-muted-foreground">How well will resume parsers read this resume?</p>
        </div>
        <Button onClick={run} disabled={loading} variant="outline-glow">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          Run ATS Check
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass flex flex-col items-center justify-center rounded-3xl p-6">
          {result ? (
            <AtsGauge score={result.ats_score} />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Run an ATS check to see the score</p>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> Formatting Issues
          </div>
          {result?.formatting_issues.length ? (
            <ul className="space-y-2">
              {result.formatting_issues.map((iss, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  <span className="text-foreground/90">{iss}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No analysis yet</p>
          )}
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <BarChart3 className="h-3.5 w-3.5" /> Keyword Density
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
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(k.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="glass rounded-3xl p-6 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-warning">
              <Lightbulb className="h-3.5 w-3.5" /> Improvement Tips
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {result.tips.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-warning/20 bg-warning/5 p-4"
                >
                  <p className="mb-1 font-mono text-xs text-warning">TIP {String(i + 1).padStart(2, "0")}</p>
                  <p className="text-sm text-foreground/90">{t}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
