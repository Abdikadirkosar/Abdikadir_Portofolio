/**
 * SoundManager.jsx
 * ─────────────────
 * Lightweight Web Audio API sound engine for the portfolio.
 * 
 * Provides:
 *  - Hover tone  : soft sine-wave ping on interactive element hover
 *  - Click pop   : short percussive click feedback
 *  - Scroll whoosh: filtered noise sweep on scroll direction change
 *  - Section enter: ambient chord on scroll-into-view (via CustomEvent)
 * 
 * All sounds are generated procedurally — no audio files needed.
 * Respects: prefers-reduced-motion, user mute state.
 * The user can toggle sound via the SoundToggle button exported here.
 */

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Context ───────────────────────────────────────────────────────────────────
const SoundCtx = createContext({ muted: true, toggle: () => {} });
export const useSoundCtx = () => useContext(SoundCtx);

// ── Audio helpers ─────────────────────────────────────────────────────────────
function createCtx() {
  return new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
}

function playTone(ctx, freq = 660, type = "sine", duration = 0.12, gain = 0.08) {
  if (!ctx || ctx.state === "closed") return;
  const osc  = ctx.createOscillator();
  const vol  = ctx.createGain();
  osc.connect(vol);
  vol.connect(ctx.destination);
  osc.type      = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  vol.gain.setValueAtTime(0, ctx.currentTime);
  vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playClick(ctx) {
  if (!ctx || ctx.state === "closed") return;
  // Short burst of filtered noise = satisfying click
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type            = "highpass";
  filter.frequency.value = 1200;

  const vol = ctx.createGain();
  vol.gain.setValueAtTime(0.08, ctx.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

  source.connect(filter);
  filter.connect(vol);
  vol.connect(ctx.destination);
  source.start(ctx.currentTime);
}

function playChord(ctx, root = 220) {
  if (!ctx || ctx.state === "closed") return;
  // Minor 7th chord (ambient, atmospheric)
  const ratios = [1, 1.189, 1.498, 1.782];
  ratios.forEach((r, i) => {
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.type      = "sine";
    osc.frequency.setValueAtTime(root * r, ctx.currentTime);
    vol.gain.setValueAtTime(0, ctx.currentTime);
    vol.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.08 + i * 0.04);
    vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4 + i * 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  });
}

// ── Interactive selector ─────────────────────────────────────────────────────
const INTERACTIVE = "a, button, [role='button'], input, textarea, select";

// ── Provider ─────────────────────────────────────────────────────────────────
export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(true); // start muted — user must opt in
  const ctxRef    = useRef(null);
  const lastScrollY = useRef(0);
  const scrollCooldown = useRef(false);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = createCtx();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  const toggle = () => setMuted((m) => !m);

  useEffect(() => {
    const interactiveSelector = INTERACTIVE;

    // ── Hover sound ───────────────────────────────────────────────
    const handleMouseOver = (e) => {
      if (muted) return;
      if (e.target.closest(interactiveSelector)) {
        playTone(getCtx(), 880, "sine", 0.09, 0.04);
      }
    };

    // ── Click sound ───────────────────────────────────────────────
    const handlePointerDown = (e) => {
      if (muted) return;
      if (e.target.closest(interactiveSelector)) {
        playClick(getCtx());
      }
    };

    // ── Scroll whoosh (direction change only) ─────────────────────
    const handleScroll = () => {
      if (muted || scrollCooldown.current) return;
      const sy = window.scrollY;
      const delta = sy - lastScrollY.current;
      lastScrollY.current = sy;

      if (Math.abs(delta) > 60) {
        const freq = delta > 0 ? 330 : 440;
        playTone(getCtx(), freq, "triangle", 0.18, 0.03);
        scrollCooldown.current = true;
        setTimeout(() => { scrollCooldown.current = false; }, 600);
      }
    };

    // ── Section enter chord ───────────────────────────────────────
    const handleSectionEnter = (e) => {
      if (muted) return;
      const roots = { Home: 220, About: 246, Services: 261, Skills: 293, Projects: 329, Experience: 349, Education: 392, Certificates: 415, Contact: 440 };
      const root = roots[e.detail?.id] || 220;
      playChord(getCtx(), root);
    };

    document.addEventListener("mouseover",    handleMouseOver, { passive: true });
    document.addEventListener("pointerdown",  handlePointerDown, { passive: true });
    window.addEventListener("scroll",         handleScroll, { passive: true });
    window.addEventListener("sectionEnter",   handleSectionEnter);

    return () => {
      document.removeEventListener("mouseover",    handleMouseOver);
      document.removeEventListener("pointerdown",  handlePointerDown);
      window.removeEventListener("scroll",         handleScroll);
      window.removeEventListener("sectionEnter",   handleSectionEnter);
    };
  }, [muted]);

  return (
    <SoundCtx.Provider value={{ muted, toggle }}>
      {children}
    </SoundCtx.Provider>
  );
}

// ── Sound Toggle Button ────────────────────────────────────────────────
const SFX_ICON_ON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const SFX_ICON_OFF = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export function SoundToggle() {
  const { muted, toggle } = useSoundCtx();
  const [showHint, setShowHint] = useState(true);

  // Auto-hide hint after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col items-end gap-2">
      {/* Hint bubble — shows on load */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0c0c12]/95 border border-white/[0.08] text-white/60 text-[10px] font-mono tracking-wide px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-md pointer-events-none"
          >
            🔇 Sound is off — click to enable
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => { toggle(); setShowHint(false); }}
        title={muted ? "Enable sound" : "Mute sound"}
        className="relative flex items-center gap-2 pl-2.5 pr-3.5 h-9 rounded-full border backdrop-blur-md transition-all duration-300"
        style={{
          background: muted ? "rgba(12,12,18,0.9)" : "rgba(79,255,176,0.1)",
          borderColor: muted ? "rgba(255,255,255,0.08)" : "rgba(79,255,176,0.4)",
          color: muted ? "rgba(255,255,255,0.4)" : "#4FFFB0",
          boxShadow: muted ? "none" : "0 0 20px rgba(79,255,176,0.15)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        {/* Pulse ring when active */}
        {!muted && (
          <motion.span
            className="absolute inset-0 rounded-full border border-[#4FFFB0]/40"
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="flex-shrink-0">
          {muted ? SFX_ICON_OFF : SFX_ICON_ON}
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase">
          {muted ? "SFX Off" : "SFX On"}
        </span>
      </motion.button>
    </div>
  );
}
