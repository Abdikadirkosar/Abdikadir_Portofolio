import React from "react";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Code2, Flame, Star, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const stats = [
  { label: "Total Commits", value: "1,450+", icon: GitCommit, color: "text-[#4FFFB0]" },
  { label: "Pull Requests", value: "185+", icon: GitPullRequest, color: "text-[#38bdf8]" },
  { label: "Code Streak", value: "52 Days", icon: Flame, color: "text-amber-400" },
  { label: "Total Repos", value: "24 Public", icon: Star, color: "text-purple-400" },
];

const languages = [
  { name: "Python / AI", percentage: 42, color: "bg-yellow-400" },
  { name: "React / JavaScript", percentage: 35, color: "bg-blue-400" },
  { name: "C# / .NET", percentage: 15, color: "bg-purple-400" },
  { name: "SQL & Supabase", percentage: 8, color: "bg-emerald-400" },
];

export default function GithubStatsWidget() {
  const { lang } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-2xl bg-[#0d0d12]/90 border border-white/10 backdrop-blur-md shadow-2xl text-white font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4FFFB0]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#4FFFB0]">
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span>GitHub Engineering Metrics</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4FFFB0]/20 text-[#4FFFB0] border border-[#4FFFB0]/30 font-normal">
                Live Data
              </span>
            </h3>
            <p className="text-xs text-white/50 font-mono">
              {lang === "SO" ? "Tirakoobka commits-ka iyo luqadaha lagu dhiso software-ka" : "@abdikadirkosar active code contribution analytics"}
            </p>
          </div>
        </div>

        <a
          href="https://github.com/abdikadirkosar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#4FFFB0] text-xs font-mono text-white/70 hover:text-[#4FFFB0] transition-all"
        >
          <span>View GitHub Profile</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-white/50">{st.label}</span>
                <Icon size={16} className={st.color} />
              </div>
              <span className="text-lg font-bold font-mono text-white tracking-tight">{st.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Language Breakdown Bars */}
      <div>
        <h4 className="text-xs font-mono font-semibold text-[#4FFFB0] mb-3">
          {lang === "SO" ? "QEIBASHOODA LUQADAHA (LANGUAGE DISTRIBUTION)" : "TECHNOLOGY DISTRIBUTION"}
        </h4>
        <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden flex mb-3 border border-white/10">
          {languages.map((l, i) => (
            <div
              key={i}
              style={{ width: `${l.percentage}%` }}
              className={`h-full ${l.color} transition-all duration-1000`}
              title={`${l.name}: ${l.percentage}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-white/70">
          {languages.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span>{l.name}</span>
              <span className="text-white/40 ml-auto">{l.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
