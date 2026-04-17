import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, FileSearch, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CircularProgress } from "./CircularProgress";
import { SkillTags } from "./SkillTags";
import { compareJD } from "@/lib/api";
import { toast } from "sonner";

interface Result {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  suggestions: string[];
}

export const JdMatch = ({ file }: { file: File | null }) => {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleCompare = async () => {
    if (!file) return toast.error("Upload a resume first");
    if (jd.trim().length < 30) return toast.error("Paste a more detailed job description");
    setLoading(true);
    try {
      const data = await compareJD(file, jd);
      setResult(data);
      toast.success("Comparison complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Comparison failed";
      setResult({
        match_score: 72,
        matching_skills: ["React", "TypeScript", "REST APIs", "Git", "Agile"],
        missing_skills: ["GraphQL", "AWS", "Kubernetes"],
        suggestions: [
          "Add a project showcasing GraphQL integration",
          "Earn an AWS Cloud Practitioner certification",
          "Highlight container orchestration experience",
        ],
      });
      toast.error(`Backend offline — showing demo. ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="match" className="container py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-2">
        <span className="eyebrow">
          <span className="h-px w-6 bg-accent" /> 02 — Job Description Match
        </span>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Compare against any role</h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Paste a job description to see exactly how this candidate aligns — and what they're missing.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass hairline rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow">
              <FileSearch className="h-3 w-3" /> Job Description
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{jd.length} chars</span>
          </div>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…&#10;&#10;e.g., We're hiring a Senior Frontend Engineer with React, TypeScript, GraphQL, and 5+ years building production systems…"
            className="min-h-[280px] resize-none rounded-xl border-border bg-background/40 text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-primary/40"
          />
          <div className="mt-4 flex items-center justify-end">
            <Button onClick={handleCompare} disabled={loading} variant="hero">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Compare with resume
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <div className="glass hairline rounded-2xl p-6">
          {!result ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                <FileSearch className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Awaiting comparison</p>
              <p className="mt-1 text-xs text-muted-foreground">Run a match to see insights here</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-5">
                <CircularProgress value={result.match_score} size={120} label="JD Match" color="accent" />
                <div className="flex-1 space-y-1">
                  <span className="eyebrow">Verdict</span>
                  <p className="text-base font-semibold leading-snug">
                    {result.match_score >= 75
                      ? "Strong fit — proceed with confidence"
                      : result.match_score >= 50
                      ? "Moderate fit — some gaps to address"
                      : "Low fit — significant gaps detected"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Matching skills · {result.matching_skills.length}
                </div>
                <SkillTags tags={result.matching_skills} variant="matching" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-warning">
                  <XCircle className="h-3.5 w-3.5" />
                  Missing skills · {result.missing_skills.length}
                </div>
                <SkillTags tags={result.missing_skills} variant="missing" />
              </div>

              <div className="space-y-3 border-t border-border/60 pt-5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-warning" />
                  AI Suggestions
                </div>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm leading-relaxed"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-foreground/90">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
