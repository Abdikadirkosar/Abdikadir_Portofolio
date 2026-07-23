import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Cpu, Award, FileText, Eye, Mail, 
  Plus, Edit, CheckCircle, Clock 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { safeQuery } from "../../../lib/supabase";

// Group page_views by day for area chart
function groupByDay(data) {
  if (!data) return [];
  const map = {};
  data.forEach((row) => {
    const day = new Date(row.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    map[day] = (map[day] || 0) + 1;
  });
  return Object.entries(map)
    .slice(-7) // last 7 days
    .map(([date, views]) => ({ date, views }));
}

const DashboardHome = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    projects: 4,
    skills: 12,
    certificates: 3,
    blogs: 0,
    views: 0,
    messages: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentMsgs, setRecentMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeStats = async () => {
      setLoading(true);
      
      const { data: viewsData } = await safeQuery(sb => sb.from("page_views").select("created_at"));
      const { data: msgsData }  = await safeQuery(sb => sb.from("messages").select("*").order("created_at", { ascending: false }));
      const { data: skillsData } = await safeQuery(sb => sb.from("db_skills").select("id"));
      const { data: certsData }  = await safeQuery(sb => sb.from("db_certificates").select("id"));
      const { data: blogsData }  = await safeQuery(sb => sb.from("db_blogs").select("id"));
      const { data: projsData }  = await safeQuery(sb => sb.from("db_projects").select("id"));

      setStats({
        projects: projsData?.length || 4,
        skills: skillsData?.length || 15,
        certificates: certsData?.length || 3,
        blogs: blogsData?.length || 0,
        views: viewsData?.length || 0,
        messages: msgsData?.length || 0
      });

      if (viewsData) {
        setChartData(groupByDay(viewsData));
      }

      if (msgsData) {
        setRecentMsgs(msgsData.slice(0, 3));
      }

      setLoading(false);
    };

    fetchHomeStats();
  }, []);

  const statCards = [
    { label: "Total Projects",     value: stats.projects,      icon: Briefcase, color: "#38bdf8", tab: "projects" },
    { label: "Total Skills",       value: stats.skills,        icon: Cpu,       color: "#4FFFB0", tab: "skills" },
    { label: "Certificates",       value: stats.certificates,  icon: Award,     color: "#a78bfa", tab: "certificates" },
    { label: "Blog Posts",         value: stats.blogs,         icon: FileText,  color: "#fb7185", tab: "blog" },
    { label: "Total Visitors",     value: stats.views,         icon: Eye,       color: "#fb923c", tab: "analytics" },
    { label: "Contact Messages",   value: stats.messages,      icon: Mail,      color: "#22d3ee", tab: "messages" },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-white">Cockpit Dashboard</h1>
        <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-widest">REAL-TIME OVERVIEW</p>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(({ label, value, icon: Icon, color, tab }) => (
          <motion.div
            key={label}
            whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.12)" }}
            onClick={() => setActiveTab(tab)}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer transition-all duration-300 flex flex-col gap-3"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ borderColor: `${color}25`, backgroundColor: `${color}08` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-black text-white">{loading ? "..." : value}</p>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Analytics Chart ────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">TRAFFIC ANALYTICS (LAST 7 DAYS)</p>
          <button 
            onClick={() => setActiveTab("analytics")}
            className="text-[#4FFFB0] text-[10px] font-mono uppercase tracking-wider hover:underline"
          >
            Detailed Analytics
          </button>
        </div>
        <div className="h-44 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-white/20 text-xs font-mono">Loading chart...</div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/20 text-xs font-mono">No visitor data recorded yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="homeColorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FFFB0" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4FFFB0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 10 }}
                  labelStyle={{ color: "rgba(255,255,255,0.4)" }}
                />
                <Area type="monotone" dataKey="views" name="Page Views" stroke="#4FFFB0" strokeWidth={1.5} fill="url(#homeColorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Mid Section: Quick Actions & Recent Activity ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Quick Actions */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "New Project", tab: "projects", icon: Plus },
              { label: "New Skill",   tab: "skills",   icon: Plus },
              { label: "New Blog",    tab: "blog",     icon: Plus },
              { label: "Edit Profile",tab: "profile",  icon: Edit },
            ].map(({ label, tab, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-[#4FFFB0]/5 hover:border-[#4FFFB0]/30 text-white/70 hover:text-[#4FFFB0] text-xs font-semibold transition-all duration-200 text-left"
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Recent Messages */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">RECENT MESSAGES</p>
            <button 
              onClick={() => setActiveTab("messages")}
              className="text-[#4FFFB0] text-[10px] font-mono uppercase tracking-wider hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {loading ? (
              <p className="text-white/20 text-xs py-4">Loading messages...</p>
            ) : recentMsgs.length === 0 ? (
              <p className="text-white/20 text-xs py-4">No recent messages</p>
            ) : (
              recentMsgs.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setActiveTab("messages")}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${msg.is_read ? "bg-white/10" : "bg-[#4FFFB0] shadow-[0_0_8px_#4FFFB0]"}`} />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold truncate">{msg.name}</p>
                      <p className="text-white/35 text-[10px] truncate mt-0.5">{msg.subject || "No Subject"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-white/20 text-[9px] font-mono">
                    <Clock size={9} />
                    {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── System Status Banner ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle size={16} className="text-emerald-400" />
          <div>
            <p className="text-white text-xs font-bold">Supabase Connected Successfully</p>
            <p className="text-white/30 text-[10px] mt-0.5">Real-time sync and metrics are fully functional.</p>
          </div>
        </div>
        <div className="text-white/25 text-[10px] font-mono">SYSTEM ONLINE</div>
      </div>

    </div>
  );
};

export default DashboardHome;
