import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Scramble text hook ────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function useScramble(text, trigger, speed = 28) {
  const [displayed, setDisplayed] = useState(text);
  const rafRef = useRef(null);
  const iterRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    iterRef.current = 0;
    cancelAnimationFrame(rafRef.current);

    let frame = 0;
    const step = () => {
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iterRef.current) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (frame % 2 === 0) iterRef.current += 1;
      frame++;
      if (iterRef.current <= text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayed(text);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, text]);

  return displayed;
}

// ── Loading progress hook ─────────────────────────────────────────────────────
function useProgress(active, duration = 2200) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, duration]);

  return progress;
}

// ── Grid lines background ─────────────────────────────────────────────────────
function GridLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(79,255,176,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79,255,176,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// ── Rotating rings ────────────────────────────────────────────────────────────
function RotatingRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full border border-[#4FFFB0]/10"
        style={{ width: 420, height: 420 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {/* dot on ring */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4FFFB0]/60"
          style={{ boxShadow: "0 0 8px rgba(79,255,176,0.8)" }}
        />
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full border border-[#4FFFB0]/06"
        style={{ width: 300, height: 300 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4FFFB0]/50"
          style={{ boxShadow: "0 0 6px rgba(79,255,176,0.6)" }}
        />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full border border-[#4FFFB0]/05"
        style={{ width: 180, height: 180 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Central glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          background: "radial-gradient(circle, rgba(79,255,176,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Intro({ onFinish }) {
  const [phase, setPhase] = useState(0);
  // phase 0 → loading, phase 1 → name reveal, phase 2 → done
  const [scrambleReady, setScrambleReady] = useState(false);
  const progress = useProgress(phase === 0, 1800);
  const scrambled = useScramble("ABDIKADIR KOSAR", scrambleReady, 28);

  useEffect(() => {
    if (phase === 0 && progress >= 100) {
      const t = setTimeout(() => setPhase(1), 200);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      const t1 = setTimeout(() => setScrambleReady(true), 100);
      const t2 = setTimeout(() => onFinish?.(), 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase, progress, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] overflow-hidden"
      style={{ background: "#020307" }}
      initial={{ opacity: 1 }}
      exit={{
        clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      <GridLines />
      <RotatingRings />

      {/* Ambient glow blob */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 560,
          height: 560,
          background: "radial-gradient(circle, rgba(79,255,176,0.1) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <div className="relative flex flex-col h-full items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">

          {/* ── Phase 0: Loading ───────────────────────────────────── */}
          {phase === 0 && (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
            >
              {/* Status tag */}
              <motion.p
                className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#4FFFB0]/50"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Initializing System
              </motion.p>

              {/* Big percentage */}
              <motion.div
                className="font-mono text-[72px] font-black text-[#4FFFB0] leading-none tabular-nums select-none"
                style={{ textShadow: "0 0 40px rgba(79,255,176,0.5), 0 0 80px rgba(79,255,176,0.2)" }}
              >
                {Math.round(progress)}
                <span className="text-[40px] text-[#4FFFB0]/60">%</span>
              </motion.div>

              {/* Progress bar */}
              <div className="w-[240px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #4FFFB0, #7abfab)",
                    boxShadow: "0 0 12px rgba(79,255,176,0.6)",
                  }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-16"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                  animate={{ x: [-64, 280] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Loading dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-[#4FFFB0]/60"
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Phase 1: Name reveal ───────────────────────────────── */}
          {phase === 1 && (
            <motion.div
              key="name"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top rule */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-28 origin-center"
                style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.7), transparent)" }}
              />

              {/* Scrambled name */}
              <h1
                className="select-none font-mono font-black tracking-[0.12em] text-[#4FFFB0]"
                style={{
                  fontSize: "clamp(1.8rem, 6vw, 4.5rem)",
                  textShadow: "0 0 40px rgba(79,255,176,0.6), 0 0 80px rgba(79,255,176,0.25)",
                }}
              >
                {scrambled}
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="select-none uppercase text-white/30 font-mono"
                style={{ fontSize: "0.6rem", letterSpacing: "0.5em" }}
              >
                AI Engineer · Full Stack Developer
              </motion.p>

              {/* Bottom rule */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-28 origin-center"
                style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.7), transparent)" }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Corner decorators */}
      {["top-5 left-5", "top-5 right-5", "bottom-5 left-5", "bottom-5 right-5"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#4FFFB0]/20" />
          <div className="absolute top-0 left-0 w-[1px] h-full bg-[#4FFFB0]/20" />
        </div>
      ))}
      <div className="absolute top-5 right-5 w-5 h-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-[#4FFFB0]/20" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-[#4FFFB0]/20" />
      </div>
      <div className="absolute bottom-5 right-5 w-5 h-5 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-[#4FFFB0]/20" />
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-[#4FFFB0]/20" />
      </div>
    </motion.div>
  );
}
