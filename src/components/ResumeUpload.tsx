import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export const ResumeUpload = ({ file, onFileChange, onAnalyze, loading }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type === "application/pdf") onFileChange(f);
    },
    [onFileChange]
  );

  return (
    <section id="upload" className="container relative pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 grid-bg h-[600px] opacity-50" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          AI Resume Intelligence · v3.2
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          <span className="text-gradient">Hire smarter.</span>
          <br />
          <span className="text-foreground">Decode resumes in </span>
          <span className="italic text-gradient-accent" style={{ fontFamily: 'Instrument Serif, serif' }}>
            seconds
          </span>
          <span className="text-foreground">.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          Upload a PDF and let our model predict the best-fit role, match against any job description, and score
          ATS-readiness — instantly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-2xl"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
          className={cn(
            "group glass hairline relative cursor-pointer overflow-hidden rounded-2xl p-1.5 transition-all duration-300",
            dragOver && "glow-primary ring-1 ring-primary/40",
            !file && "hover:ring-1 hover:ring-border"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />

          {!file ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/80 bg-background/30 px-6 py-14 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-transform group-hover:scale-105">
                  <Upload className="h-5 w-5 text-foreground" strokeWidth={2} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Drop your resume here</p>
                <p className="text-xs text-muted-foreground">or click to browse · PDF · up to 10MB</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-3 rounded-xl bg-background/40 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                  <FileText className="h-4 w-4 text-primary" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB · PDF
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(null);
                  }}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <Button
                variant="hero"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyze();
                }}
                disabled={loading}
                className="sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
                  </>
                ) : (
                  <>
                    Analyze <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" /> End-to-end encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-accent" /> No data retention
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-warning" /> SOC 2 ready
          </span>
        </div>
      </motion.div>
    </section>
  );
};
