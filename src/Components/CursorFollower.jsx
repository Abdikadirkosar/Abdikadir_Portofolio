import { useEffect, useRef } from "react";

const interactiveSelector =
  "a, button, input, textarea, select, [role='button'], [tabindex]:not([tabindex='-1'])";

/**
 * Premium dual-ring cursor follower.
 * - Outer ring: slow trailing ring (glassmorphism + glow)
 * - Inner dot: snappy, solid accent dot
 * - On hover: outer ring expands + rotates; inner dot disappears
 * - On click: outer ring shrinks quickly then bounces back
 */
const CursorFollower = () => {
  const outerRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!canHover.matches || reduceMotion.matches) return undefined;

    const outer = outerRef.current;
    const dot = dotRef.current;
    if (!outer || !dot) return undefined;

    let frameId = 0;
    let visible = false;
    let isActive = false;
    let isDown = false;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Outer ring: slow trail
    let outerX = mouseX;
    let outerY = mouseY;

    // Inner dot: snappy follow
    let dotX = mouseX;
    let dotY = mouseY;

    const render = () => {
      // Outer ring trails at 10% per frame
      outerX += (mouseX - outerX) * 0.1;
      outerY += (mouseY - outerY) * 0.1;

      // Dot follows snappily at 30%
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      // Scale based on state
      const outerScale = isDown ? 0.7 : isActive ? 1.6 : 1;
      const dotScale = isActive ? 0 : isDown ? 0.5 : 1;

      outer.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%) scale(${outerScale})`;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      frameId = requestAnimationFrame(render);
    };

    const setVisible = (v) => {
      visible = v;
      outer.style.opacity = v ? "1" : "0";
      dot.style.opacity = v ? "1" : "0";
    };

    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isActive = Boolean(e.target.closest(interactiveSelector));
      outer.classList.toggle("cursor-outer--active", isActive);
      if (!visible) setVisible(true);
    };

    const handlePointerLeave = () => setVisible(false);
    const handlePointerDown = () => { isDown = true; };
    const handlePointerUp = () => { isDown = false; };

    frameId = requestAnimationFrame(render);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <span
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: 0,
          willChange: "transform, opacity",
          width: 40,
          height: 40,
          borderRadius: "999px",
          border: "1px solid rgba(79,255,176,0.35)",
          background: "radial-gradient(circle, rgba(79,255,176,0.04), transparent 70%)",
          boxShadow: "0 0 16px rgba(79,255,176,0.1), inset 0 0 10px rgba(79,255,176,0.03)",
          mixBlendMode: "screen",
          transition: "width 200ms ease, height 200ms ease, border-color 200ms ease, opacity 200ms ease",
        }}
      />
      {/* Inner dot */}
      <span
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          pointerEvents: "none",
          opacity: 0,
          willChange: "transform, opacity",
          width: 6,
          height: 6,
          borderRadius: "999px",
          background: "rgba(79,255,176,0.9)",
          boxShadow: "0 0 8px rgba(79,255,176,0.8)",
          transition: "transform 80ms ease, opacity 200ms ease",
        }}
      />
    </>
  );
};

export default CursorFollower;
