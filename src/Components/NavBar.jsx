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
import { Sun, Moon, Languages, ChevronDown, Sparkles, Palette } from "lucide-react";

// ── Nav sections ──────────────────────────────────────────────────────────────
const navKeys = [
  { id: "home",         target: "Home",         key: "home" },
  { id: "about",        target: "About",         key: "about" },
  { id: "services",     target: "Services",      key: "services" },
  { id: "skills",       target: "Skills",        key: "skills" },
  { id: "projects",     target: "Projects",      key: "projects" },
  { id: "experience",   target: "Experience",    key: "experience" },
  { id: "education",    target: "Education",     key: "education" },
  { id: "certificates", target: "Certificates",  key: "certificates" },
  { id: "contact",      target: "Contact",       key: "contact" },
];

// Only show these in the desktop top bar (keeps it uncluttered)
const primaryNav = ["home", "about", "skills", "projects", "experience"];

// Mobile menu animation
const mobileContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const mobileItem = {
  hidden:  { opacity: 0, y: 14 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

// ── Scramble text on hover ─────────────────────────────────────────────────────
const ScrambledLink = ({ label, active }) => {
  const [display, setDisplay] = useState(label);
  const timer = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";

  const scramble = () => {
    let i = 0;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setDisplay(
        label.split("").map((ch, idx) => {
          if (ch === " ") return " ";
          if (idx < i) return label[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      i += 1 / 3;
      if (i >= label.length) { clearInterval(timer.current); setDisplay(label); }
    }, 28);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <span
      onMouseEnter={scramble}
      onMouseLeave={() => setDisplay(label)}
      className={`text-[13px] font-mono font-semibold tracking-wide transition-colors duration-200 cursor-pointer select-none ${
        active
          ? "text-[#4FFFB0]"
          : "text-white/55 hover:text-white"
      }`}
    >
      {display}
    </span>
  );
};

// ── Tools dropdown ─────────────────────────────────────────────────────────────
const ToolsDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-mono font-semibold border transition-all duration-200 cursor-pointer ${
          open
            ? "bg-[#4FFFB0]/12 border-[#4FFFB0]/40 text-[#4FFFB0]"
            : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.07]"
        }`}
      >
        <Sparkles size={12} className={open ? "text-[#4FFFB0]" : "text-[#4FFFB0]/70"} />
        Tools
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-1 p-2 rounded-2xl border border-white/[0.1] min-w-[190px]"
            style={{
              background: "rgba(10,10,20,0.92)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,255,176,0.06)",
            }}
          >
            {/* Label */}
            <span className="px-3 py-1 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
              Quick Tools
            </span>

            {/* Row: Accent Color Picker */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors group cursor-pointer">
              <Palette size={14} className="text-[#4FFFB0]/70 group-hover:text-[#4FFFB0] shrink-0" />
              <span className="text-[12px] text-white/60 group-hover:text-white/90 font-mono">Accent Color</span>
              <div className="ml-auto">
                <AccentColorPicker />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mx-2" />

            {/* Row: Quote Estimator */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors group cursor-pointer">
              <span className="text-[14px] shrink-0">📊</span>
              <span className="text-[12px] text-white/60 group-hover:text-white/90 font-mono">Project Quote</span>
              <div className="ml-auto">
                <ProjectCostEstimator />
              </div>
            </div>

            {/* Row: vCard QR */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors group cursor-pointer">
              <span className="text-[14px] shrink-0">📇</span>
              <span className="text-[12px] text-white/60 group-hover:text-white/90 font-mono">vCard / QR</span>
              <div className="ml-auto">
                <VCardModal />
              </div>
            </div>

            {/* Row: Book Discovery Call */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors group cursor-pointer">
              <span className="text-[14px] shrink-0">📞</span>
              <span className="text-[12px] text-white/60 group-hover:text-white/90 font-mono">Book a Call</span>
              <div className="ml-auto">
                <BookCallModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main NavBar ────────────────────────────────────────────────────────────────
const NavBar = () => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active,  setActive]  = useState("home");
  const trackRef  = useRef(null);
  const reported  = useRef(new Set());
  const navigate  = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();

  // Track initial visit
  useEffect(() => {
    trackPageView("home");
    reported.current.add("home");
  }, []);

  // Secret admin shortcut: Ctrl + Shift + A
  useEffect(() => {
    const fn = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") { e.preventDefault(); navigate("/admin"); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [navigate]);

  // Active section observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.toLowerCase();
            setActive(id);
            if (trackRef.current) clearTimeout(trackRef.current);
            trackRef.current = setTimeout(() => {
              if (!reported.current.has(id)) { trackPageView(id); reported.current.add(id); }
            }, 1000);
          }
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return () => { obs.disconnect(); if (trackRef.current) clearTimeout(trackRef.current); };
  }, []);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Body lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Smooth scroll to section
  const goto = (id, target) => {
    const el = document.getElementById(target);
    if (!el) return;
    setActive(id);
    setIsOpen(false);
    document.body.style.overflow = "";
    if (!reported.current.has(id)) { trackPageView(id); reported.current.add(id); }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }))
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP / TABLET NAVBAR
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[64px] transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
            : "border-b border-transparent"
        }`}
        style={{ backdropFilter: "blur(20px)", background: "rgba(8,8,14,0.88)" }}
      >
        <div className="flex h-full items-center justify-between px-5 xl:px-[10%] lg:px-8 gap-4">

          {/* ── LOGO ───────────────────────────────────────────────── */}
          <button
            onClick={() => goto("home", "Home")}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="Abdikadir"
                className="h-8 w-8 rounded-full object-cover border border-white/10 group-hover:border-[#4FFFB0]/40 transition-all duration-300"
              />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 14px rgba(79,255,176,0.4)" }}
              />
            </div>
            <span className="font-mono text-[15px] font-bold text-white group-hover:text-[#4FFFB0] transition-colors duration-200">
              Abdikadir<span className="text-[#4FFFB0]" style={{ textShadow: "0 0 10px rgba(79,255,176,0.6)" }}>.</span>
            </span>
          </button>

          {/* ── CENTER NAV LINKS (desktop only) ────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navKeys
              .filter((l) => primaryNav.includes(l.id))
              .map((link) => (
                <button
                  key={link.id}
                  onClick={() => goto(link.id, link.target)}
                  className="group relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  <ScrambledLink label={t.nav?.[link.key] || link.target} active={active === link.id} />
                  {/* Active underline */}
                  <span
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      active === link.id ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-60"
                    }`}
                    style={{
                      background: "linear-gradient(90deg,#4FFFB0,#38bdf8)",
                      boxShadow: active === link.id ? "0 0 6px rgba(79,255,176,0.7)" : "none",
                    }}
                  />
                </button>
              ))}

            {/* "More" dropdown for remaining sections */}
            <MoreLinksDropdown navKeys={navKeys} primaryNav={primaryNav} active={active} goto={goto} t={t} />
          </div>

          {/* ── RIGHT CONTROLS ──────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">

            {/* Search / Command Palette */}
            <CommandPalette />

            {/* Tools dropdown (Quote, vCard, BookCall, AccentColor) */}
            <ToolsDropdown />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-mono font-semibold border border-white/[0.1] bg-white/[0.04] text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer"
              title={lang === "EN" ? "Switch to Somali" : "Switch to English"}
            >
              <Languages size={12} className="text-[#4FFFB0]/80" />
              <span>{lang === "EN" ? "EN" : "SO"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-white/60 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/8 transition-all duration-200 cursor-pointer"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark
                ? <Sun size={14} className="text-amber-300" />
                : <Moon size={14} className="text-indigo-400" />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/[0.1]" />

            {/* Contact CTA */}
            <button
              onClick={() => goto("contact", "Contact")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-mono font-bold text-[#0A0A0A] bg-[#4FFFB0] hover:bg-[#6FFFBF] active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(79,255,176,0.25)]"
            >
              Contact
            </button>
          </div>

          {/* ── MOBILE HAMBURGER ────────────────────────────────────── */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-xl border border-white/10 hover:border-[#4FFFB0]/30 transition-all duration-300"
          >
            <span className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE FULLSCREEN MENU
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(135deg,rgba(4,4,10,0.97) 0%,rgba(6,3,14,0.97) 50%,rgba(3,7,12,0.97) 100%)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Ambient glows */}
            <div className="pointer-events-none absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle,rgba(79,255,176,0.06) 0%,transparent 70%)", filter: "blur(50px)" }} />
            <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)", filter: "blur(50px)" }} />
            {/* Top line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(79,255,176,0.35),transparent)" }} />

            <motion.div
              className="flex flex-col items-center gap-6 relative z-10 w-full px-8"
              variants={mobileContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.span variants={mobileItem} className="text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
                Navigation
              </motion.span>

              {navKeys.filter((l) => l.id !== "contact").map((link) => (
                <motion.button
                  key={link.id}
                  variants={mobileItem}
                  onClick={() => goto(link.id, link.target)}
                  className="group relative py-1"
                >
                  <span
                    className={`text-xl uppercase tracking-[0.2em] font-light transition-all duration-300 ${
                      active === link.id ? "text-[#4FFFB0]" : "text-white/45 group-hover:text-white/90"
                    }`}
                    style={active === link.id ? { textShadow: "0 0 20px rgba(79,255,176,0.5)" } : {}}
                  >
                    {t.nav?.[link.key] || link.target}
                  </span>
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                      active === link.id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{ background: "linear-gradient(90deg,rgba(79,255,176,0.6),transparent)" }}
                  />
                </motion.button>
              ))}

              {/* Mobile bottom actions */}
              <motion.div variants={mobileItem} className="flex flex-col gap-3 w-60 mt-4">
                <button
                  onClick={() => goto("contact", "Contact")}
                  className="w-full py-3.5 rounded-2xl text-sm font-mono font-bold text-[#0A0A0A] active:scale-95 transition-all cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg,#4FFFB0 0%,#34d399 100%)",
                    boxShadow: "0 0 30px rgba(79,255,176,0.3)",
                  }}
                >
                  Contact Me
                </button>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all"
                  >
                    {isDark ? <Sun size={13} className="text-amber-300" /> : <Moon size={13} className="text-indigo-400" />}
                    {isDark ? "Light" : "Dark"}
                  </button>
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all"
                  >
                    <Languages size={13} className="text-[#4FFFB0]/80" />
                    {lang === "EN" ? "EN 🇬🇧" : "SO 🇸🇴"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── "More" dropdown for secondary nav links ────────────────────────────────────
const MoreLinksDropdown = ({ navKeys, primaryNav, active, goto, t }) => {
  const secondaryLinks = navKeys.filter(
    (l) => !primaryNav.includes(l.id) && l.id !== "contact"
  );
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const anySecondaryActive = secondaryLinks.some((l) => l.id === active);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-mono font-semibold transition-all duration-200 hover:bg-white/[0.04] cursor-pointer ${
          anySecondaryActive ? "text-[#4FFFB0]" : "text-white/55 hover:text-white"
        }`}
      >
        More
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 flex flex-col p-1.5 rounded-2xl border border-white/[0.1] min-w-[160px]"
            style={{
              background: "rgba(10,10,20,0.92)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(79,255,176,0.06)",
            }}
          >
            {secondaryLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { goto(link.id, link.target); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-mono font-semibold transition-all duration-150 text-left ${
                  active === link.id
                    ? "text-[#4FFFB0] bg-[#4FFFB0]/08"
                    : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {active === link.id && (
                  <span className="w-1 h-1 rounded-full bg-[#4FFFB0] shrink-0" style={{ boxShadow: "0 0 4px rgba(79,255,176,0.8)" }} />
                )}
                {t.nav?.[link.key] || link.target}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
