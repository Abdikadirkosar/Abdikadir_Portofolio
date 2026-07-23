import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TERMINAL_LINES = [
  { text: "Initializing cyber-core...", type: "system" },
  { text: "Connecting to Supabase endpoint...", type: "info" },
  { text: "Database connection established. Status: 200 OK", type: "success" },
  { text: "Loading db_profile & db_projects...", type: "info" },
  { text: "Data sync: COMPLETE (8 projects, 6 posts)", type: "success" },
  { text: "Mapping neural network coordinates...", type: "system" },
  { text: "Diagnostic: All systems operational.", type: "success" },
  { text: "Welcome to Abdikadir's Portfolio v1.4", type: "welcome" },
];

const MiniTerminal = () => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= TERMINAL_LINES.length) {
      // Loop or stop
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLineIndex(0);
      }, 5000); // Wait 5s before restart
      return () => clearTimeout(timeout);
    }

    const delay = currentLineIndex === 0 ? 1000 : Math.random() * 800 + 400;
    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, TERMINAL_LINES[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentLineIndex]);

  const getColor = (type) => {
    switch (type) {
      case "system": return "text-purple-400";
      case "success": return "text-[#4FFFB0] drop-shadow-[0_0_6px_rgba(79,255,176,0.3)]";
      case "welcome": return "text-yellow-400 font-bold";
      default: return "text-white/60";
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#07070b]/90 p-3.5 font-mono text-[10.5px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden group hover:border-[#4FFFB0]/20 transition-all duration-300">
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]/80" />
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]/80" />
          <span className="w-2 h-2 rounded-full bg-[#10B981]/80" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4FFFB0] animate-pulse" />
          <span className="text-white/30 text-[9px] uppercase tracking-wider">guest@kosar: ~</span>
        </div>
      </div>

      {/* Lines container */}
      <div className="space-y-1.5 min-h-[140px] flex flex-col justify-end">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-1.5 leading-relaxed ${getColor(line.type)}`}
            >
              <span className="text-white/20 select-none">&gt;</span>
              <span>{line.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Blinking cursor */}
        <div className="flex items-center gap-1.5 text-[#4FFFB0] pt-1">
          <span className="text-white/20 select-none">&gt;</span>
          <span className="w-1.5 h-3 bg-[#4FFFB0] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default MiniTerminal;
