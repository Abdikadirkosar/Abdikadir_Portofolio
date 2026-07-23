import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Cursor particle ──────────────────────────────────────────────────────── */
const Particle = ({ x, y, id }) => (
  <motion.div
    key={id}
    className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
    style={{
      width: "6px",
      height: "6px",
      background: "rgba(79,255,176,0.7)",
      x,
      y,
      translateX: "-50%",
      translateY: "-50%",
    }}
    initial={{ opacity: 0.8, scale: 1 }}
    animate={{ opacity: 0, scale: 0 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
  />
);

/* ─── Main Cursor Component ────────────────────────────────────────────────── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef    = useRef(null);
  const pos       = useRef({ x: -100, y: -100 });
  const dot       = useRef({ x: -100, y: -100 });
  const [particles, setParticles] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const particleIdRef = useRef(0);
  const lastParticlePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Hide on touch devices
  const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (isTouchDevice) return;

    // Hide native cursor sitewide
    document.body.style.cursor = "none";

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Spawn particle only if moved enough
      const dx = e.clientX - lastParticlePos.current.x;
      const dy = e.clientY - lastParticlePos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 12) {
        lastParticlePos.current = { x: e.clientX, y: e.clientY };
        const id = particleIdRef.current++;
        setParticles((prev) => [
          ...prev.slice(-16),
          { x: e.clientX, y: e.clientY, id },
        ]);
      }

      // Detect interactive element under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest("a,button,input,textarea,select,[role='button']");
      setIsHovering(!!interactive);
    };

    const onDown  = () => setIsClicking(true);
    const onUp    = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    // Smooth cursor raf loop
    const loop = () => {
      dot.current.x += (pos.current.x - dot.current.x) * 0.12;
      dot.current.y += (pos.current.y - dot.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%,-50%)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "";
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full will-change-transform"
        style={{
          width:  isHovering ? "44px" : "28px",
          height: isHovering ? "44px" : "28px",
          border: `1.5px solid ${isHovering ? "rgba(79,255,176,0.9)" : "rgba(79,255,176,0.45)"}`,
          background: isHovering
            ? "rgba(79,255,176,0.07)"
            : "rgba(79,255,176,0.03)",
          boxShadow: isHovering
            ? "0 0 22px rgba(79,255,176,0.3), inset 0 0 12px rgba(79,255,176,0.08)"
            : "0 0 12px rgba(79,255,176,0.12)",
          transition: "width 0.22s ease, height 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease",
          transform: `scale(${isClicking ? 0.78 : 1})`,
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full will-change-transform"
        style={{
          width:  isClicking ? "10px" : "5px",
          height: isClicking ? "10px" : "5px",
          background: "#4FFFB0",
          boxShadow: "0 0 10px rgba(79,255,176,0.8)",
          transition: "width 0.12s ease, height 0.12s ease",
        }}
      />

      {/* Particle trail */}
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} id={p.id} />
        ))}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
