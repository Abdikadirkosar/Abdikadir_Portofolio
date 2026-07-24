import React from "react";
import { Download, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { sendTelegramCVAlert } from "../lib/telegram";

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet 📱";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return "Mobile 📱";
  return "Desktop 💻";
}
function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/"))    return "Edge";
  if (ua.includes("OPR/"))    return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Chrome/"))  return "Chrome";
  if (ua.includes("Safari/"))  return "Safari";
  return "Browser";
}

export default function ResumeDownloadButton({ className = "" }) {
  const { t } = useLanguage();

  const handleDownload = () => {
    // ── Telegram CV tracker ─────────────────────────────────────────────────
    fetch("https://ipwho.is/")
      .then(r => r.json())
      .then(geo => {
        const flag = geo?.flag?.emoji || "🌍";
        const country = `${flag} ${geo?.country || "Unknown"}`;
        sendTelegramCVAlert({ country, device: getDeviceType(), browser: getBrowserName() }).catch(() => {});
      })
      .catch(() => {
        sendTelegramCVAlert({ country: "🌍 Unknown", device: getDeviceType(), browser: getBrowserName() }).catch(() => {});
      });

    // ── Generate resume text ────────────────────────────────────────────────
    const resumeText = `===========================================================
ABDIKADIR — AI ENGINEER & FULL-STACK ARCHITECT
Email: abdikadirkosara@gmail.com
Portfolio: https://abdikadir-portfolio.vercel.app
===========================================================

SUMMARY:
Passionate AI Engineer and Full-Stack Architect with deep expertise in 
PyTorch, RAG architectures, LLM Agents, Next.js, React, Node.js, AWS, and PostgreSQL. 
Building scalable, intelligent digital experiences and high-performance applications.

TECHNICAL SKILLS:
- AI & ML: PyTorch, RAG, OpenAI API, LangChain, Computer Vision, Agent Systems
- Frontend: React, Next.js, Tailwind CSS, TypeScript, JavaScript, Framer Motion
- Backend: Python, FastAPI, Node.js, Express, REST & GraphQL APIs
- Database: PostgreSQL, Supabase, Redis, Vector Databases
- DevOps & Cloud: AWS, Docker, Git, CI/CD Pipelines, Vercel

KEY HIGHLIGHTS:
- Developed production-ready AI Agents & Full-stack Web Systems.
- Engineered high-performance responsive web portals with custom dark/light theme engines.
- Architected cloud-native database solutions with Supabase RLS and real-time triggers.

===========================================================
Generated via Abdikadir Portfolio Platform — ${new Date().toLocaleDateString()}
===========================================================`;

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Abdikadir_AI_Engineer_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className={`px-5 py-3 rounded-xl font-mono text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:shadow-[0_0_25px_rgba(79,255,176,0.4)] transition-all duration-300 flex items-center gap-2 cursor-pointer border border-white/20 ${className}`}
    >
      <FileText size={15} />
      <span>{t.hero.downloadCv}</span>
      <Download size={14} />
    </button>
  );
}
