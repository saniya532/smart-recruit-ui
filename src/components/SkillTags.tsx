import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  tags: string[];
  variant?: "missing" | "matching" | "neutral";
}

export const SkillTags = ({ tags, variant = "neutral" }: Props) => {
  if (!tags?.length) return <p className="text-sm text-muted-foreground">None detected</p>;

  const styles = {
    missing: "border-warning/25 bg-warning/[0.06] text-warning hover:bg-warning/10",
    matching: "border-primary/25 bg-primary/[0.06] text-primary hover:bg-primary/10",
    neutral: "border-border bg-muted/30 text-foreground hover:bg-muted/50",
  } as const;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t, i) => (
        <motion.span
          key={t + i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.25 }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
            styles[variant]
          )}
        >
          <span className="h-1 w-1 rounded-full bg-current opacity-60" />
          {t}
        </motion.span>
      ))}
    </div>
  );
};
