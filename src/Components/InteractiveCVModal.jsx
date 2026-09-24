import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Search, Briefcase, GraduationCap, Award, Code, CheckCircle, ExternalLink } from "lucide-react";
import { soundFX } from "../lib/soundFX";

export default function InteractiveCVModal({ isOpen, onClose, profile }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const skills = [
    { cat: "Frontend", items: ["React.js", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Vite"] },
    { cat: "Backend", items: ["C#", ".NET Core", "Node.js", "Express.js", "Python", "FastAPI", "RESTful APIs"] },
    { cat: "AI & ML", items: ["LangChain", "OpenAI API", "Hugging Face", "RAG Systems", "Prompt Engineering", "OpenCV"] },
    { cat: "Database & Cloud", items: ["Supabase", "PostgreSQL", "SQL Server", "Firebase", "Vercel", "Git & GitHub"] }
  ];

  const experience = [
    {
      role: "Full Stack Developer & AI Engineer",
      company: "Freelance & Enterprise Solutions",
      period: "2023 – Present",
      bullets: [
        "Architected enterprise C# Windows applications including School, Hotel, and Gym management suites.",
        "Built generative AI agents and LangChain RAG workflows for automated client assistance.",
        "Designed and maintained modern React and Supabase SPAs with sub-second performance."
      ]
    },
    {
      role: "Software Development Specialist",
      company: "Independent Client Engagements",
      period: "2022 – 2023",
      bullets: [
        "Implemented high-accuracy relational database schemas in SQL Server and PostgreSQL.",
        "Created biometric and computer vision attendance prototypes in Python using OpenCV.",
        "Delivered 10+ custom client software systems with automated reporting and role-based auth."
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={() => { soundFX.playClick(); onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c12] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#4FFFB0]/10 via-transparent to-transparent">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4FFFB0] animate-pulse" />
                <h3 className="font-bold text-lg text-white">Interactive Curriculum Vitae</h3>
              </div>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                Abdikadir Kosar Osman • AI Engineer & Full Stack Developer
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={profile?.resume_url || "/Abdikadir_Kosar_Osman_CV.pdf"}
                download="Abdikadir_Kosar_CV.pdf"
                onClick={() => soundFX.playSuccess()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4FFFB0] hover:bg-[#4FFFB0]/90 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(79,255,176,0.2)] cursor-pointer"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>

              <button
                onClick={() => { soundFX.playClick(); onClose(); }}
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Search bar inside CV */}
          <div className="px-5 py-3 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Search size={14} className="text-white/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills, tools, or experience (e.g. C#, React, LangChain, SQL)..."
              className="w-full bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none font-mono"
            />
          </div>

          {/* Content scrollable body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* Quick summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 leading-relaxed font-mono">
              <span className="text-[#4FFFB0] font-bold">PROFESSIONAL PROFILE:</span> Senior-level Computer Science student & practicing Full Stack AI Engineer. Proven track record of shipping end-to-end desktop and web applications with rich enterprise architectures and autonomous AI pipelines.
            </div>

            {/* Technical Skills Matrix */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-[#4FFFB0]">
                <Code size={14} />
                <span>Technical Skills Matrix</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {skills.map((grp, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[11px] font-mono text-white/40 uppercase mb-2">{grp.cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {grp.items
                        .filter(item => !searchTerm || item.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((skill, si) => (
                          <span
                            key={si}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/80 font-mono hover:border-[#4FFFB0]/30 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-[#4FFFB0]">
                <Briefcase size={14} />
                <span>Work Experience</span>
              </div>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-white">{exp.role}</h4>
                      <span className="text-[11px] font-mono text-[#4FFFB0]">{exp.period}</span>
                    </div>
                    <p className="text-xs text-white/40 font-mono">{exp.company}</p>
                    <ul className="space-y-1.5 mt-2">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="text-xs text-white/70 flex items-start gap-2">
                          <CheckCircle size={13} className="text-[#4FFFB0] mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-[#4FFFB0]">
                <GraduationCap size={14} />
                <span>Education</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white">Bachelor of Science in Computer Science</h4>
                  <p className="text-xs text-white/40 font-mono mt-0.5">New Generation University • Senior Year</p>
                </div>
                <span className="text-[11px] font-mono text-white/60">Expected 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
