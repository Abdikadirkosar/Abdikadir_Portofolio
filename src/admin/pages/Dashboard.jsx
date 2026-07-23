import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { safeQuery } from "../../lib/supabase";
import { FolderKanban, BookOpen, Mail, Eye, Heart, TrendingUp, Users, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const StatCard = ({ icon: Icon, label, value, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-5 overflow-hidden group hover:border-white/[0.1] transition-colors duration-300"
  >
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-2">{label}</p>
        <p className="text-white text-3xl font-black">{value ?? "—"}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0d14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono">
        <p className="text-white/40 mb-1">{label}</p>
        <p className="text-[#4FFFB0]">{payload[0].value} views</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, messages: 0, views: 0, likes: 0 });
  const [viewsData, setViewsData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [projects, blogs, messages, views, likes] = await Promise.all([
        safeQuery(sb => sb.from("db_projects").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("db_blogs").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("messages").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("page_views").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("project_likes").select("id", { count: "exact", head: true })),
      ]);

      setStats({
        projects: projects.count ?? 0,
        blogs: blogs.count ?? 0,
        messages: messages.count ?? 0,
        views: views.count ?? 0,
        likes: likes.count ?? 0,
      });

      // Views per day (last 14 days)
      const { data: rawViews } = await safeQuery(sb =>
        sb.from("page_views").select("created_at").order("created_at", { ascending: false }).limit(500)
      );
      if (rawViews) {
        const grouped = {};
        rawViews.forEach(v => {
          const day = new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          grouped[day] = (grouped[day] || 0) + 1;
        });
        const chartData = Object.entries(grouped).slice(0, 14).reverse().map(([date, views]) => ({ date, views }));
        setViewsData(chartData);
      }

      // Recent messages
      const { data: msgs } = await safeQuery(sb =>
        sb.from("messages").select("*").order("created_at", { ascending: false }).limit(5)
      );
      if (msgs) setRecentMessages(msgs);

      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4FFFB0]/30 border-t-[#4FFFB0] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">Overview of your portfolio analytics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={FolderKanban} label="Projects"  value={stats.projects} accent="#4FFFB0" delay={0} />
        <StatCard icon={BookOpen}     label="Blog Posts" value={stats.blogs}    accent="#a855f7" delay={0.05} />
        <StatCard icon={Mail}         label="Messages"   value={stats.messages} accent="#38bdf8" delay={0.1} />
        <StatCard icon={Eye}          label="Page Views" value={stats.views}    accent="#fb923c" delay={0.15} />
        <StatCard icon={Heart}        label="Likes"      value={stats.likes}    accent="#f472b6" delay={0.2} />
      </div>

      {/* Chart + Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Views chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={15} className="text-[#4FFFB0]" />
            <h2 className="text-white font-bold text-sm">Page Views — Last 14 Days</h2>
          </div>
          {viewsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" stroke="#4FFFB0" strokeWidth={2} dot={{ fill: "#4FFFB0", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm font-mono">No view data yet</div>
          )}
        </motion.div>

        {/* Recent messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={15} className="text-[#38bdf8]" />
            <h2 className="text-white font-bold text-sm">Recent Messages</h2>
          </div>
          <div className="flex flex-col gap-3">
            {recentMessages.length === 0 && (
              <p className="text-white/20 text-xs font-mono">No messages yet</p>
            )}
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-7 h-7 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/25 flex items-center justify-center flex-shrink-0 text-[#38bdf8] text-xs font-bold">
                  {(msg.name || "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-xs font-medium truncate">{msg.name}</p>
                  <p className="text-white/30 text-[10px] font-mono truncate">{msg.subject || msg.email}</p>
                </div>
                {!msg.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#4FFFB0] flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
