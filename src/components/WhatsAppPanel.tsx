import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendWhatsApp } from "@/lib/api";
import { toast } from "sonner";

export const WhatsAppPanel = ({ payload }: { payload: Record<string, unknown> | null }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!payload) return toast.error("Run an analysis first");
    setLoading(true);
    try {
      await sendWhatsApp(payload);
      toast.success("Results sent to WhatsApp ✨");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Send failed";
      toast.error(`Backend offline — ${msg}`);
      // Optimistic demo state
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong relative overflow-hidden rounded-3xl p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-success/20 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-5">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-success/15 ring-1 ring-success/30"
            >
              <MessageCircle className="h-7 w-7 text-success" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Push results to WhatsApp</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share the candidate's full analysis instantly with the recruiting team — match score, ATS rating, and
                top skills delivered in one message.
              </p>
            </div>
          </div>

          <Button
            onClick={send}
            disabled={loading || !payload}
            size="lg"
            variant="success"
            className="min-w-[220px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : sent ? (
              <>
                <Check className="h-4 w-4" /> Sent
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" /> Send to WhatsApp
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
