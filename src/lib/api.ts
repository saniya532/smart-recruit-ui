// API client for Smart Recruit AI backend
export const API_BASE_URL = "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function uploadResume(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE_URL}/predict-role`, { method: "POST", body: fd });
  return handleResponse<{
    predicted_role: string;
    match_percentage: number;
    top_roles: { role: string; score: number }[];
    missing_skills: string[];
    skills_radar?: { skill: string; value: number }[];
  }>(res);
}

export async function compareJD(file: File, jobDescription: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("job_description", jobDescription);
  const res = await fetch(`${API_BASE_URL}/match-jd`, { method: "POST", body: fd });
  return handleResponse<{
    match_score: number;
    matching_skills: string[];
    missing_skills: string[];
    suggestions: string[];
  }>(res);
}

export async function checkATS(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE_URL}/ats-score`, { method: "POST", body: fd });
  return handleResponse<{
    ats_score: number;
    formatting_issues: string[];
    keyword_density: { keyword: string; count: number }[];
    tips: string[];
  }>(res);
}

export async function sendWhatsApp(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/send-whatsapp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}
