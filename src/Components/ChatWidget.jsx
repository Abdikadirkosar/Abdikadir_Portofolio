import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import { sendTelegramNotification } from "../lib/telegram";

// ── Pre-defined smart replies ─────────────────────────────────────────────────
const AUTO_REPLIES = {
  hi: "👋 Hello! I'm Abdikadir's AI assistant. How can I help you today?",
  hello: "👋 Hello! I'm Abdikadir's AI assistant. How can I help you today?",
  hey: "👋 Hey there! What can I help you with?",
  "who are you": "🤖 I'm a smart chat assistant for Abdikadir Kosar's portfolio. I can answer questions about his skills, projects, and how to reach him.",
  skills: "💻 Abdikadir specializes in:\n• Full-Stack (React, Node.js, Next.js)\n• AI/ML (LangChain, Python, LLMs)\n• C# Enterprise Systems\n• Cloud & DevOps (Supabase, AWS)",
  projects: "🚀 Abdikadir has built:\n• School, Hotel & Gym Management Systems\n• AI Agent & Chatbot Integrator\n• Face Recognition Attendance\n• This very portfolio!\n\nCheck the Projects section for more.",
  contact: "📧 You can reach Abdikadir at:\n• Email: abdikadirkosara@gmail.com\n• GitHub: github.com/Abdikadirkosar\n• WhatsApp: +252 63 4812030",
  hire: "💼 Yes! Abdikadir is available for hire — both freelance and full-time. Send a message through the Contact section and he'll respond within 24 hours.",
  available: "✅ Abdikadir is currently available for work! Open to freelance projects and full-time roles.",
  cv: "📄 You can download Abdikadir's CV from the Resume button in the hero section. It's available in PDF format.",
  experience: "📅 Abdikadir has 2+ years of professional experience in full-stack development and AI engineering.",
  price: "💰 Project pricing depends on scope and requirements. Send a message via the Contact form and Abdikadir will provide a custom quote.",
  thanks: "🙏 You're welcome! Is there anything else I can help you with?",
  bye: "👋 Goodbye! Feel free to come back anytime. You can also send a message through the Contact section!",
};

const getAutoReply = (msg) => {
  const lower = msg.toLowerCase().trim();
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (lower.includes(key)) return reply;
  }
  return null;
};

// ── Chat bubble ───────────────────────────────────────────────────────────────
const Bubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from === "user" ? "bg-[#4FFFB0]/20" : "bg-[#a855f7]/20"}`}>
      {msg.from === "user" ? <User size={10} className="text-[#4FFFB0]" /> : <Bot size={10} className="text-[#a855f7]" />}
    </div>
    <div
      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
        msg.from === "user"
          ? "bg-[#4FFFB0]/15 text-white border border-[#4FFFB0]/20 rounded-tr-sm"
          : "bg-white/[0.04] text-white/80 border border-white/[0.06] rounded-tl-sm"
      }`}
    >
      {msg.text}
    </div>
  </motion.div>
);

// ── Main ChatWidget ───────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm Abdikadir's assistant. Ask me anything — about his skills, projects, or how to hire him!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [visitorName, setVisitorName] = useState("");
  const [nameAsked, setNameAsked] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const addMsg = (from, text) => setMessages(m => [...m, { from, text }]);

  const send = async () => {
    const txt = input.trim();
    if (!txt) return;
    setInput("");
    addMsg("user", txt);
    setTyping(true);

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));

    const autoReply = getAutoReply(txt);
    if (autoReply) {
      setTyping(false);
      addMsg("bot", autoReply);
    } else {
      // Forward to Telegram admin and reply
      try {
        await sendTelegramNotification({
          name: visitorName || "Website Visitor",
          email: "chat-widget",
          subject: "💬 Live Chat Message",
          message: txt,
        });
      } catch (_) {}

      setTyping(false);
      addMsg("bot",
        "📩 I've forwarded your message to Abdikadir directly! He'll get back to you soon.\n\nYou can also reach him at:\n• abdikadirkosara@gmail.com\n• Contact section below"
      );
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-[1000] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ background: "linear-gradient(135deg, #4FFFB0, #38bdf8)", boxShadow: "0 0 30px rgba(79,255,176,0.3)" }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={20} className="text-black" /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={20} className="text-black" /></motion.span>
          }
        </AnimatePresence>
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#0A0A0A]">
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-44 right-6 z-[999] w-[340px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            style={{ background: "#0d0d14", boxShadow: "0 0 50px rgba(0,0,0,0.6)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]" style={{ background: "linear-gradient(135deg, #4FFFB010, #38bdf808)" }}>
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4FFFB0] to-[#38bdf8] flex items-center justify-center">
                  <Bot size={16} className="text-black" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4FFFB0] border-2 border-[#0d0d14]" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Abdikadir's Assistant</p>
                <p className="text-[#4FFFB0] text-[10px] font-mono">● Online</p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-white/30 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto scrollbar-thin">
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                    <Bot size={10} className="text-[#a855f7]" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-none">
              {["Skills", "Projects", "Hire me", "Contact"].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="flex-shrink-0 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/50 text-[10px] font-mono hover:border-[#4FFFB0]/30 hover:text-[#4FFFB0] transition-all">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-white/[0.06]">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#4FFFB0]/30 transition-colors"
              />
              <button onClick={send} disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                style={{ background: input.trim() ? "linear-gradient(135deg, #4FFFB0, #38bdf8)" : "rgba(255,255,255,0.05)" }}>
                <Send size={12} className={input.trim() ? "text-black" : "text-white/30"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
