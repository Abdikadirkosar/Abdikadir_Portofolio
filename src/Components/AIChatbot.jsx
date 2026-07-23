import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, User, Minimize2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AIChatbot() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: t.chatbot.welcome }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendQuery = (userText) => {
    if (!userText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = generateAIReply(userText, lang);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  const quickPrompts = lang === "SO" ? [
    "🤖 Xirfadahaaga ugu sareeya?",
    "💻 Mashariicda aad dhistay?",
    "💼 Sidaan kuu kireystaa?",
    "📩 Emailkaaga & Contact?"
  ] : [
    "🤖 What are your top skills?",
    "💻 Show key projects",
    "💼 How can I hire you?",
    "📩 Get contact info"
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(79,255,176,0.4)] border border-white/20 flex items-center gap-2.5 cursor-pointer"
      >
        <Bot size={22} className="animate-bounce" />
        <span className="hidden md:inline font-mono text-xs tracking-wide">
          {isOpen ? (lang === "SO" ? "Xir AI" : "Close AI") : (lang === "SO" ? "Weeydii AI" : "Ask AI")}
        </span>
      </motion.button>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 md:right-8 z-50 w-[92vw] max-w-[380px] h-[520px] rounded-2xl border border-emerald-500/30 bg-[#0d0d12]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#4FFFB0]/20 border border-[#4FFFB0]/40 flex items-center justify-center text-[#4FFFB0]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    {t.chatbot.title}
                  </h3>
                  <p className="text-[10px] text-[#4FFFB0] font-mono">{t.chatbot.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                      <Bot size={12} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-slate-950 font-semibold rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none font-sans"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-white/40 text-xs font-mono">
                  <Bot size={14} className="animate-spin text-[#4FFFB0]" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-3 py-1.5 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/10 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatbot.placeholder}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#4FFFB0]/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-[#4FFFB0] text-slate-950 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Smart AI Response Knowledge Engine ─────────────────────────────────────────
function generateAIReply(query, lang) {
  const q = query.toLowerCase();

  if (q.includes("skill") || q.includes("xirfad") || q.includes("python") || q.includes("react") || q.includes("top")) {
    return lang === "SO"
      ? "🎯 *Xirfadaha Ugu Sareeya ee Abdikadir:*\n\n• **AI & ML**: PyTorch, RAG Architecture, LLM Agents, Computer Vision, LangChain.\n• **Full-Stack**: React.js, Next.js, Node.js, FastAPI, Tailwind CSS.\n• **Databases & Cloud**: PostgreSQL, Supabase, Redis, AWS, Docker, Vercel."
      : "🎯 *Abdikadir's Top Skill Matrix:*\n\n• **AI & ML**: PyTorch, RAG Architecture, LLM Agents, Computer Vision, LangChain.\n• **Full-Stack**: React.js, Next.js, Node.js, FastAPI, Tailwind CSS.\n• **Databases & Cloud**: PostgreSQL, Supabase, Redis, AWS, Docker, Vercel.";
  }

  if (q.includes("hire") || q.includes("kirey") || q.includes("contact") || q.includes("email") || q.includes("work") || q.includes("phone")) {
    return lang === "SO"
      ? "💼 *Sida Abdikadir loo kireysto:*\n\nAbdikadir wuxuu diyaar u yahay shaqo full-time ah, AI consulting, ama mashariic freelance ah.\n\n📧 **Email**: abdikadirkosara@gmail.com\n📱 **WhatsApp**: +252634812030\n📍 Waxaad fariin toos ah kaga tagi kartaa qaybta 'Contact' ee bogga hoose!"
      : "💼 *Hiring & Contact Details:*\n\nAbdikadir is open for full-time engineering roles, AI consulting, and high-impact freelance projects.\n\n📧 **Email**: abdikadirkosara@gmail.com\n📱 **WhatsApp**: +252634812030\n📍 You can also send a direct message via the 'Contact' section below!";
  }

  if (q.includes("project") || q.includes("mashruuc") || q.includes("code") || q.includes("demo")) {
    return lang === "SO"
      ? "💻 *Mashariicda Ugu Waawayn:*\n\n1. **AI Agent & Chatbot Integrator** (PyTorch + Next.js)\n2. **School Management System** (Full-Stack Enterprise)\n3. **Hotel Management System** (Reservation & Billing Suite)\n4. **Gym Management System** (Membership Automation)\n\nEeg qaybta 'Projects' ee bogga si aad u aragto live demos & GitHub repos!"
      : "💻 *Key Featured Projects:*\n\n1. **AI Agent & Chatbot Integrator** (PyTorch + Next.js)\n2. **School Management System** (Full-Stack Enterprise)\n3. **Hotel Management System** (Reservation & Billing Suite)\n4. **Gym Management System** (Membership Automation)\n\nCheck out the 'Projects' section to explore live demos & code repositories!";
  }

  if (q.includes("who") || q.includes("kumay") || q.includes("name") || q.includes("magac") || q.includes("about")) {
    return lang === "SO"
      ? "🚀 **Abdikadir** waa AI Engineer & Full-Stack Architect u taagan dhisidda nidaamyo caqli badan oo dhakhso badan. Wuxuu leeyahay sanado khibrad ah oo uu ku dhisay mashariic waaweyn."
      : "🚀 **Abdikadir** is an AI Engineer & Full-Stack Architect building intelligent, high-performance digital systems. He has years of hands-on experience building production AI & full-stack web applications.";
  }

  return lang === "SO"
    ? "Mahadsanid! Si aad wax badan uga ogaato Abdikadir, eeg qaybaha Projects, Skills, iyo Contact ama iga weeydii su'aal kale!"
    : "Thanks for asking! To learn more about Abdikadir, explore the Projects, Skills, and Contact sections on the portfolio!";
}
