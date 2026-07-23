import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { safeQuery, isSupabaseEnabled } from "../../../lib/supabase";

const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await safeQuery((sb) =>
      sb.from("messages").select("*").order("created_at", { ascending: false })
    );
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id, current) => {
    await safeQuery((sb) =>
      sb.from("messages").update({ is_read: !current }).eq("id", id)
    );
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !current } : m))
    );
  };

  const deleteMessage = async (id) => {
    await safeQuery((sb) => sb.from("messages").delete().eq("id", id));
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const unread = messages.filter((m) => !m.is_read).length;

  if (!isSupabaseEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl">🔌</div>
        <p className="text-white/40 text-sm font-mono text-center max-w-xs">
          Supabase isn't configured yet. Add your credentials to <span className="text-[#4FFFB0]">.env</span> to see messages.
        </p>
      </div>
    );
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(search.toLowerCase())) ||
      msg.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "read" && msg.is_read) ||
      (filter === "unread" && !msg.is_read);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-bold text-lg">Contact Messages</h2>
          {unread > 0 && (
            <span className="text-[10px] font-mono bg-[#4FFFB0]/15 text-[#4FFFB0] border border-[#4FFFB0]/25 px-2 py-0.5 rounded-full">
              {unread} unread
            </span>
          )}
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search & Filters Row */}
      {!loading && messages.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full">
            <input 
              type="text" 
              placeholder="Search sender, email, content..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-xs pl-3 pr-4 py-2 outline-none focus:border-[#4FFFB0]/30"
            />
          </div>
          
          <div className="flex gap-1.5 border border-white/[0.06] bg-white/[0.01] p-1 rounded-lg">
            {["all", "unread", "read"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilter(m)}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  filter === m
                    ? "bg-[#4FFFB0]/10 text-[#4FFFB0]"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Mail size={32} className="text-white/15" />
          <p className="text-white/25 text-sm">No messages yet</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-xs font-mono">No messages matched your criteria.</div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filteredMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  msg.is_read
                    ? "border-white/[0.06] bg-white/[0.02]"
                    : "border-[#4FFFB0]/15 bg-[#4FFFB0]/[0.03]"
                }`}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  {/* Read indicator */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      msg.is_read ? "bg-white/10" : "bg-[#4FFFB0]"
                    }`}
                    style={
                      !msg.is_read
                        ? { boxShadow: "0 0 8px rgba(79,255,176,0.6)" }
                        : {}
                    }
                  />

                  {/* Name + subject */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white text-sm font-semibold truncate">
                        {msg.name}
                      </p>
                      {msg.subject && (
                        <span className="text-white/30 text-xs truncate hidden sm:block">
                          — {msg.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-white/35 text-xs truncate">{msg.email}</p>
                  </div>

                  {/* Date */}
                  <p className="text-white/25 text-[10px] font-mono flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>

                  {/* Expand chevron */}
                  <div className="text-white/20 flex-shrink-0">
                    {expanded === msg.id ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                </div>

                {/* Expanded message body */}
                <AnimatePresence>
                  {expanded === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-4 pb-4 border-t border-white/[0.06] pt-4">
                        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                          {msg.message}
                        </p>
                        <div className="flex gap-3">
                          <a
                            href={`mailto:${msg.email}`}
                            className="flex items-center gap-1.5 text-xs text-[#4FFFB0]/70 hover:text-[#4FFFB0] transition-colors border border-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 px-3 py-1.5 rounded-lg"
                          >
                            <Mail size={11} />
                            Reply
                          </a>
                          <button
                            onClick={() => markRead(msg.id, msg.is_read)}
                            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg"
                          >
                            {msg.is_read ? (
                              <><Mail size={11} /> Mark unread</>
                            ) : (
                              <><MailOpen size={11} /> Mark read</>
                            )}
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="flex items-center gap-1.5 text-xs text-red-400/50 hover:text-red-400 transition-colors border border-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg ml-auto"
                          >
                            <Trash2 size={11} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
