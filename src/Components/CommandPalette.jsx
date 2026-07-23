import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Command, ArrowRight, Sun, Moon, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t, lang, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  // Listen for Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions = [
    { id: "home", label: t.nav.home, category: "Navigation", target: "Home" },
    { id: "about", label: t.nav.about, category: "Navigation", target: "About" },
    { id: "services", label: t.nav.services, category: "Navigation", target: "Services" },
    { id: "skills", label: t.nav.skills, category: "Navigation", target: "Skills" },
    { id: "projects", label: t.nav.projects, category: "Navigation", target: "Projects" },
    { id: "experience", label: t.nav.experience, category: "Navigation", target: "Experience" },
    { id: "education", label: t.nav.education, category: "Navigation", target: "Education" },
    { id: "certificates", label: t.nav.certificates, category: "Navigation", target: "Certificates" },
    { id: "testimonials", label: t.nav.testimonials, category: "Navigation", target: "Testimonials" },
    { id: "blog", label: t.nav.blog, category: "Navigation", target: "Blog" },
    { id: "contact", label: t.nav.contact, category: "Navigation", target: "Contact" },
    {
      id: "theme",
      label: isDark ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙",
      category: "Settings",
      run: toggleTheme,
    },
    {
      id: "language",
      label: lang === "EN" ? "Switch to Somali 🇸🇴" : "Switch to English 🇬🇧",
      category: "Settings",
      run: toggleLanguage,
    },
  ];

  const filtered = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase().trim())
  );

  const executeAction = (action) => {
    setIsOpen(false);
    setQuery("");

    if (action.run) {
      action.run();
      return;
    }

    if (action.target) {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      {/* Shortcut Indicator Button in Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-[#4FFFB0]/30 transition-all font-mono text-[11px] cursor-pointer"
        title="Open Command Palette (Ctrl + K)"
      >
        <Search size={13} className="text-[#4FFFB0]" />
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70 font-sans border border-white/10">
          Ctrl K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl rounded-2xl border border-[#4FFFB0]/30 bg-[#0d0d12]/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden font-mono"
            >
              {/* Search Bar Input */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <Search size={18} className="text-[#4FFFB0]" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.cmdPalette.placeholder}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Action List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center text-xs text-white/30">
                    {t.cmdPalette.noResults}
                  </div>
                ) : (
                  filtered.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => executeAction(act)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between text-white/80 hover:text-[#4FFFB0] hover:bg-white/5 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={14} className="text-white/30 group-hover:text-[#4FFFB0]" />
                        <span>{act.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/30 font-sans">
                        <span>{act.category}</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex justify-between items-center text-[10px] text-white/30">
                <span className="flex items-center gap-1">
                  <Command size={11} /> Command Palette
                </span>
                <span>{t.cmdPalette.shortcutHint}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
