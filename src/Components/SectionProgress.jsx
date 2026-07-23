import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "Home",         label: "Home" },
  { id: "About",        label: "About" },
  { id: "Services",     label: "Services" },
  { id: "Skills",       label: "Skills" },
  { id: "Projects",     label: "Projects" },
  { id: "Experience",   label: "Experience" },
  { id: "Education",    label: "Education" },
  { id: "Certificates", label: "Certificates" },
  { id: "Contact",      label: "Contact" },
];

const SectionProgress = () => {
  const [active, setActive] = useState("Home");
  const [visible, setVisible] = useState(false);
  const observersRef = useRef([]);

  useEffect(() => {
    // Show sidebar only after scrolling a bit
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const opts = { rootMargin: "-40% 0px -40% 0px", threshold: 0 };

    const cb = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    };

    const io = new IntersectionObserver(cb, opts);
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    observersRef.current = [io];

    return () => observersRef.current.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 pointer-events-none"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="pointer-events-auto flex items-center gap-2.5 group cursor-pointer"
            title={label}
          >
            {/* Label — appears on hover */}
            <span
              className="text-[9px] font-mono uppercase tracking-[0.18em] transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{ color: isActive ? "#4FFFB0" : "rgba(255,255,255,0.3)" }}
            >
              {label}
            </span>

            {/* Dot */}
            <div
              className="rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                width:  isActive ? "10px" : "5px",
                height: isActive ? "10px" : "5px",
                background: isActive ? "#4FFFB0" : "rgba(255,255,255,0.2)",
                boxShadow: isActive ? "0 0 10px rgba(79,255,176,0.6)" : "none",
              }}
            />
          </button>
        );
      })}

      {/* Connector line */}
      <div
        className="absolute right-[4px] top-0 bottom-0 w-px -z-10"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(79,255,176,0.08), transparent)" }}
      />
    </motion.div>
  );
};

export default SectionProgress;
