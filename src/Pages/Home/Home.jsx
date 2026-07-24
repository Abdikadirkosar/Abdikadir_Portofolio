import { LuGithub, LuMail } from "react-icons/lu";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { ProfileCard } from "./components/ProfileCard";
import { easeInOut, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "../../Components/MagneticButton";
import { safeQuery } from "../../lib/supabase";
import MiniTerminal from "../../Components/MiniTerminal";
import ResumeDownloadButton from "../../Components/ResumeDownloadButton";
import { useLiveVisitors } from "../../hooks/useLiveVisitors";
import { Users } from "lucide-react";

const wordsList = ["products", "strategies", "apps", "pipelines"];

// ── Rotating words ────────────────────────────────────────────────────────────
const RotatingWords = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % wordsList.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden h-[42px] lg:h-[56px] align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#4FFFB0] font-black"
          style={{ textShadow: "0 0 35px rgba(79, 255, 176, 0.5), 0 0 70px rgba(79, 255, 176, 0.15)" }}
        >
          {wordsList[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// ── Floating tech pills data ──────────────────────────────────────────────────
const pills = [
  { label: "C# / .NET", color: "#a855f7", delay: 0 },
  { label: "React.js", color: "#38bdf8", delay: 0.15 },
  { label: "AI Systems", color: "#4FFFB0", delay: 0.3 },
  { label: "Python", color: "#facc15", delay: 0.45 },
  { label: "Next.js", color: "#94a3b8", delay: 0.6 },
  { label: "LangChain", color: "#f97316", delay: 0.75 },
];

// ── Hero stats ────────────────────────────────────────────────────────────────
const heroStats = [
  { value: "10+", label: "Projects", color: "#4FFFB0" },
  { value: "2+", label: "Years Exp", color: "#38bdf8" },
  { value: "15+", label: "Tech Stack", color: "#a855f7" },
];

// ── Floating particle system ──────────────────────────────────────────────────
const HeroParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 8,
    color: ["#4FFFB0", "#a855f7", "#38bdf8", "#facc15"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() > 0.5 ? 15 : -15, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ── Animated stat counter ─────────────────────────────────────────────────────
const StatItem = ({ value, label, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center gap-0.5 group"
  >
    <span
      className="text-2xl font-black font-mono leading-none"
      style={{ color, textShadow: `0 0 20px ${color}60` }}
    >
      {value}
    </span>
    <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-mono group-hover:text-white/60 transition-colors duration-300">
      {label}
    </span>
  </motion.div>
);

// ── Main Home component ───────────────────────────────────────────────────────
const Home = () => {
  const [prof, setProf] = useState(null);
  const liveCount = useLiveVisitors();

  useEffect(() => {
    const fetchProf = async () => {
      const { data } = await safeQuery(sb => sb.from("db_profile").select("*").eq("id", 1).single());
      if (data) setProf(data);
    };
    fetchProf();
  }, []);

  const texts = prof?.bio
    ? [prof.bio]
    : [
        "Fullstack AI Developer & Software Engineer based in Hargeisa, Somaliland.",
        "Experienced in building C# systems, full-stack websites, and custom AI agents.",
        "Currently completing my Senior year in Computer Science at New Generation University.",
      ];

  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Typewriter effect ───────────────────────────────────────────────────────
  useEffect(() => {
    const currentText = texts[textIndex] || "";
    if (!currentText) return;
    const typingSpeed = isDeleting ? 18 : 38;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const updated = currentText.slice(0, displayedText.length + 1);
        setDisplayedText(updated);
        if (updated === currentText) {
          setTimeout(() => setIsDeleting(true), 1400);
        }
      } else {
        const updated = currentText.slice(0, displayedText.length - 1);
        setDisplayedText(updated);
        if (updated === "") {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex, texts]);

  return (
    <section
      id="Home"
      className="relative flex lg:flex-row md:flex-row flex-col z-10 bg-transparent text-2xl lg:px-[13%] md:px-4 px-5 py-4 text-white font-bold items-center justify-center lg:h-screen min-h-[75vh] lg:pt-20 pt-20 overflow-hidden"
    >
      {/* Premium floating particles */}
      <HeroParticles />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(rgba(79,255,176,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,176,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Left side ──────────────────────────────────────────────────────── */}
      <div className="left-side flex-1 flex flex-col justify-center lg:py-0 py-10">

        {/* Available for Work Badge — premium version */}
        <motion.div
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold mb-6 w-fit cursor-default"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(79,255,176,0.08))",
            border: "1px solid rgba(34,197,94,0.3)",
            boxShadow: "0 0 25px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: easeInOut }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-green-300 font-mono tracking-wide text-[11px]">Available for Work</span>
        </motion.div>

        {/* Hello */}
        <motion.p
          className="text-white/40 font-mono tracking-[0.3em] lg:text-sm text-xs mb-1 uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut, delay: 0.1 }}
        >
          Hello, I am
        </motion.p>

        {/* Name */}
        <motion.h1
          className="heading-shimmer lg:text-7xl text-5xl font-black mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut, delay: 0.2 }}
        >
          {prof?.name || "Abdikadir Kosar"}
        </motion.h1>

        {/* Role & Pitch */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut, delay: 0.3 }}
        >
          <h2 className="heading text-white lg:text-5xl text-3xl font-black leading-tight">
            I craft digital <RotatingWords /><br />
            that drive real <span className="italic-serif text-[#4FFFB0] font-normal lowercase">growth</span>.
          </h2>
          <p className="text-white/50 lg:text-base text-sm font-normal max-w-lg leading-relaxed mt-3">
            Specializing in full-stack product development, C# enterprise systems, and custom AI agents to build next-generation applications.
          </p>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          className="flex items-center gap-6 mt-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          {heroStats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
          <div className="h-8 w-px bg-white/10" />
          {/* Live Visitors Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono"
            style={{ background: "rgba(79,255,176,0.06)", borderColor: "rgba(79,255,176,0.2)", color: "#4FFFB0" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FFFB0] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4FFFB0]" />
            </span>
            <Users size={10} />
            <span>{liveCount} viewing now</span>
          </motion.div>
        </motion.div>

        {/* Floating tech pills */}
        <motion.div
          className="flex flex-wrap gap-2 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {pills.map((pill) => (
            <motion.span
              key={pill.label}
              className="text-[11px] px-3.5 py-1.5 rounded-full border font-mono font-medium cursor-default tag-glow"
              style={{
                borderColor: `${pill.color}30`,
                color: pill.color,
                backgroundColor: `${pill.color}08`,
              }}
              animate={{ y: [0, -4, 0] }}
              whileHover={{
                scale: 1.08,
                backgroundColor: `${pill.color}18`,
                boxShadow: `0 0 16px ${pill.color}40`,
              }}
              transition={{
                duration: 2.5 + pill.delay,
                repeat: Infinity,
                delay: pill.delay,
                ease: "easeInOut",
              }}
            >
              {pill.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Resume Download CTA & Social links */}
        {/* Resume Download CTA & Social links */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut, delay: 0.8 }}
        >
          <ResumeDownloadButton />

          <div className="flex items-center gap-2">
            {[
              { href: prof?.github || "https://github.com/abdikadirkosar", Icon: LuGithub, label: "GitHub" },
              { href: prof?.email ? `mailto:${prof.email}` : "mailto:abdikadirkosara@gmail.com", Icon: LuMail, label: "Email" },
              { href: prof?.linkedin || "https://linkedin.com/in/abdikadirkosar", Icon: FaLinkedinIn, label: "LinkedIn" },
              { href: prof?.phone ? `https://wa.me/${prof.phone.replace(/[^0-9]/g, '')}` : "https://wa.me/252634812030", Icon: FaWhatsapp, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/40 hover:bg-[#4FFFB0]/8 transition-all duration-300"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Mini Terminal Console */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeInOut, delay: 0.55 }}
          className="mt-1"
        >
          <MiniTerminal />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="buttons flex flex-wrap gap-4 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeInOut, delay: 0.6 }}
        >
          <MagneticButton strength={0.25}>
            <a
              href="#Contact"
              className="btn-premium group flex gap-2 items-center font-bold text-[14px] bg-[#4FFFB0] hover:bg-[#4FFFB0]/90 active:bg-[#4FFFB0] text-[#0A0A0A] px-7 py-3.5 rounded-full border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#ffffff,0_0_30px_rgba(79,255,176,0.3)] hover:shadow-[2px_2px_0px_0px_#ffffff,0_0_40px_rgba(79,255,176,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 cursor-pointer"
            >
              Let's Talk
              <MdOutlineArrowOutward className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <a
              href={prof?.resume_url || "/Abdikadir_Kosar_Osman_CV.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium flex gap-2 items-center font-bold text-[14px] bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#4FFFB0]/40 px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.04)] hover:shadow-[0_0_30px_rgba(79,255,176,0.15)] transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              Download CV
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ── Right side — Profile Card ─────────────────────────────────────────── */}
      <motion.div
        className="right-side flex-1 flex justify-end items-center mt-10 lg:my-0 my-15 animate-float-slow"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: easeInOut, delay: 0.4 }}
      >
        <ProfileCard prof={prof} />
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────────────────────────── */}
      <motion.a
        href="#About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group hidden lg:flex"
        aria-label="Scroll to About"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] text-white/20 uppercase group-hover:text-[#4FFFB0]/60 transition-colors duration-300">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/10 via-[#4FFFB0]/40 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#4FFFB0] to-transparent"
            style={{ height: "40%" }}
            animate={{ y: ["0%", "250%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#4FFFB0]/30 group-hover:text-[#4FFFB0]/70 transition-colors"
        >
          ↓
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Home;
