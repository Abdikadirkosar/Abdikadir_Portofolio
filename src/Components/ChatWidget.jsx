import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import { sendTelegramNotification } from "../lib/telegram";

// ══════════════════════════════════════════════════════════════════════════════
//  ABDIKADIR KNOWLEDGE BASE — full expertise, projects, and contact info
// ══════════════════════════════════════════════════════════════════════════════
const KB = [
  // Greetings
  { k: ["hi","hello","hey","salaam","merhaba","sup"], r:
    `👋 Salaam! I'm Abdikadir's AI assistant.\n\nAsk me anything about his:\n• 💻 Skills & technologies\n• 🚀 Projects he's built\n• 💼 Work experience\n• 📞 How to contact or hire him\n\nI'm here to help!` },

  // Who is he
  { k: ["who","abdikadir","about","yourself","introduce"], r:
    `👨‍💻 **Abdikadir Kosar Osman**\n\nFull-Stack Engineer & AI Specialist based in Hargeisa, Somaliland.\n\n✅ 2+ years of professional experience\n🎓 Computer Science background\n🌐 Available for freelance & full-time roles\n🏆 8+ certificates in web dev, AI & cloud` },

  // Skills
  { k: ["skill","tech","stack","know","language","framework","use"], r:
    `💻 **Technical Skills:**\n\n🔷 Frontend:\n  React.js, Next.js, TypeScript, TailwindCSS, Framer Motion\n\n🔶 Backend:\n  Node.js, C#, .NET, Express.js, Python\n\n🤖 AI/ML:\n  LangChain, OpenAI API, LLM Agents, Prompt Engineering\n\n🗄️ Database:\n  Supabase, PostgreSQL, SQL Server, Firebase\n\n☁️ Cloud/DevOps:\n  Vercel, AWS basics, Git, GitHub Actions` },

  // Frontend
  { k: ["frontend","react","next","css","tailwind","ui","design"], r:
    `🎨 **Frontend Expertise:**\n\n• React.js & Next.js — enterprise-grade SPAs\n• TailwindCSS + Framer Motion — premium animations\n• Responsive design & glassmorphism UI\n• Performance optimization & PWA\n• 3D effects with Three.js\n\nCheck the Projects section to see live examples!` },

  // Backend
  { k: ["backend","server","api","node","csharp","dotnet","python"], r:
    `⚙️ **Backend Expertise:**\n\n• Node.js + Express — REST APIs\n• C# / .NET — Enterprise Windows applications\n• Python — Automation & AI scripts\n• JWT authentication & role-based access\n• Real-time features with WebSockets & Supabase\n• Email systems (EmailJS, SMTP)` },

  // AI/ML
  { k: ["ai","ml","machine learning","langchain","llm","chatbot","gpt","openai","agent"], r:
    `🤖 **AI & Machine Learning:**\n\n• LangChain — AI agent pipelines & RAG systems\n• OpenAI & Gemini API integration\n• Prompt Engineering & fine-tuning\n• Face Recognition (Python + OpenCV)\n• Telegram Bot development\n• NLP for Arabic & Somali text\n• This AI assistant was built by him!` },

  // Projects
  { k: ["project","built","portfolio","work","system","app","build"], r:
    `🚀 **Key Projects:**\n\n1️⃣ **This Portfolio** — React + Supabase + AI + 2FA\n2️⃣ **Hotel Management System** — Full POS, booking & reporting (C#)\n3️⃣ **School Management System** — Students, grades, attendance (C# + SQL)\n4️⃣ **Gym Management System** — Members, payments, schedules\n5️⃣ **AI Chatbot Integrator** — LangChain + GPT-4\n6️⃣ **Face Recognition Attendance** — Python + OpenCV\n7️⃣ **AI Tutor Platform** — Personalized learning with LLMs\n\n👉 Visit the Projects section for live demos!` },

  // Experience
  { k: ["experience","work","company","job","year","professional"], r:
    `📅 **Work Experience:**\n\n🏢 **Full-Stack Developer** (2022 – Present)\n  • Built enterprise management systems\n  • Delivered 15+ client projects\n  • Led UI/UX design and backend architecture\n\n🤖 **AI Engineer** (2023 – Present)\n  • Developed LangChain AI agents\n  • Integrated OpenAI & Gemini APIs\n  • Built Telegram automation bots\n\n2+ years of professional experience across web & AI.` },

  // Education
  { k: ["education","degree","university","study","certificate","college"], r:
    `🎓 **Education & Certifications:**\n\n📚 Computer Science — University level\n\n🏆 Certificates:\n  • Full-Stack Web Development\n  • React.js Advanced\n  • Python for AI/ML\n  • C# Enterprise Development\n  • AWS Cloud Practitioner basics\n  • UI/UX Design Principles\n  • LangChain & LLM Engineering\n  • Supabase & PostgreSQL\n\n8+ professional certificates!` },

  // Hire
  { k: ["hire","freelance","work with","collaboration","job","available","opportunity"], r:
    `💼 **Hire Abdikadir:**\n\n✅ Currently available for:\n  • Freelance projects (any size)\n  • Full-time remote roles\n  • Contract work\n\n⚡ Response time: < 24 hours\n💰 Pricing: Custom quote based on project\n🌍 Works remotely worldwide\n\n📩 **Contact now:**\n  → abdikadirkosara@gmail.com\n  → WhatsApp: +252 63 4812030\n  → Or use the Contact section below!` },

  // Contact
  { k: ["contact","email","phone","reach","social","whatsapp","github","linkedin"], r:
    `📞 **Contact Information:**\n\n📧 Email: abdikadirkosara@gmail.com\n📱 WhatsApp: +252 63 4812030\n🐙 GitHub: github.com/Abdikadirkosar\n💼 LinkedIn: linkedin.com/in/abdikadirkosar\n\n💡 Use the Contact form at the bottom of the page for the fastest response!` },

  // Pricing
  { k: ["price","cost","budget","rate","how much","charge","quote"], r:
    `💰 **Project Pricing:**\n\nPricing depends on:\n  • Project complexity & scope\n  • Timeline & deadline\n  • Technologies required\n\n📊 **Rough estimates:**\n  • Simple landing page: $200-500\n  • Full web app: $500-2000+\n  • AI integration: $300-1500\n  • Enterprise system: Custom quote\n\n📩 Send a message for a free custom quote!` },

  // Location
  { k: ["where","location","country","city","somali","hargeisa","timezone"], r:
    `🌍 **Location:**\n\nAbdikadir is based in **Hargeisa, Somaliland**.\n\n🕐 Timezone: EAT (UTC+3)\n🌐 Works with clients worldwide\n💻 Available for remote work globally\n✈️ Open to relocation for the right opportunity` },

  // CV / Resume
  { k: ["cv","resume","download","pdf"], r:
    `📄 **Resume / CV:**\n\nYou can download Abdikadir's full CV directly from the hero section — look for the **Download CV** button!\n\nThe CV includes:\n  • Full work history\n  • Technical skills\n  • Education & certificates\n  • Project portfolio` },

  // Thanks
  { k: ["thank","thanks","great","awesome","perfect","nice"], r:
    `🙏 You're very welcome! I'm glad I could help.\n\nFeel free to ask anything else, or reach out to Abdikadir directly:\n📧 abdikadirkosara@gmail.com` },

  // Bye
  { k: ["bye","goodbye","later","see you","ciao"], r:
    `👋 Goodbye! It was great chatting with you.\n\nDon't hesitate to come back anytime. You can also send Abdikadir a message through the Contact section — he responds within 24 hours! 🚀` },
];

