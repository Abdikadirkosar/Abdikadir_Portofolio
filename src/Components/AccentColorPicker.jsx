import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";

const accents = [
  { id: "emerald", name: "Emerald Mint", value: "#4FFFB0", dim: "rgba(79, 255, 176, 0.18)" },
  { id: "cyan", name: "Electric Cyan", value: "#38bdf8", dim: "rgba(56, 189, 248, 0.18)" },
  { id: "purple", name: "Cyber Purple", value: "#a855f7", dim: "rgba(168, 85, 247, 0.18)" },
  { id: "amber", name: "Sunset Amber", value: "#fbbf24", dim: "rgba(251, 191, 36, 0.18)" },
  { id: "rose", name: "Crimson Rose", value: "#f43f5e", dim: "rgba(244, 63, 94, 0.18)" },
];

export default function AccentColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState(accents[0]);

  const changeAccent = (accent) => {
    setActiveAccent(accent);
    const root = document.documentElement;
    root.style.setProperty("--accent", accent.value);
    root.style.setProperty("--accent-dim", accent.dim);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/10 transition-all duration-300 cursor-pointer"
        title="Custom Accent Color"
      >
        <Palette size={15} style={{ color: activeAccent.value }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute right-0 mt-2 p-2.5 rounded-2xl border border-white/10 bg-[#0d0d12]/95 backdrop-blur-xl shadow-2xl flex items-center gap-2 z-50"
          >
            {accents.map((acc) => (
              <button
                key={acc.id}
                onClick={() => changeAccent(acc)}
                className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: acc.value }}
                title={acc.name}
              >
                {activeAccent.id === acc.id && (
                  <Check size={12} className="text-slate-950 font-bold" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
