import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, FileSearch, Lightbulb } from "lucide-react";
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
      // Fallback demo data if backend is unreachable
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
    <section id="match" className="container space-y-6 py-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Job Description Matching</h2>
        <p className="text-sm text-muted-foreground">Paste any JD to see how well the resume aligns</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <label className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <FileSearch className="h-3.5 w-3.5" /> Job Description
          </label>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here…&#10;&#10;e.g., We're hiring a Senior Frontend Engineer with React, TypeScript, GraphQL…"
            className="min-h-[260px] resize-none border-border bg-background/50 font-mono text-sm leading-relaxed"
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{jd.length} chars</span>
            <Button onClick={handleCompare} disabled={loading} variant="hero">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Compare with Resume
            </Button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          {!result ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
                <FileSearch className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Run a comparison to see match insights</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-6">
                <CircularProgress value={result.match_score} size={130} label="JD Match" color="accent" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Verdict</p>
                  <p className="text-lg font-semibold">
                    {result.match_score >= 75
                      ? "Strong fit — proceed with confidence"
                      : result.match_score >= 50
                      ? "Moderate fit — some gaps to address"
                      : "Low fit — significant skill gaps"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-primary">Matching Skills</p>
                <SkillTags tags={result.matching_skills} variant="matching" />
              </div>

              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-destructive">Missing Skills</p>
                <SkillTags tags={result.missing_skills} variant="missing" />
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-warning">
                  <Lightbulb className="h-3.5 w-3.5" /> AI Suggestions
                </p>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-sm"
                    >
                      <span className="font-mono text-xs text-warning">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-muted-foreground">{s}</span>
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
