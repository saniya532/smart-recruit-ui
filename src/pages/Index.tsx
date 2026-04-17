import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ResumeUpload } from "@/components/ResumeUpload";
import { RolePrediction } from "@/components/RolePrediction";
import { JdMatch } from "@/components/JdMatch";
import { AtsChecker } from "@/components/AtsChecker";
import { WhatsAppPanel } from "@/components/WhatsAppPanel";
import { SkillsRadar } from "@/components/SkillsRadar";
import { uploadResume } from "@/lib/api";
import { toast } from "sonner";

interface RoleData {
  predicted_role: string;
  match_percentage: number;
  top_roles: { role: string; score: number }[];
  missing_skills: string[];
  skills_radar?: { skill: string; value: number }[];
}

const DEMO: RoleData = {
  predicted_role: "Senior Frontend Engineer",
  match_percentage: 87,
  top_roles: [
    { role: "Senior Frontend Engineer", score: 87 },
    { role: "Full-Stack Developer", score: 74 },
    { role: "UI Engineer", score: 68 },
  ],
  missing_skills: ["GraphQL", "Kubernetes", "Rust", "WebAssembly", "Terraform"],
  skills_radar: [
    { skill: "Frontend", value: 92 },
    { skill: "Backend", value: 68 },
    { skill: "DevOps", value: 54 },
    { skill: "Design", value: 78 },
    { skill: "Testing", value: 71 },
    { skill: "Leadership", value: 60 },
  ],
};

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<RoleData | null>(null);

  const handleAnalyze = async () => {
    if (!file) return toast.error("Please upload a resume first");
    setLoading(true);
    try {
      const data = await uploadResume(file);
      setRole({ ...DEMO, ...data });
      toast.success("Analysis complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      setRole(DEMO);
      toast.error(`Backend offline — showing demo. ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main>
        <ResumeUpload file={file} onFileChange={setFile} onAnalyze={handleAnalyze} loading={loading} />

        {role && (
          <>
            <RolePrediction data={role} />

            {role.skills_radar && role.skills_radar.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="container pb-4"
              >
                <SkillsRadar data={role.skills_radar} />
              </motion.section>
            )}
          </>
        )}

        <JdMatch file={file} />
        <AtsChecker file={file} />
        <WhatsAppPanel payload={role ? { role } : null} />

        <footer className="border-t border-border/60 bg-background/40">
          <div className="container flex flex-wrap items-center justify-between gap-3 py-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="font-mono">© 2026 SMART RECRUIT AI · v3.2</span>
            </div>
            <span className="text-xs text-muted-foreground">Built for recruiters who move fast.</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
