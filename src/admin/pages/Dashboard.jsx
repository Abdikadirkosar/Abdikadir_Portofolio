import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { safeQuery } from "../../lib/supabase";
import {
  FolderKanban, BookOpen, Mail, Eye, Heart, TrendingUp,
  MessageSquare, Download, Globe, Monitor, Smartphone,
  Users, Activity, Zap,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

/* ── Reusable stat card ─────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent, delay = 0, sub }) => (
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
        {sub && <p className="text-white/25 text-[10px] font-mono mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
  </motion.div>
);

/* ── Custom tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0d0d14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono">
        <p className="text-white/40 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || "#4FFFB0" }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Activity feed item ─────────────────────────────────────── */
const ActivityItem = ({ icon: Icon, text, time, accent }) => (
  <div className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
      <Icon size={12} style={{ color: accent }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white/70 text-xs truncate">{text}</p>
    </div>
    <p className="text-white/25 text-[10px] font-mono flex-shrink-0">{time}</p>
  </div>
);

/* ── Main Dashboard ─────────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, messages: 0, views: 0, likes: 0, unread: 0 });
  const [viewsData, setViewsData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [projects, blogs, messages, views, likes, unread] = await Promise.all([
        safeQuery(sb => sb.from("db_projects").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("db_blogs").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("messages").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("page_views").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("project_likes").select("id", { count: "exact", head: true })),
        safeQuery(sb => sb.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false)),
      ]);

      setStats({
        projects: projects.count ?? 0,
        blogs: blogs.count ?? 0,
        messages: messages.count ?? 0,
        views: views.count ?? 0,
        likes: likes.count ?? 0,
        unread: unread.count ?? 0,
      });

      // Views per day (last 14 days)
      const { data: rawViews } = await safeQuery(sb =>
        sb.from("page_views").select("created_at, country, device").order("created_at", { ascending: false }).limit(500)
      );

      if (rawViews) {
        // Daily chart
        const grouped = {};
        rawViews.forEach(v => {
          const day = new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          grouped[day] = (grouped[day] || 0) + 1;
        });
        setViewsData(Object.entries(grouped).slice(0, 14).reverse().map(([date, views]) => ({ date, views })));

        // Top countries
        const countries = {};
        rawViews.forEach(v => {
          if (v.country) countries[v.country] = (countries[v.country] || 0) + 1;
        });
        setTopCountries(
          Object.entries(countries)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }))
        );

        // Device breakdown
        const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
        rawViews.forEach(v => {
          const d = v.device || "Desktop";
          if (d.includes("Mobile")) devices.Mobile++;
          else if (d.includes("Tablet")) devices.Tablet++;
          else devices.Desktop++;
        });
        setDeviceData([
          { name: "Desktop", value: devices.Desktop, color: "#4FFFB0" },
          { name: "Mobile", value: devices.Mobile, color: "#a855f7" },
          { name: "Tablet", value: devices.Tablet, color: "#38bdf8" },
        ]);
      }

      // Recent messages for activity feed
      const { data: msgs } = await safeQuery(sb =>
        sb.from("messages").select("*").order("created_at", { ascending: false }).limit(5)
      );
      if (msgs) {
        setRecentMessages(msgs);
        setActivityFeed(msgs.map(m => ({
          icon: Mail,
          text: `${m.name} sent a message`,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          accent: "#38bdf8",
        })));
      }

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-white/30 text-sm mt-1">Portfolio analytics & real-time overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4FFFB0]/20 bg-[#4FFFB0]/5 text-[10px] font-mono text-[#4FFFB0]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FFFB0] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4FFFB0]" />
          </span>
          <Activity size={10} />
          Live
        </div>
      </div>

      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard icon={FolderKanban} label="Projects"    value={stats.projects} accent="#4FFFB0" delay={0} />
        <StatCard icon={BookOpen}     label="Blog Posts"  value={stats.blogs}    accent="#a855f7" delay={0.05} />
        <StatCard icon={Mail}         label="Messages"    value={stats.messages} accent="#38bdf8" delay={0.1}
          sub={stats.unread > 0 ? `${stats.unread} unread` : "all read"} />
        <StatCard icon={Eye}          label="Page Views"  value={stats.views}    accent="#fb923c" delay={0.15} />
        <StatCard icon={Heart}        label="Likes"       value={stats.likes}    accent="#f472b6" delay={0.2} />
        <StatCard icon={Zap}          label="Engagement"
          value={stats.views > 0 ? `${Math.round((stats.likes / stats.views) * 100)}%` : "0%"}
          accent="#facc15" delay={0.25} sub="likes / views" />
      </div>

      {/* Views chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Line chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
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

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity size={15} className="text-[#fb923c]" />
            <h2 className="text-white font-bold text-sm">Recent Activity</h2>
          </div>
          {activityFeed.length === 0 ? (
            <p className="text-white/20 text-xs font-mono">No activity yet</p>
          ) : (
            activityFeed.map((item, i) => <ActivityItem key={i} {...item} />)
          )}
        </motion.div>
      </div>

      {/* Countries bar + Device pie + Recent messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Globe size={15} className="text-[#38bdf8]" />
            <h2 className="text-white font-bold text-sm">Top Countries</h2>
          </div>
          {topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topCountries} layout="vertical" barSize={8}>
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Visitors" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/20 text-xs font-mono">No geo data yet</div>
          )}
        </motion.div>

        {/* Device breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/80 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Monitor size={15} className="text-[#a855f7]" />
            <h2 className="text-white font-bold text-sm">Device Breakdown</h2>
          </div>
          {deviceData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {deviceData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px] font-mono">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-white/40">{d.name}</span>
                    <span style={{ color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/20 text-xs font-mono">No device data yet</div>
          )}
        </motion.div>

        {/* Recent messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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
                <div className="min-w-0 flex-1">
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
