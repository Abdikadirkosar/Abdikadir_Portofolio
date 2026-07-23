import { Brain, Layers, Gauge, Cpu, Download, ExternalLink } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { safeQuery } from "../lib/supabase";
import ThreeDTilt from "../Components/ThreeDTilt";
import { useLanguage } from "../context/LanguageContext";

// ── Animation variants ────────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Skill highlight cards ─────────────────────────────────────────────────────
const skills = [
  {
    Icon: Brain,
    title: "AI & Machine Learning",
    desc: "Developing intelligent solutions using LLMs, computer vision, and NLP.",
    accent: "#a855f7",
  },
  {
    Icon: Layers,
    title: "Full Stack Development",
    desc: "Designing robust end-to-end architectures with React, Node, and Python.",
    accent: "#3b82f6",
  },
  {
    Icon: Gauge,
    title: "System Performance",
    desc: "Optimizing databases and cloud deployments for speed and availability.",
    accent: "#4FFFB0",
  },
  {
    Icon: Cpu,
    title: "Intelligent UI",
    desc: "Creating beautiful, responsive web applications with interactive AI features.",
    accent: "#ec4899",
  },
];

// ── Timeline data ─────────────────────────────────────────────────────────────
const timeline = [
  {
    year: "2023–Present",
    title: "Senior Computer Science Student",
    org: "New Generation University",
    desc: "Completing senior year and graduating soon. Built multiple core projects including management systems and full-stack applications.",
    color: "#4FFFB0",
  },
  {
    year: "2022–Present",
    title: "Independent Developer",
    org: "Freelance Projects",
    desc: "Building C# systems (School, Hotel, and Gym management tools), full-stack websites, and custom AI integrations.",
    color: "#7abfab",
  },
  {
    year: "2021–2022",
    title: "Software & Coding Enthusiast",
    org: "Independent Study",
    desc: "Mastered programming fundamentals, database design, object-oriented programming in C#, and modern web development basics.",
    color: "#4a9a7a",
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "2+", label: "Years Coding" },
  { value: "10+", label: "Projects Built" },
  { value: "8+", label: "Technologies" },
];

// ── Animated Tilt Card — now deprecated in favour of ThreeDTilt ─────────────
// (kept empty so existing refs compile)

// ── Animated counter ──────────────────────────────────────────────────────────
import useCountUp from "../hooks/useCountUp";

