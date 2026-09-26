import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Mail, Trash2, RefreshCw, ChevronDown, ChevronUp, Video, User, CheckCircle, Clock3 } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";

/* ── Parse booking fields from message text ─────────────────── */
function parseBooking(msg) {
  const text = msg.message || "";
  const topicMatch  = text.match(/Topic:\s*([^|]+)/);
  const dateMatch   = text.match(/Date:\s*([^|]+)/);
  const timeMatch   = text.match(/Time:\s*([^|]+)/);
  const notesMatch  = text.match(/Notes:\s*(.+)$/);

  return {
    topic: topicMatch  ? topicMatch[1].trim()  : "—",
    date:  dateMatch   ? dateMatch[1].trim()   : "—",
    time:  timeMatch   ? timeMatch[1].trim()   : "—",
    notes: notesMatch  ? notesMatch[1].trim()  : "",
  };
}

const STATUS_COLORS = {
  pending:   { bg: "bg-yellow-500/10",  text: "text-yellow-400",  border: "border-yellow-500/20",  label: "Pending" },
  confirmed: { bg: "bg-[#4FFFB0]/10",   text: "text-[#4FFFB0]",   border: "border-[#4FFFB0]/25",   label: "Confirmed" },
  cancelled: { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20",     label: "Cancelled" },
};

const BookingsTab = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const [search, setSearch]       = useState("");
  const [statusMap, setStatusMap] = useState({});

  const fetchBookings = async () => {
    setLoading(true);
    const [resMessages, resDbMessages] = await Promise.allSettled([
      safeQuery((sb) =>
        sb
          .from("messages")
          .select("*")
          .ilike("message", "%[BOOKING CALL REQUEST]%")
          .order("created_at", { ascending: false })
      ),
      safeQuery((sb) =>
        sb
          .from("db_messages")
          .select("*")
          .ilike("message", "%[BOOKING CALL REQUEST]%")
          .order("created_at", { ascending: false })
      ),
    ]);

    const mList = (resMessages.status === "fulfilled" && resMessages.value?.data) || [];
    const dbList = (resDbMessages.status === "fulfilled" && resDbMessages.value?.data) || [];

    // Merge and de-duplicate by message text + email
    const combined = [...mList, ...dbList];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      const key = `${item.email}_${item.message}_${item.created_at?.slice(0, 16)}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    setBookings(unique);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const deleteBooking = async (id) => {
    await Promise.allSettled([
      safeQuery((sb) => sb.from("messages").delete().eq("id", id)),
      safeQuery((sb) => sb.from("db_messages").delete().eq("id", id)),
    ]);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const cycleStatus = (id) => {
    const order = ["pending", "confirmed", "cancelled"];
    const cur = statusMap[id] || "pending";
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setStatusMap((prev) => ({ ...prev, [id]: next }));
  };

  const filtered = bookings.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.message?.toLowerCase().includes(search.toLowerCase())
  );

  const total     = bookings.length;
  const confirmed = Object.values(statusMap).filter((v) => v === "confirmed").length;
  const pending   = total - confirmed;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Video size={18} className="text-[#4FFFB0]" />
            Discovery Call Bookings
          </h2>
          {total > 0 && (
            <span className="text-[10px] font-mono bg-[#4FFFB0]/15 text-[#4FFFB0] border border-[#4FFFB0]/25 px-2 py-0.5 rounded-full">
              {total} total
            </span>
          )}
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Bookings", value: total,     color: "#4FFFB0", icon: Calendar },
            { label: "Confirmed",      value: confirmed,  color: "#22d3ee", icon: CheckCircle },
            { label: "Pending",        value: pending,    color: "#f59e0b", icon: Clock3 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-white/[0.06] bg-[#0d0d14]/60 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">{label}</p>
                <p className="text-white text-xl font-black">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {total > 0 && (
        <input
          type="text"
          placeholder="Search by name, email, topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-xs px-3 py-2 outline-none focus:border-[#4FFFB0]/30"
        />
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] animate-spin" />
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Video size={36} className="text-white/10" />
          <p className="text-white/25 text-sm">No discovery call bookings yet</p>
          <p className="text-white/15 text-xs font-mono">Bookings submitted via the "Book Discovery Call" button will appear here</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-xs font-mono">No bookings matched your search.</div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filtered.map((booking, i) => {
              const parsed = parseBooking(booking);
              const status = statusMap[booking.id] || "pending";
              const sc     = STATUS_COLORS[status];
              const isOpen = expanded === booking.id;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-colors"
                >
                  {/* Row header */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : booking.id)}
                  >
                    {/* Calendar icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 flex items-center justify-center flex-shrink-0">
                      <Video size={15} className="text-[#4FFFB0]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white text-sm font-semibold truncate">{booking.name}</p>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-white/35 text-xs truncate">{parsed.topic} · {parsed.date} · {parsed.time}</p>
                    </div>

                    {/* Date */}
                    <p className="text-white/25 text-[10px] font-mono flex-shrink-0 hidden sm:block">
                      {new Date(booking.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    </p>

                    {isOpen ? <ChevronUp size={14} className="text-white/20 flex-shrink-0" /> : <ChevronDown size={14} className="text-white/20 flex-shrink-0" />}
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-4 pb-4 border-t border-white/[0.06] pt-4 space-y-3">
                          {/* Details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { icon: User,     label: "Name",    val: booking.name },
                              { icon: Mail,     label: "Email",   val: booking.email },
                              { icon: Calendar, label: "Date",    val: parsed.date },
                              { icon: Clock,    label: "Time",    val: parsed.time },
                            ].map(({ icon: Ic, label, val }) => (
                              <div key={label} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                                <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                  <Ic size={9} /> {label}
                                </p>
                                <p className="text-white/80 text-xs font-medium truncate">{val}</p>
                              </div>
                            ))}
                          </div>

                          {/* Topic */}
                          <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                            <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">Topic</p>
                            <p className="text-white/80 text-sm">{parsed.topic}</p>
                          </div>

                          {/* Notes */}
                          {parsed.notes && (
                            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05]">
                              <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">Notes</p>
                              <p className="text-white/60 text-xs leading-relaxed">{parsed.notes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3 pt-1">
                            <a
                              href={`mailto:${booking.email}?subject=Re: Discovery Call – ${parsed.date} at ${parsed.time}`}
                              className="flex items-center gap-1.5 text-xs text-[#4FFFB0]/70 hover:text-[#4FFFB0] transition-colors border border-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 px-3 py-1.5 rounded-lg"
                            >
                              <Mail size={11} /> Reply via Email
                            </a>
                            <button
                              onClick={() => cycleStatus(booking.id)}
                              className={`flex items-center gap-1.5 text-xs transition-colors border px-3 py-1.5 rounded-lg ${sc.bg} ${sc.text} ${sc.border} hover:opacity-80`}
                            >
                              <CheckCircle size={11} /> {sc.label} (click to change)
                            </button>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="flex items-center gap-1.5 text-xs text-red-400/50 hover:text-red-400 transition-colors border border-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg ml-auto"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
