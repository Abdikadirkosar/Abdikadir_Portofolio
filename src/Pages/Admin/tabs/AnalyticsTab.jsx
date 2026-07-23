import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Monitor, Globe, TrendingUp, Eye, RefreshCw, Calendar, Link2 } from "lucide-react";
import { safeQuery, isSupabaseEnabled } from "../../../lib/supabase";

const NEON = "#4FFFB0";
const COLORS = [NEON, "#38bdf8", "#a78bfa", "#f59e0b", "#fb7185", "#34d399"];

const StatCard = ({ icon: Icon, label, value, sub, color = NEON }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 flex flex-col gap-2"
    style={{ boxShadow: `0 0 30px ${color}08` }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
    >
      <Icon size={16} style={{ color }} />
    </div>
    <p className="text-2xl font-black text-white">{value}</p>
    <div>
      <p className="text-white/50 text-xs font-medium">{label}</p>
      {sub && <p className="text-white/25 text-[10px] mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

// Group page_views by day for area chart
function groupByDay(data) {
  const map = {};
  data.forEach((row) => {
    const day = new Date(row.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    map[day] = (map[day] || 0) + 1;
  });
  return Object.entries(map)
    .slice(-14)
    .map(([date, views]) => ({ date, views }));
}

// Group by device
function groupByDevice(data) {
  const map = {};
  data.forEach((row) => {
    map[row.device] = (map[row.device] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Group by page
function groupByPage(data) {
  const map = {};
  data.forEach((row) => {
    map[row.page] = (map[row.page] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

// Group by country
function groupByField(data, field, topN = 7) {
  const map = {};
  data.forEach((row) => {
    const key = row[field] || "Unknown";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-[#4FFFB0] font-bold">{payload[0].value} views</p>
    </div>
  );
};

const AnalyticsTab = () => {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViews = async () => {
    setLoading(true);
    const { data } = await safeQuery((sb) =>
      sb.from("page_views").select("*").order("created_at", { ascending: false })
    );
    setViews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchViews();
  }, []);

  if (!isSupabaseEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl">🔌</div>
        <p className="text-white/40 text-sm font-mono text-center max-w-xs">
          Supabase isn't configured yet. Add your credentials to{" "}
          <span className="text-[#4FFFB0]">.env</span> to see analytics.
        </p>
      </div>
    );
  }

  const today = new Date().toDateString();
  const todayViews = views.filter(
    (v) => new Date(v.created_at).toDateString() === today
  ).length;
  const weekViews = views.filter((v) => {
    const d = new Date(v.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;
  const monthViews = views.filter((v) => {
    const d = new Date(v.created_at);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return d >= monthAgo;
  }).length;

  const chartData = groupByDay(views);
  const deviceData = groupByDevice(views);
  const pageData = groupByPage(views);
  const countryData = groupByField(views, "country");
  const referrerData = groupByField(views, "referrer");
  const browserData = groupByField(views, "browser");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Analytics</h2>
        <button
          onClick={fetchViews}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard icon={Eye} label="Total Views" value={views.length} />
            <StatCard icon={TrendingUp} label="Today" value={todayViews} color="#38bdf8" />
            <StatCard icon={Calendar} label="This Month" value={monthViews} color="#a78bfa" />
            <StatCard icon={Globe} label="Countries" value={countryData.length} sub="tracked" color="#f59e0b" />
          </div>

          {/* Area Chart */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-4">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
              Daily Page Views (Last 14 days)
            </p>
            {chartData.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NEON} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={NEON} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={NEON}
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Device Pie */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
                Device Breakdown
              </p>
              {deviceData.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">No data</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deviceData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                          opacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                          {value}
                        </span>
                      )}
                    />
                    <Tooltip
                      formatter={(val, name) => [val, name]}
                      contentStyle={{
                        background: "#111",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top Pages */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
                Top Pages
              </p>
              {pageData.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">No data</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pageData.map(([page, count], i) => {
                    const max = pageData[0][1];
                    return (
                      <div key={page} className="flex items-center gap-3">
                        <span className="text-white/25 text-[10px] font-mono w-4">
                          {i + 1}
                        </span>
                        <span className="text-white/70 text-xs capitalize flex-1">
                          {page}
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${(count / max) * 100}%`,
                                background: NEON,
                                opacity: 0.6,
                              }}
                            />
                          </div>
                          <span className="text-white/40 text-[10px] font-mono w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Second row — Countries / Referrers / Browsers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

            {/* Top Countries */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">🌍 Top Countries</p>
              {countryData.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">No data</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {countryData.map(([country, count], i) => {
                    const max = countryData[0][1];
                    return (
                      <div key={country} className="flex items-center gap-3">
                        <span className="text-white/25 text-[10px] font-mono w-4">{i + 1}</span>
                        <span className="text-white/70 text-xs flex-1 truncate">{country}</span>
                        <div className="flex items-center gap-2 w-24">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: COLORS[i % COLORS.length], opacity: 0.7 }} />
                          </div>
                          <span className="text-white/40 text-[10px] font-mono w-5 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Referrers */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">🔗 Top Referrers</p>
              {referrerData.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">No referrer data</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {referrerData.map(([ref, count], i) => {
                    const max = referrerData[0][1];
                    const label = ref === "direct" || !ref ? "Direct" : ref.replace(/https?:\/\//, "").split("/")[0];
                    return (
                      <div key={ref} className="flex items-center gap-3">
                        <span className="text-white/25 text-[10px] font-mono w-4">{i + 1}</span>
                        <span className="text-white/70 text-xs flex-1 truncate">{label}</span>
                        <div className="flex items-center gap-2 w-24">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: COLORS[i % COLORS.length], opacity: 0.7 }} />
                          </div>
                          <span className="text-white/40 text-[10px] font-mono w-5 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Browsers */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">🌐 Top Browsers</p>
              {browserData.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-8">No browser data</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {browserData.map(([browser, count], i) => {
                    const max = browserData[0][1];
                    return (
                      <div key={browser} className="flex items-center gap-3">
                        <span className="text-white/25 text-[10px] font-mono w-4">{i + 1}</span>
                        <span className="text-white/70 text-xs flex-1 truncate">{browser}</span>
                        <div className="flex items-center gap-2 w-24">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: COLORS[i % COLORS.length], opacity: 0.7 }} />
                          </div>
                          <span className="text-white/40 text-[10px] font-mono w-5 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;
