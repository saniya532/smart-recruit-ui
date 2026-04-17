import { Sparkles } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary glow-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">Smart Recruit AI</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Resume Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#upload" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Upload
            </a>
            <a href="#analysis" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Analysis
            </a>
            <a href="#ats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              ATS Score
            </a>
            <a href="#match" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              JD Match
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              AI Engine Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
