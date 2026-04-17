import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Loader2, Check, ArrowRight } from "lucide-react";
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
      toast.success("Results sent to WhatsApp");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Send failed";
      toast.error(`Backend offline — ${msg}`);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong hairline relative overflow-hidden rounded-2xl"
      >
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-success/10 blur-3xl" />

        <div className="relative grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="flex items-start gap-5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-success/20 bg-success/[0.06]">
              <MessageCircle className="h-5 w-5 text-success" strokeWidth={2} />
            </div>
            <div>
              <span className="eyebrow mb-2">04 — Notify Team</span>
              <h3 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                Push results to WhatsApp
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Share the candidate's full analysis instantly with your recruiting team — match score, ATS rating,
                and top skills delivered in one message.
              </p>
            </div>
          </div>

          <Button
            onClick={send}
            disabled={loading || !payload}
            size="lg"
            variant="success"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending
              </>
            ) : sent ? (
              <>
                <Check className="h-4 w-4" /> Sent
              </>
            ) : (
              <>
                Send to WhatsApp <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
