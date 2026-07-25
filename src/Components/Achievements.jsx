import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Briefcase, Award, Users, Coffee, Zap } from "lucide-react";

const stats = [
  { icon: Code2,     value: 5000,  suffix: "+", label: "Lines of Code",     accent: "#4FFFB0" },
  { icon: Briefcase, value: 15,    suffix: "+", label: "Projects Shipped",  accent: "#a855f7" },
  { icon: Award,     value: 8,     suffix: "+", label: "Certificates",      accent: "#38bdf8" },
  { icon: Users,     value: 10,    suffix: "+", label: "Happy Clients",     accent: "#fb923c" },
  { icon: Coffee,    value: 1200,  suffix: "+", label: "Cups of Coffee",    accent: "#f472b6" },
  { icon: Zap,       value: 2,     suffix: "+", label: "Years Experience",  accent: "#facc15" },
];

// ── Animated counter hook ────────────────────────────────────────────────────
const useCounter = (target, inView, duration = 1800) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
};

// ── Single stat item ─────────────────────────────────────────────────────────
const StatItem = ({ icon: Icon, value, suffix, label, accent, index, inView }) => {
  const count = useCounter(value, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-white/[0.06] bg-[#0d0d12]/80 overflow-hidden cursor-default hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}10, transparent 65%)` }} />

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>

      {/* Counter */}
      <div className="flex items-end gap-0.5">
        <span className="text-4xl font-black text-white tabular-nums">{count.toLocaleString()}</span>
        <span className="text-2xl font-black mb-1" style={{ color: accent }}>{suffix}</span>
      </div>

      {/* Label */}
      <p className="text-white/40 text-xs font-mono uppercase tracking-widest mt-2 text-center">{label}</p>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500" style={{ background: `linear-gradient(90deg, transparent, ${accent}70, transparent)` }} />
    </motion.div>
  );
};

// ── Main Achievements Section ────────────────────────────────────────────────
const Achievements = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="Achievements" ref={ref} className="relative py-20 lg:px-[13%] md:px-8 px-5">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-[#4FFFB0] font-mono text-xs tracking-[0.3em] uppercase mb-3">By The Numbers</p>
        <h2 className="text-4xl font-black text-white">
          Achievements &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FFFB0] to-[#38bdf8]">
            Milestones
          </span>
        </h2>
        <div className="h-px w-20 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#4FFFB0]/50 to-transparent" />
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
};

export default Achievements;
