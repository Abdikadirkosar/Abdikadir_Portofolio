import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Star, GitFork, Code2, Activity, ExternalLink } from "lucide-react";

const GITHUB_USERNAME = "Abdikadirkosar"; // ← change if needed

// ── Language color map ───────────────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  "C#": "#178600", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", PHP: "#4F5D95",
  Vue: "#41b883", React: "#61dafb",
};

// ── Stat mini card ───────────────────────────────────────────────────────────
const MiniStat = ({ icon: Icon, label, value, accent }) => (
  <div className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
    <Icon size={14} style={{ color: accent }} />
    <span className="text-white font-black text-lg">{value ?? "—"}</span>
    <span className="text-white/30 text-[9px] font-mono uppercase tracking-wider">{label}</span>
  </div>
);

// ── GitHub Stats Widget ──────────────────────────────────────────────────────
const GitHubStats = () => {
  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6`),
        ]);
        if (!uRes.ok || !rRes.ok) throw new Error("GitHub API error");
        const [uData, rData] = await Promise.all([uRes.json(), rRes.json()]);
        setUser(uData);
        setRepos(rData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-[#4FFFB0]/30 border-t-[#4FFFB0] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-8 text-white/20 text-sm font-mono">
        GitHub data unavailable
      </div>
    );
  }

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  return (
    <section className="relative py-16 lg:px-[13%] md:px-8 px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-white/[0.06] bg-[#0d0d14]/80 p-8 overflow-hidden relative"
      >
        {/* Top shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #4FFFB0 40%, transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 flex items-center justify-center">
              <GitBranch size={18} className="text-[#4FFFB0]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">GitHub Activity</h3>
              <p className="text-white/30 text-xs font-mono">@{GITHUB_USERNAME}</p>
            </div>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#4FFFB0]/20 text-[#4FFFB0] text-[10px] font-mono hover:bg-[#4FFFB0]/10 transition-colors"
          >
            View Profile <ExternalLink size={10} />
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <MiniStat icon={Code2}    label="Repos"      value={user.public_repos}  accent="#4FFFB0" />
          <MiniStat icon={Star}     label="Stars"      value={totalStars}         accent="#facc15" />
          <MiniStat icon={Activity} label="Followers"  value={user.followers}     accent="#a855f7" />
          <MiniStat icon={GitFork}  label="Following"  value={user.following}     accent="#38bdf8" />
        </div>

        {/* Top repos */}
        <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-3">Top Repositories</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {repos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#4FFFB0]/20 hover:bg-[#4FFFB0]/5 transition-all duration-300"
            >
              <p className="text-white text-xs font-semibold truncate group-hover:text-[#4FFFB0] transition-colors mb-1.5">{repo.name}</p>
              {repo.description && (
                <p className="text-white/30 text-[10px] leading-snug line-clamp-2 mb-2">{repo.description}</p>
              )}
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] || "#888" }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><Star size={9} /> {repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={9} /> {repo.forks_count}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default GitHubStats;