const QUICK = [
  "💻 Skills", "🚀 Projects", "💼 Hire me",
  "📞 Contact", "🤖 AI work", "💰 Pricing"
];

const findReply = (msg) => {
  const lower = msg.toLowerCase();
  for (const entry of KB) {
    if (entry.k.some(k => lower.includes(k))) return entry.r;
  }
  return null;
};

// ── Bubble ────────────────────────────────────────────────────────────────────
const Bubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from === "user" ? "bg-[#4FFFB0]/20" : "bg-[#a855f7]/20"}`}>
      {msg.from === "user"
        ? <User size={10} className="text-[#4FFFB0]" />
        : <Sparkles size={10} className="text-[#a855f7]" />}
    </div>
    <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
      msg.from === "user"
        ? "bg-[#4FFFB0]/15 text-white border border-[#4FFFB0]/20 rounded-tr-sm"
        : "bg-white/[0.04] text-white/85 border border-white/[0.07] rounded-tl-sm"
    }`}>{msg.text}</div>
  </motion.div>
);

// ── Typing indicator ──────────────────────────────────────────────────────────
const Typing = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
      <Sparkles size={10} className="text-[#a855f7]" />
    </div>
    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] flex gap-1.5 items-center">
      {[0,1,2].map(i => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#a855f7]/60"
          animate={{ y: [0,-5,0] }} transition={{ duration: 0.55, delay: i*0.15, repeat: Infinity }} />
      ))}
    </div>
  </div>
);