const StatCard = ({ value, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Parse number and suffix (e.g. "15+" -> number=15, suffix="+")
  const match = String(value).match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  const animatedValue = useCountUp(targetNum, 1800, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group hover:border-[#4FFFB0]/40 transition-all duration-300 cursor-default"
      style={{}} 
      whileHover={{
        borderColor: "rgba(79,255,176,0.35)",
        boxShadow: "0 0 25px rgba(79,255,176,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="text-3xl font-mono font-bold text-[#4FFFB0] stat-glow"
      >
        {animatedValue}{suffix}
      </span>
      <span className="text-white/35 text-[9px] uppercase tracking-widest font-mono">{label}</span>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const About = () => {
  const { t } = useLanguage();
  const [dbProfile, setDbProfile] = useState(null);
  const [dbTimeline, setDbTimeline] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: profData } = await safeQuery(sb => sb.from("db_profile").select("*").eq("id", 1).single());
      if (profData) {
        setDbProfile(profData);
      }

      const { data: expData } = await safeQuery(sb => sb.from("db_experience").select("*").order("created_at", { ascending: false }));
      if (expData && expData.length > 0) {
        const colors = ["#4FFFB0", "#7abfab", "#4a9a7a", "#a855f7", "#3b82f6"];
        const mapped = expData.map((item, idx) => ({
          year: `${item.start_date}–${item.end_date || "Present"}`,
          title: item.position,
          org: item.company,
          desc: item.description,
          color: colors[idx % colors.length]
        }));
        setDbTimeline(mapped);
      } else {
        setDbTimeline(timeline);
      }
    };
    loadData();
  }, []);

  return (
    <section
      id="About"
      className="relative min-h-screen w-full overflow-hidden lg:px-10 px-4 py-12 pt-20"
      style={{
        background: "#0A0A0A",
        contentVisibility: "auto",
        containIntrinsicSize: "900px",
      }}
    >
      <style>{`
        @keyframes hud-scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .hud-scanline {
          animation: hud-scan 5s linear infinite;
        }
      `}</style>

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0,200,100,0.05), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(98,165,143,0.04), transparent 50%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 grid h-full grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr]"
      >
        {/* ── LEFT — Holographic Dossier + Stats ──────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center gap-6 order-2 md:order-1"
        >
          {/* Holographic Dossier Card */}
          <div className="relative w-72 h-[26rem] md:w-80 md:h-[28rem] rounded-2xl border border-[#4FFFB0]/10 bg-[#0d0d12]/85 backdrop-blur-md p-4 group transition-all duration-500 hover:border-[#4FFFB0]/35"
            style={{ boxShadow: "0 0 0 1px rgba(79,255,176,0.04), 0 8px 60px rgba(0,0,0,0.5), 0 0 40px rgba(79,255,176,0.04)" }}
          >
            
            {/* HUD Corner Tech Crosses */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#4FFFB0]/50" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#4FFFB0]/50" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#4FFFB0]/50" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#4FFFB0]/50" />

            {/* Photo Container */}
            <div className="relative h-[72%] w-full overflow-hidden rounded-xl border border-white/[0.04] bg-neutral-950">
              {/* Scanline overlay */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none opacity-20"
                style={{
                  backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                  backgroundSize: "100% 4px, 6px 100%"
                }}
              />
              
              {/* Active scanning bar */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4FFFB0] to-transparent hud-scanline pointer-events-none z-10" />

              <motion.img
                variants={scaleIn}
                src={dbProfile?.avatar || "/Photos/image.png"}
                alt={dbProfile?.name || "Abdikadir Kosar"}
                loading="lazy"
                decoding="async"
                initial={{ scale: 1.05, filter: "grayscale(30%) brightness(0.95)" }}
                whileHover={{
                  scale: 1.02,
                  filter: "grayscale(0%) brightness(1)",
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                }}
                className="h-full w-full object-cover rounded-xl transition-all duration-700 will-change-transform"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Telemetry data below image */}
            <div className="mt-4 font-mono text-[10px] space-y-1.5 text-white/45">
              <div className="flex justify-between border-b border-white/[0.04] pb-1">
                <span className="tracking-wider">SYS_STATUS</span>
                <span className="text-[#4FFFB0] font-semibold flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4FFFB0] animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1">
                <span className="tracking-wider">CORE_MODULE</span>
                <span className="text-white/85 font-medium uppercase">AI & FULL-STACK</span>
              </div>
              <div className="flex justify-between">
                <span className="tracking-wider">LOCATION</span>
                <span className="text-white/80 font-medium">HARGEISA, SL</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2"
          >
            {stats.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} />
            ))}
          </motion.div>

          {/* Available badge */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2.5 rounded-full border bg-neutral-950/80 px-6 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white transition-all duration-300 mt-2"
            style={{
              borderColor: "rgba(79,255,176,0.2)",
              boxShadow: "0 0 20px rgba(79,255,176,0.06)",
            }}
          >
            Available for Hire
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
          </motion.button>
        </motion.div>

        {/* ── RIGHT — Bio + Skills + Timeline ─────────────────────────────── */}
        <motion.div variants={container} className="relative flex flex-col justify-center order-1 md:order-2">

          {/* Sub-badge */}
          <motion.div variants={fadeUp} className="mb-2.5">
            <span className="hud-badge">dossier.system</span>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={fadeUp}
            className="mb-1 flex items-center gap-4"
          >
            <h2 className="heading-premium lg:text-5xl text-4xl">
              About <span className="heading-italic">Me</span>
            </h2>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: false }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-px flex-1 bg-white/10"
            />
          </motion.div>

          {/* Star decoration */}
          <motion.svg
            variants={scaleIn}
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="absolute right-4 top-10 text-[#4FFFB0] hidden md:block"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="#4FFFB0"
          >
            <path d="M14 0 L16 11 L28 14 L16 17 L14 28 L12 17 L0 14 L12 11 Z" />
          </motion.svg>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            className="my-5 max-w-xl text-[15px] leading-relaxed text-white/65 whitespace-pre-line"
          >
            {dbProfile?.about_me || dbProfile?.bio || (
              <>
                I am an ambitious <span className="text-[#4FFFB0]">AI Engineer</span> and{" "}
                <span className="text-[#4FFFB0]">Full Stack Developer</span> based in Hargeisa,
                Somaliland, with a passion for building intelligent applications and high-performance
                web systems. I specialize in leveraging AI and modern web architectures to solve
                complex, real-world problems.
              </>
            )}
          </motion.p>

          <motion.div
            variants={container}
            className="grid max-w-xl grid-cols-2 gap-3 mb-8"
          >
            {skills.map((skill, index) => (
              <ThreeDTilt
                key={skill.title}
                className="rounded-2xl border border-white/[0.05] bg-[#0d0d0d]/90 lg:p-5 p-4 cursor-default group relative overflow-hidden transition-all duration-500"
                maxTilt={8}
                scale={1.03}
                accentColor={skill.accent}
              >
                {/* Hover background glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${skill.accent}18 0%, transparent 65%)` }}
                />
                {/* Inner shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full group-hover:left-[200%] transition-all duration-[900ms] ease-in-out"
                    style={{ background: `linear-gradient(90deg, transparent, ${skill.accent}08, transparent)`, transform: "skewX(-12deg)" }}
                  />
                </div>
                <motion.div
                  initial={{ rotate: -8, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
                  style={{ background: `${skill.accent}18`, color: skill.accent, border: `1px solid ${skill.accent}30` }}
                >
                  <skill.Icon size={18} />
                </motion.div>
                <p className="mb-1.5 text-[14px] font-bold text-white leading-snug">{skill.title}</p>
                <p className="text-[12px] leading-relaxed text-white/40">{skill.desc}</p>
                {/* Animated border trace on hover */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"
                  style={{ background: `linear-gradient(90deg, ${skill.accent}, ${skill.accent}30, transparent)` }}
                />
              </ThreeDTilt>
            ))}
          </motion.div>

          {/* Download CV */}
          <motion.a
            href={dbProfile?.resume_url || "/Abdikadir_Kosar_Osman_CV.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(79,255,176,0.3), 0 0 80px rgba(79,255,176,0.1)" }}
            whileTap={{ scale: 0.97 }}
            className="mb-10 lg:mt-0 flex lg:mx-0 w-56 mx-auto gap-2.5 items-center justify-center font-mono font-bold text-sm text-[#0A0A0A] lg:px-6 px-6 lg:py-3.5 py-3.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4FFFB0 0%, #34d399 100%)",
              boxShadow: "0 0 25px rgba(79,255,176,0.3), 0 0 50px rgba(79,255,176,0.1)",
            }}
          >
            Download CV <Download size={16} />
          </motion.a>

          {/* ── Journey Timeline Circuit ─────────────────────────────────── */}
          <motion.div variants={fadeUp} className="relative">
            <h3 className="text-white/40 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              Journey
              <span className="h-px flex-1 bg-white/10" />
            </h3>

            <div className="relative pl-6">
              {/* Glowing vertical circuit timeline line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-[2px] rounded-full"
                style={{
                  background: "linear-gradient(to bottom, rgba(79,255,176,0.7), rgba(79,255,176,0.15), transparent)",
                  boxShadow: "0 0 8px rgba(79,255,176,0.15)",
                }}
              />

              {(dbTimeline || timeline).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mb-7 last:mb-0 group/time"
                >
                  {/* Glowing Node Dot */}
                  <div
                    className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border border-neutral-900 bg-[#0A0A0A] flex items-center justify-center transition-all duration-300 group-hover/time:scale-125"
                    style={{
                      boxShadow: `0 0 0 2px ${item.color}30, 0 0 12px ${item.color}25`,
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}, 0 0 16px ${item.color}60`,
                      }}
                    />
                  </div>
                  
                  <span 
                    className="inline-block text-[9px] font-mono border px-2.5 py-1 rounded-full mb-1.5 font-bold tracking-wider"
                    style={{
                      borderColor: `${item.color}30`,
                      backgroundColor: `${item.color}08`,
                      color: item.color,
                      boxShadow: `0 0 10px ${item.color}15`,
                    }}
                  >
                    [ {item.year} ]
                  </span>
                  
                  <p className="text-white text-[15px] font-semibold mb-0.5 leading-tight">{item.title}</p>
                  <p className="text-[#4FFFB0] text-[12px] mb-1 font-mono tracking-wide">{item.org}</p>
                  <p className="text-white/40 text-[12px] leading-relaxed max-w-xl">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
