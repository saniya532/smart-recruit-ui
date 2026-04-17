import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  tags: string[];
  variant?: "missing" | "matching" | "neutral";
}

export const SkillTags = ({ tags, variant = "neutral" }: Props) => {
  if (!tags?.length) return <p className="text-sm text-muted-foreground">None detected</p>;

  const styles = {
    missing: "border-destructive/30 bg-destructive/10 text-destructive",
    matching: "border-primary/30 bg-primary/10 text-primary",
    neutral: "border-border bg-muted/40 text-foreground",
  } as const;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t, i) => (
        <motion.span
          key={t + i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-transform hover:-translate-y-0.5",
            styles[variant]
          )}
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
};