// ── Main ChatWidget ───────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "👋 Salaam! I'm Abdikadir's AI assistant.\n\nAsk me about his skills, projects, experience, or how to hire him! 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  const addBot = (text) => setMsgs(m => [...m, { from: "bot", text }]);
  const addUser = (text) => setMsgs(m => [...m, { from: "user", text }]);

  const send = async (text) => {
    const txt = (text || input).trim();
    if (!txt) return;
    setInput("");
    addUser(txt);
    setTyping(true);
    await new Promise(r => setTimeout(r, 500 + Math.random() * 700));
    setTyping(false);

    const reply = findReply(txt);
    if (reply) {
      addBot(reply);
    } else {
      // Forward unknown questions to Telegram
      try {
        await sendTelegramNotification({
          name: "Website Visitor",
          email: "chat-widget",
          subject: "💬 Chat Question",
          message: txt,
        });
      } catch (_) {}
      addBot(
        `🤔 That's a great question! I've forwarded it to Abdikadir directly.\n\nHe'll respond within 24 hours at:\n📧 abdikadirkosara@gmail.com\n\nMeanwhile, try asking about:\n• Skills • Projects • Experience • Pricing`
      );
    }
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* ── Floating Button ───────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[1000] flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl font-mono text-xs font-bold text-black cursor-pointer"
        style={{ background: "linear-gradient(135deg, #4FFFB0, #38bdf8)", boxShadow: "0 0 35px rgba(79,255,176,0.35)" }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={16} /></motion.span>
            : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot size={16} className="animate-bounce" /></motion.span>
          }
        </AnimatePresence>
        <span className="hidden md:inline">{open ? "Close AI" : "Ask AI"}</span>
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#0A0A0A]">
            {unread}
          </span>
        )}
      </motion.button>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[999] w-[350px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
            style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.7)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]" style={{ background: "linear-gradient(135deg, rgba(79,255,176,0.06), rgba(56,189,248,0.04))" }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4FFFB0] to-[#38bdf8] flex items-center justify-center">
                  <Sparkles size={16} className="text-black" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4FFFB0] border-2 border-[#0d0d14]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">Abdikadir's AI Assistant</p>
                <p className="text-[#4FFFB0] text-[10px] font-mono">● Online · Knows everything about Abdikadir</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors p-1">
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
              {msgs.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {typing && <Typing />}
              <div ref={endRef} />
            </div>

            {/* Quick chips */}
            <div className="flex gap-2 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/50 text-[10px] font-mono hover:border-[#4FFFB0]/30 hover:text-[#4FFFB0] hover:bg-[#4FFFB0]/5 transition-all duration-200 whitespace-nowrap">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-white/[0.06]">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about skills, projects, pricing..."
                className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#4FFFB0]/30 transition-colors"
              />
              <motion.button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                style={{ background: input.trim() ? "linear-gradient(135deg, #4FFFB0, #38bdf8)" : "rgba(255,255,255,0.05)" }}
              >
                <Send size={13} className={input.trim() ? "text-black" : "text-white/30"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
