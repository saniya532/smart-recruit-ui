import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, X, Sparkles, Loader2 } from "lucide-react";
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
    <section id="upload" className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong neon-border relative overflow-hidden rounded-3xl p-8 md:p-12"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI-Powered Resume Engine
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Decode any resume in <span className="text-gradient">seconds.</span>
            </h1>
            <p className="text-base text-muted-foreground">
              Upload a PDF and let our AI predict the ideal role, match against any job description, and score
              ATS-friendliness — all instantly.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px] text-muted-foreground">
              <span className="rounded-md bg-muted/60 px-2 py-1">PDF only</span>
              <span className="rounded-md bg-muted/60 px-2 py-1">Max 10MB</span>
              <span className="rounded-md bg-muted/60 px-2 py-1">Encrypted</span>
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={cn(
              "group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300",
              dragOver
                ? "border-primary bg-primary/10 glow-primary"
                : "border-border bg-background/40 hover:border-primary/50 hover:bg-primary/5"
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
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary glow-primary transition-transform group-hover:scale-110">
                  <Upload className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Drag & drop your resume</p>
                  <p className="text-sm text-muted-foreground">or click to browse · PDF up to 10MB</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex w-full max-w-sm flex-col gap-4"
              >
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · PDF
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileChange(null);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyze();
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Analyze Resume
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
