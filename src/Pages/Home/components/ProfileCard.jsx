import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuGithub, LuMail } from "react-icons/lu";
import { FaLinkedinIn, FaReact, FaPython } from "react-icons/fa";
import { SiNextdotjs, SiSupabase, SiTensorflow } from "react-icons/si";

// ── Animated stat counter ────────────────────────────────────────────────────
import useCountUp from "../../../hooks/useCountUp";

function StatCounter({ value, label }) {
  const target = parseInt(value, 10) || 0;
  const count = useCountUp(target, 1600, true);

  return (
    <div className="flex flex-col items-center">
      <span className="text-white font-black text-lg leading-none stat-glow">
        {count}
        <span className="text-[#4FFFB0]">+</span>
      </span>
      <span className="text-white/40 text-[10px] mt-0.5 font-mono uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ── Floating Tech Badge ───────────────────────────────────────────────────────
function FloatingBadge({ icon: Icon, className, animClass, label, color }) {
  return (
    <div
      className={`absolute z-30 pointer-events-auto group/badge select-none ${className} ${animClass}`}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c0c12]/90 border border-white/[0.08] backdrop-blur-md shadow-lg transition-all duration-300 hover:border-[#4FFFB0]/40 hover:-translate-y-1 hover:scale-110 cursor-pointer"
        style={{
          boxShadow: `0 4px 12px rgba(0,0,0,0.5), 0 0 10px ${color}10`,
        }}
      >
        <Icon size={13} style={{ color }} />
        <span className="text-white/80 text-[10px] font-mono font-medium tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function ProfileCard({ prof }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const glareRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation (-15 to 15 degrees)
      const rx = (y / rect.height - 0.5) * -22;
      const ry = (x / rect.width - 0.5) * 22;

      // Parallax shifts
      if (innerRef.current) {
        innerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      }

      // Shift the portrait image independently (Foreground Parallax layer)
      if (imageRef.current) {
        const moveX = (x / rect.width - 0.5) * 15;
        const moveY = (y / rect.height - 0.5) * 15;
        imageRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 20px) scale(1.08)`;
      }

      // Glare overlay positioning
      if (glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16) 0%, transparent 60%)`;
        glareRef.current.style.opacity = "1";
      }
    };

    const onLeave = () => {
      setIsHovered(false);
      if (innerRef.current) {
        innerRef.current.style.transform = "rotateX(0) rotateY(0) scale(1)";
      }
      if (imageRef.current) {
        imageRef.current.style.transform = "translate3d(0, 0, 0) scale(1.04)";
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    };

    const onEnter = () => {
      setIsHovered(true);
      // Trigger soft sound tone via custom event
      window.dispatchEvent(new CustomEvent("sectionEnter", { detail: { id: "About" } }));
    };

    outer.addEventListener("mousemove", onMove);
    outer.addEventListener("mouseleave", onLeave);
    outer.addEventListener("mouseenter", onEnter);

    return () => {
      outer.removeEventListener("mousemove", onMove);
      outer.removeEventListener("mouseleave", onLeave);
      outer.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <motion.div
      ref={outerRef}
      className="relative h-fit flex flex-col items-center gap-5 select-none"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* ── Floating Tech Badges (Orbits) ────────────────────────────────────── */}
      <FloatingBadge
        icon={FaReact}
        label="React"
        color="#61dafb"
        className="top-12 -left-12"
        animClass="animate-float-orbit-1"
      />
      <FloatingBadge
        icon={SiNextdotjs}
        label="Next.js"
        color="#ffffff"
        className="top-36 -right-10"
        animClass="animate-float-orbit-2"
      />
      <FloatingBadge
        icon={FaPython}
        label="Python"
        color="#ffd43b"
        className="bottom-44 -left-14"
        animClass="animate-float-orbit-3"
      />
      <FloatingBadge
        icon={SiSupabase}
        label="Supabase"
        color="#3ecf8e"
        className="bottom-24 -right-12"
        animClass="animate-float-orbit-1"
      />

      {/* ── Main Card Frame ─────────────────────────────────────────────────── */}
      <div
        ref={innerRef}
        className="relative lg:w-[340px] lg:h-[445px] w-[280px] h-[380px] rounded-[24px] overflow-hidden border border-white/[0.08] bg-[#0A0A0E] transition-all duration-[300ms] ease-out group"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Light Glare */}
        <div
          ref={glareRef}
          className="absolute inset-0 z-20 rounded-[24px] pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* SVG Border Tracer Glow Path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          viewBox="0 0 340 445"
          fill="none"
          preserveAspectRatio="none"
        >
          <rect
            x="1.5"
            y="1.5"
            width="337"
            height="442"
            rx="22.5"
            stroke="#4FFFB0"
            strokeWidth="3"
            className="svg-border-trace"
            style={{
              filter: "drop-shadow(0 0 6px rgba(79,255,176,0.6))",
              animation: isHovered ? "border-trace 2.2s linear infinite" : "none",
            }}
          />
        </svg>

        {/* Portrait Media Container */}
        <div
          ref={imageContainerRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            ref={imageRef}
            src={prof?.avatar || "/Photos/image copy 2.png"}
            className="absolute inset-0 w-full h-full object-cover origin-center transition-all duration-[150ms] ease-out"
            style={{ transform: "scale(1.04)", willChange: "transform" }}
            alt={prof?.name || "Abdikadir Kosar"}
            loading="eager"
            onError={(e) => { e.currentTarget.src = "/Photos/image copy 2.png"; }}
          />
        </div>

        {/* Dynamic Black Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/35 to-transparent" />

        {/* Availability Badge */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-[#4FFFB0]/20 rounded-full px-3 py-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[#22C55E] text-[10px] font-mono tracking-wider font-semibold">
            Active
          </span>
        </div>

        {/* Card Content Footer Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <p className="text-white/40 text-[10px] tracking-[2.5px] uppercase mb-1 font-mono">
            {prof?.title?.split("&")?.[0]?.trim() || "Technical Architect"}
          </p>
          <h2 className="text-white text-xl font-bold mb-0.5 leading-tight">
            {prof?.name || "Abdikadir Kosar"}
          </h2>
          <p className="text-[#4FFFB0] text-xs mb-4 font-light tracking-wide">
            {prof?.title?.split("&")?.[1]?.trim() || "AI Engineer · Full Stack Dev"}
          </p>

          {/* Action Row */}
          <div className="flex justify-between items-center gap-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl p-3">
            <div className="flex gap-3">
              <a
                href={prof?.github || "https://github.com/abdikadirkosar"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <LuGithub size={15} />
              </a>
              <a
                href={prof?.linkedin || "https://linkedin.com/in/abdikadirkosar"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[#4FFFB0] transition-colors"
              >
                <FaLinkedinIn size={15} />
              </a>
              <a
                href={prof?.email ? `mailto:${prof.email}` : "mailto:abdikadirkosara@gmail.com"}
                className="text-white/50 hover:text-white transition-colors"
              >
                <LuMail size={15} />
              </a>
            </div>
            <a
              href="#Contact"
              className="bg-[#4FFFB0]/10 hover:bg-[#4FFFB0]/25 border border-[#4FFFB0]/25 text-[#4FFFB0] text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 tracking-wide"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Outer Glow */}
        <div
          className="absolute inset-0 z-0 rounded-[24px] pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 40px rgba(79,255,176,0.03), 0 0 50px rgba(0,0,0,0.8)",
          }}
        />
      </div>

      {/* Stats row below card */}
      <motion.div
        className="flex gap-6 px-6 py-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm shadow-xl"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <StatCounter value="20" label="Yrs Exp" />
        <div className="w-px bg-white/[0.06]" />
        <StatCounter value="80" label="Projects" />
        <div className="w-px bg-white/[0.06]" />
        <StatCounter value="30" label="Clients" />
      </motion.div>
    </motion.div>
  );
}
