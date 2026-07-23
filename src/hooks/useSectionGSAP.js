/**
 * useSectionGSAP.js
 * ─────────────────
 * Shared custom hook that wires up GSAP ScrollTrigger animations
 * for any portfolio section that follows the standard pattern:
 *
 *   - .gsap-tag     → slide in from left (section label)
 *   - .gsap-title   → word-by-word rise from clip
 *   - .gsap-desc    → fade up (subtitle)
 *   - .gsap-grid    → staggered fade-up of direct children
 *
 * Usage:
 *   const sectionRef = useSectionGSAP();
 *   <section ref={sectionRef}>…</section>
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSectionGSAP(options = {}) {
  const {
    tagClass    = ".gsap-tag",
    titleClass  = ".gsap-title",
    descClass   = ".gsap-desc",
    gridClass   = ".gsap-grid",
    stagger     = 0.09,
    start       = "top 86%",
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Tag — slide in from left
      const tags = el.querySelectorAll(tagClass);
      if (tags.length) {
        gsap.fromTo(tags,
          { opacity: 0, x: -24 },
          {
            opacity: 1, x: 0, duration: 0.55, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      }

      // Title words — clip-reveal upward
      const titleWords = el.querySelectorAll(`${titleClass} .gsap-word`);
      if (titleWords.length) {
        gsap.fromTo(titleWords,
          { y: "115%", opacity: 0, filter: "blur(6px)" },
          {
            y: "0%", opacity: 1, filter: "blur(0px)",
            duration: 0.72, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      } else {
        // Fallback: animate the title element itself
        const titles = el.querySelectorAll(titleClass);
        if (titles.length) {
          gsap.fromTo(titles,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out",
              scrollTrigger: { trigger: el, start, once: true },
            }
          );
        }
      }

      // Desc — fade up
      const descs = el.querySelectorAll(descClass);
      if (descs.length) {
        gsap.fromTo(descs,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: 0.3, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      }

      // Grid children — staggered fade-scale-up
      const grids = el.querySelectorAll(gridClass);
      grids.forEach((grid) => {
        const items = Array.from(grid.children);
        if (!items.length) return;
        gsap.fromTo(items,
          { opacity: 0, y: 28, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger, ease: "power3.out",
            scrollTrigger: { trigger: grid, start: "top 88%", once: true },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [tagClass, titleClass, descClass, gridClass, stagger, start]);

  return ref;
}
