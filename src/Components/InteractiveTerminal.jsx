import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function InteractiveTerminal() {
  const { t, lang } = useLanguage();
  const { toggleTheme } = useTheme();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: t.terminal.welcome, type: "system" },
    { text: "Type 'help' to view all available commands.", type: "system" }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { text: `$ ${input}`, type: "command" }];
    setInput("");

    let response = [];

    switch (cmd) {
      case "help":
        response = [
          "Available Commands:",
          "  whoami     - Display developer overview",
          "  skills     - View primary tech stack",
          "  projects   - Summary of key portfolio projects",
          "  contact    - Get direct contact details",
          "  hire       - Hiring availability info",
          "  theme      - Toggle Light/Dark mode",
          "  clear      - Clear terminal screen"
        ];
        break;

      case "whoami":
        response = [
          "ABDIKADIR - AI Engineer & Full-Stack Architect",
          "Specialized in AI/ML model deployment, Agentic workflows, PyTorch & Next.js."
        ];
        break;

      case "skills":
        response = [
          "Core Skills Matrix:",
          "  [AI/ML]    PyTorch, RAG, LLM Agents, Computer Vision",
          "  [Frontend] React, Next.js, Tailwind CSS, Framer Motion",
          "  [Backend]  Python, FastAPI, Node.js, Express",
          "  [Database] PostgreSQL, Supabase, Redis, Vector DB"
        ];
        break;

      case "projects":
        response = [
          "Key Featured Projects:",
          "  1. AI Customer Support Agent (PyTorch + Next.js)",
          "  2. Real-Time Data Analytics Dashboard",
          "  3. Autonomous Coding Assistant Workflow",
          "Scroll to the Projects section to view live demos!"
        ];
        break;

      case "contact":
        response = [
          "Contact Details:",
          "  Email: abdikadirkosara@gmail.com",
          "  GitHub: github.com",
          "  Status: Open for new opportunities"
        ];
        break;

      case "hire":
        response = [
          "HIRING STATUS: AVAILABLE",
          "Available for full-time engineering roles, AI consulting, and freelance contracts."
        ];
        break;

      case "theme":
        toggleTheme();
        response = ["Theme toggled successfully."];
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        response = [`Command not recognized: '${cmd}'. Type 'help' for available commands.`];
    }

    response.forEach((line) => {
      newHistory.push({ text: line, type: "output" });
    });

    setHistory(newHistory);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 rounded-2xl border border-white/10 bg-[#0d0d12]/90 backdrop-blur-md overflow-hidden shadow-2xl font-mono text-xs">
      {/* Header */}
      <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-white/40 text-[11px] flex items-center gap-1">
            <TerminalIcon size={13} className="text-[#4FFFB0]" />
            {t.terminal.title}
          </span>
        </div>
        <span className="text-[#4FFFB0] text-[10px] animate-pulse">● LIVE_SHELL</span>
      </div>

      {/* Terminal Body */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="p-4 h-64 overflow-y-auto space-y-2 cursor-text"
      >
        {history.map((item, i) => (
          <div 
            key={i} 
            className={`${
              item.type === "command" 
                ? "text-[#4FFFB0] font-bold" 
                : item.type === "system" 
                ? "text-white/40 italic" 
                : "text-white/80"
            }`}
          >
            {item.text}
          </div>
        ))}

        {/* Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-[#4FFFB0] font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none caret-[#4FFFB0]"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="text-white/20 hover:text-white/60">
            <CornerDownLeft size={12} />
          </button>
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
