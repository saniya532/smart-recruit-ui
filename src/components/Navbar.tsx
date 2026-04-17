import { Sparkles, Command } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight">Smart Recruit</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-primary">
                AI
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "#upload", label: "Upload" },
              { href: "#analysis", label: "Analysis" },
              { href: "#match", label: "JD Match" },
              { href: "#ats", label: "ATS" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 py-1 font-mono text-[10px] text-muted-foreground md:flex">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success md:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
