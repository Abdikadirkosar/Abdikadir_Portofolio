/**
 * GSAPReveal.jsx
 * ──────────────
 * A reusable GSAP ScrollTrigger wrapper component.
 * 
 * Usage:
 *   <GSAPReveal from="bottom">
 *     <h2>Section Title</h2>
 *   </GSAPReveal>
 * 
 * Props:
 *   from      : "bottom" | "left" | "right" | "top" | "fade" (default: "bottom")
 *   delay     : number (seconds, default: 0)
 *   duration  : number (seconds, default: 0.8)
 *   stagger   : number (stagger children if > 0)
 *   className : string (applied to wrapper div)
 *   scrub     : boolean (link animation to scroll position)
 *   once      : boolean (only animate once, default: true)
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fromMap = {
  bottom: { y: 60, opacity: 0, filter: "blur(8px)" },
  top:    { y: -60, opacity: 0, filter: "blur(8px)" },
  left:   { x: -60, opacity: 0, filter: "blur(6px)" },
  right:  { x: 60,  opacity: 0, filter: "blur(6px)" },
  fade:   { opacity: 0 },
  scale:  { scale: 0.88, opacity: 0, filter: "blur(4px)" },
};

const toMap = {
  bottom: { y: 0, opacity: 1, filter: "blur(0px)" },
  top:    { y: 0, opacity: 1, filter: "blur(0px)" },
  left:   { x: 0, opacity: 1, filter: "blur(0px)" },
  right:  { x: 0, opacity: 1, filter: "blur(0px)" },
  fade:   { opacity: 1 },
  scale:  { scale: 1,    opacity: 1, filter: "blur(0px)" },
};

export function GSAPReveal({
  children,
  from      = "bottom",
  delay     = 0,
  duration  = 0.85,
  stagger   = 0,
  className = "",
  scrub     = false,
  once      = true,
  start     = "top 88%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target  = stagger > 0 ? el.children : el;
    const fromVal = { ...fromMap[from] };
    const toVal   = { ...toMap[from], delay, duration, ease: "power3.out" };

    if (stagger > 0) toVal.stagger = stagger;

    gsap.fromTo(target, fromVal, {
      ...toVal,
      scrollTrigger: {
        trigger: el,
        start,
        once,
        scrub: scrub ? 1 : false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [from, delay, duration, stagger, scrub, once, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ── GSAP text split reveal (word-by-word) ─────────────────────────────────────
export function GSAPTextReveal({ text, className = "", delay = 0, tag: Tag = "h2" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(".word");
    if (!words.length) return;

    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      }
    );
  }, [delay]);

  const words = text.split(" ").map((word, i) => (
    <span
      key={i}
      style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
    >
      <span className="word" style={{ display: "inline-block" }}>
        {word}
      </span>
    </span>
  ));

  return (
    <Tag ref={ref} className={className}>
      {words}
    </Tag>
  );
}

// ── GSAP horizontal line expand ────────────────────────────────────────────────
export function GSAPLine({ className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { scaleX: 0, opacity: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        delay,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      }
    );
  }, [delay]);

  return <div ref={ref} className={className} />;
}

// ── GSAP stagger grid ─────────────────────────────────────────────────────────
export function GSAPGrid({ children, className = "", stagger = 0.08, from: fromDir = "bottom" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children);
    const fromVal = { ...fromMap[fromDir] };
    const toVal   = {
      ...toMap[fromDir],
      duration: 0.7,
      ease: "power3.out",
      stagger,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    };

    gsap.fromTo(items, fromVal, toVal);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [fromDir, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
