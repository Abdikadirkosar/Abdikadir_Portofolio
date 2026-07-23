import { useEffect, useState } from "react";
import { safeQuery } from "../../lib/supabase";
import { toast } from "react-toastify";
import { PageHeader, PageLoader, ConfirmDelete } from "../components/AdminUI";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, Trash2, X } from "lucide-react";

const Messages = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("all"); // all | unread | read

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb =>
      sb.from("messages").select("*").order("created_at", { ascending: false })
    );
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id, value = true) => {
    await safeQuery(sb => sb.from("messages").update({ is_read: value }).eq("id", id));
    setRows(r => r.map(m => m.id === id ? { ...m, is_read: value } : m));
    if (selected?.id === id) setSelected(s => ({ ...s, is_read: value }));
  };

  const openMsg = (msg) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id, true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("messages").delete().eq("id", confirmId));
    setDeleting(false);
    setConfirmId(null);
    if (selected?.id === confirmId) setSelected(null);
    toast.success("Deleted!");
    fetch();
  };

  const formatDate = (d) => {
    try { return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return d; }
  };

  const filtered = rows.filter(m =>
    filter === "unread" ? !m.is_read : filter === "read" ? m.is_read : true
  );

  const unreadCount = rows.filter(m => !m.is_read).length;

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${rows.length} total · ${unreadCount} unread`} />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {["all", "unread", "read"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono capitalize transition-all border ${filter === f ? "bg-[#4FFFB0]/10 text-[#4FFFB0] border-[#4FFFB0]/25" : "text-white/30 border-white/[0.08] hover:text-white/60"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        {/* Message list */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#0d0d14]/60 flex flex-col">
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-white/20 text-sm font-mono">No messages</div>
          )}
          {filtered.map(msg => (
            <motion.button
              key={msg.id}
              onClick={() => openMsg(msg)}
              className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] transition-all duration-200 last:border-0 relative ${selected?.id === msg.id ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"}`}
            >
              {!msg.is_read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r bg-[#4FFFB0]" />
              )}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 ${msg.is_read ? "text-white/20" : "text-[#4FFFB0]"}`}>
                  {msg.is_read ? <MailOpen size={14} /> : <Mail size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${msg.is_read ? "text-white/50" : "text-white"}`}>{msg.name}</p>
                    <span className="text-[10px] text-white/25 font-mono flex-shrink-0">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="text-[11px] text-white/30 truncate mt-0.5">{msg.subject || msg.email}</p>
                  <p className="text-[11px] text-white/20 truncate mt-0.5">{msg.message}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Message detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0d0d14]/60 p-6 relative"
            >
              {/* Top shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.4), transparent)" }} />

              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-white font-bold text-lg">{selected.subject || "— No Subject —"}</h2>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-white/40 text-sm">{selected.name}</span>
                    <a href={`mailto:${selected.email}`} className="text-[#4FFFB0]/60 hover:text-[#4FFFB0] text-xs font-mono transition-colors">{selected.email}</a>
                  </div>
                  <p className="text-white/25 text-xs font-mono mt-1">{formatDate(selected.created_at)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => markRead(selected.id, !selected.is_read)}
                    className="p-2 rounded-xl border border-white/[0.08] text-white/30 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/25 transition-all text-xs font-mono flex items-center gap-1.5">
                    {selected.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                    <span className="hidden sm:inline">{selected.is_read ? "Mark Unread" : "Mark Read"}</span>
                  </button>
                  <button onClick={() => setConfirmId(selected.id)}
                    className="p-2 rounded-xl border border-white/[0.08] text-white/30 hover:text-red-400 hover:border-red-500/25 transition-all">
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl border border-white/[0.08] text-white/30 hover:text-white transition-all">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/[0.05] mb-5" />

              <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">{selected.message}</p>

              <div className="mt-6">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ""}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-bold text-black transition-all hover:opacity-90"
                  style={{ background: "#4FFFB0" }}>
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0d0d14]/40 flex items-center justify-center h-64"
            >
              <p className="text-white/15 text-sm font-mono">Select a message to read</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default Messages;
