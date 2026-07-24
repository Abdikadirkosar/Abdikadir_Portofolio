import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { trackPageView } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import CommandPalette from "./CommandPalette";
import AccentColorPicker from "./AccentColorPicker";
import ProjectCostEstimator from "./ProjectCostEstimator";
import VCardModal from "./VCardModal";
import BookCallModal from "./BookCallModal";
import { Sun, Moon, Languages } from "lucide-react";

const navKeys = [
  { id: "home", target: "Home", key: "home" },
  { id: "about", target: "About", key: "about" },
  { id: "services", target: "Services", key: "services" },
  { id: "skills", target: "Skills", key: "skills" },
  { id: "projects", target: "Projects", key: "projects" },
  { id: "experience", target: "Experience", key: "experience" },
  { id: "education", target: "Education", key: "education" },
  { id: "certificates", target: "Certificates", key: "certificates" },
  { id: "contact", target: "Contact", key: "contact" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ScrambledLink = ({ label, active }) => {
  const [displayText, setDisplayText] = useState(label);
  const intervalRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";

  const handleMouseEnter = () => {
    let iterations = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText(
        label
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return label[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iterations += 1 / 3;
      if (iterations >= label.length) {
        clearInterval(intervalRef.current);
        setDisplayText(label);
      }
    }, 30);
  };

  const handleMouseLeave = () => {
    setDisplayText(label);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`text-sm transition-colors duration-200 cursor-pointer font-mono font-bold tracking-wide ${
        active ? "text-[#4FFFB0]" : "text-slate-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-white"
      }`}
    >
      {displayText}
    </span>
  );
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const trackTimeoutRef = useRef(null);
  const reportedPages = useRef(new Set());
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();

  // Track initial land once
  useEffect(() => {
    trackPageView("home");
    reportedPages.current.add("home");
  }, []);

  // ── SECRET ADMIN SHORTCUT: Ctrl + Shift + A ─────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  // ───────────────── Observer for active section ─────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageId = entry.target.id.toLowerCase();
            setActive(pageId);

            if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
            trackTimeoutRef.current = setTimeout(() => {
              if (!reportedPages.current.has(pageId)) {
                trackPageView(pageId);
                reportedPages.current.add(pageId);
              }
            }, 1000);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
    };
  }, []);

  // ───────────────── Navbar Background ─────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ───────────────── Body Lock ─────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ───────────────── Scroll Function ─────────────────
  const handleClick = (id, target) => {
    const section = document.getElementById(target);

    if (!section) return;

    setActive(id);
    if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
    
    // Instantly track explicit click
    if (!reportedPages.current.has(id)) {
      trackPageView(id);
      reportedPages.current.add(id);
    }

    // اقفل المنيو الأول
    setIsOpen(false);

    // افتح السكرول
    document.body.style.overflow = "";

    // استنى frame عشان الـ menu يختفي
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  return (
    <>
      {/* ───────────────── NAVBAR (LOCKED / STICKY GLASSBAR) ───────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-20 w-full transition-all duration-300 border-b border-white/[0.08] backdrop-blur-xl bg-[#0a0a0f]/85 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
      >
        <div className="flex h-full items-center justify-between px-6 lg:px-[13%]">
          {/* ───────────────── LOGO ───────────────── */}
          <button
            onClick={() => handleClick("home", "Home")}
            className="flex items-center gap-3 text-xl font-bold tracking-wide text-white transition-all duration-300 hover:text-[#4FFFB0] group"
          >
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Abdikadir Logo" 
                className="h-9 w-9 object-cover rounded-full border border-white/10 group-hover:border-[#4FFFB0]/40 transition-all duration-300" 
              />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "0 0 16px rgba(79,255,176,0.35)" }} />
            </div>
            <span className="font-mono">
              Abdikadir<span className="text-[#4FFFB0]" style={{ textShadow: "0 0 12px rgba(79,255,176,0.5)" }}>.</span>
            </span>
          </button>

          {/* ───────────────── DESKTOP LINKS ───────────────── */}
          <div className="hidden items-center gap-6 lg:flex">
            {navKeys.filter((l) => l.id !== "contact").map((link) => (
              <button
                key={link.id}
                onClick={() => handleClick(link.id, link.target)}
                className="group relative flex flex-col items-center gap-1"
              >
                <ScrambledLink label={t.nav[link.key] || link.target} active={active === link.id} />

                <span
                  className={`h-[3px] rounded-full transition-all duration-300 
                  ${
                    active === link.id
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  }`}
                  style={{
                    background: active === link.id
                      ? "linear-gradient(90deg, #4FFFB0, #38bdf8)"
                      : "rgba(79,255,176,0.7)",
                    boxShadow: active === link.id ? "0 0 8px rgba(79,255,176,0.6)" : "none",
                  }}
                />
              </button>
            ))}

            {/* Desktop Controls (Command Palette + Accent Picker + Quote Estimator + Language + Theme) */}
            <div className="flex items-center gap-2 ml-2 border-l border-white/[0.08] pl-3 shrink-0 whitespace-nowrap">
              <CommandPalette />
              <AccentColorPicker />
              <ProjectCostEstimator />
              <VCardModal />
              <BookCallModal />

              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 flex items-center gap-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/10 transition-all duration-300 cursor-pointer font-mono text-xs font-bold shrink-0 whitespace-nowrap"
                title={lang === "EN" ? "Switch to Somali (🇸🇴)" : "Switch to English (🇬🇧)"}
              >
                <Languages size={14} className="text-[#4FFFB0]" />
                <span>{lang === "EN" ? "EN 🇬🇧" : "SO 🇸🇴"}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/10 transition-all duration-300 cursor-pointer"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} className="text-indigo-400" />}
              </button>

              <button
                onClick={() => handleClick("contact", "Contact")}
              >
                Contact
              </button>
            </div>
          </div>

          {/* ───────────────── MOBILE BUTTON ───────────────── */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden rounded-xl border border-white/10 hover:border-[#4FFFB0]/30 transition-all duration-300"
          >
            <span
              className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300
              ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300
              ${isOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300
              ${isOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* ───────────────── MOBILE MENU ───────────────── */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(4,4,8,0.97) 0%, rgba(8,4,16,0.97) 50%, rgba(4,8,12,0.97) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Ambient glow orbs */}
            <div className="pointer-events-none absolute top-1/4 left-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(79,255,176,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.4), transparent)" }} />

            <motion.div
              className="flex flex-col items-center gap-8 text-center relative z-10"
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo in menu */}
              <motion.div variants={item} className="mb-2">
                <span className="text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase">Navigation</span>
              </motion.div>

              {navKeys.filter((l) => l.id !== "contact").map((link) => (
                <motion.button
                  key={link.id}
                  variants={item}
                  onClick={() => handleClick(link.id, link.target)}
                  className="group relative py-1.5"
                >
                  <span
                    className={`text-lg uppercase tracking-[0.25em] font-light transition-all duration-300
                    ${
                      active === link.id
                        ? "text-[#4FFFB0]"
                        : "text-white/50 group-hover:text-white"
                    }`}
                    style={active === link.id ? { textShadow: "0 0 20px rgba(79,255,176,0.5)" } : {}}
                  >
                    {t.nav[link.key] || link.target}
                  </span>
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-400
                    ${active === link.id ? "w-full" : "w-0 group-hover:w-full"}`}
                    style={{ background: "linear-gradient(90deg, rgba(79,255,176,0.6), transparent)" }}
                  />
                </motion.button>
              ))}

              {/* Mobile CTA */}
              <motion.div variants={item} className="flex flex-col gap-3 w-52 mt-6">
                <button
                  onClick={() => handleClick("contact", "Contact")}
                  className="w-full py-3.5 rounded-2xl text-sm font-mono font-bold text-[#0A0A0A] active:scale-95 transition-all cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4FFFB0 0%, #34d399 100%)",
                    boxShadow: "0 0 30px rgba(79,255,176,0.3), 0 0 60px rgba(79,255,176,0.1)",
                  }}
                >
                  Contact Me
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
