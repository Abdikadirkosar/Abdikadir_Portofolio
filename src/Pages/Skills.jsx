import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import OrbitalDiagram from "./Skills/OrbitalDiagram";
import { safeQuery } from "../lib/supabase";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import {
  Code2,
  Globe,
  FileCode,
  Database,
  Server,
  GitBranch,
  Boxes,
  Cpu,
  Terminal,
  Layers,
  Brain,
  Bot,
  Cloud,
} from "lucide-react";

// ── Skills data ───────────────────────────────────────────────────────────────
const allSkills = [
  // ── AI / ML ────────────────────────────────────────────────────────────────
  { icon: Brain,     name: "Generative AI & LLMs",    desc: "GPT-4, Claude 3, Gemini, Mistral, Llama 3",  iconBg: "bg-purple-500/10",  iconColor: "#a855f7", category: "AI" },
  { icon: Bot,       name: "AI Agents & Pipelines",   desc: "LangChain, LangGraph, CrewAI, AutoGen",      iconBg: "bg-pink-500/10",    iconColor: "#ec4899", category: "AI" },
  { icon: Cpu,       name: "Deep Learning",            desc: "PyTorch, TensorFlow, Keras, ONNX",           iconBg: "bg-rose-500/10",    iconColor: "#f43f5e", category: "AI" },
  { icon: Cpu,       name: "Computer Vision",          desc: "OpenCV, YOLO, DeepFace, MediaPipe",          iconBg: "bg-fuchsia-500/10", iconColor: "#d946ef", category: "AI" },
  { icon: Bot,       name: "NLP & Transformers",       desc: "HuggingFace, BERT, Sentence Transformers",   iconBg: "bg-violet-500/10",  iconColor: "#8b5cf6", category: "AI" },
  { icon: Brain,     name: "RAG & Vector DBs",         desc: "Pinecone, pgvector, ChromaDB, Weaviate",     iconBg: "bg-indigo-400/10",  iconColor: "#818cf8", category: "AI" },
  { icon: Brain,     name: "ML Ops & Fine-tuning",     desc: "LoRA, QLoRA, PEFT, MLflow, Weights & Biases",iconBg: "bg-purple-400/10",  iconColor: "#c084fc", category: "AI" },

  // ── Frontend ────────────────────────────────────────────────────────────────
  { icon: FileCode,  name: "JavaScript / TypeScript",  desc: "ES2024, Async/Await, WebSockets, Workers",   iconBg: "bg-yellow-500/10",  iconColor: "#eab308", category: "Frontend" },
  { icon: Layers,    name: "React.js & Next.js",       desc: "RSC, App Router, SSR, ISR, Server Actions",  iconBg: "bg-cyan-500/10",    iconColor: "#06b6d4", category: "Frontend" },
  { icon: Globe,     name: "Tailwind CSS",             desc: "Design Systems, Tokens, Dark Mode",          iconBg: "bg-teal-500/10",    iconColor: "#14b8a6", category: "Frontend" },
  { icon: Layers,    name: "Framer Motion",            desc: "Micro-animations, Page Transitions, SVG",    iconBg: "bg-sky-500/10",     iconColor: "#0ea5e9", category: "Frontend" },
  { icon: Globe,     name: "HTML5 & CSS3",             desc: "Semantics, Grid, Flex, Animations, WCAG",    iconBg: "bg-orange-500/10",  iconColor: "#f97316", category: "Frontend" },
  { icon: Layers,    name: "Redux & Zustand",          desc: "State Management, RTK Query, Immer",          iconBg: "bg-purple-600/10",  iconColor: "#9333ea", category: "Frontend" },

  // ── Backend ─────────────────────────────────────────────────────────────────
  { icon: Terminal,  name: "Python",                   desc: "FastAPI, Django, Celery, Asyncio",            iconBg: "bg-blue-500/10",    iconColor: "#3b82f6", category: "Backend" },
  { icon: Server,    name: "Node.js & Express",        desc: "REST APIs, WebSockets, Middleware, Queues",   iconBg: "bg-green-500/10",   iconColor: "#22c55e", category: "Backend" },
  { icon: Globe,     name: "Django & FastAPI",         desc: "ORM, DRF, Pydantic, OAuth2, OpenAPI",         iconBg: "bg-emerald-500/10", iconColor: "#10b981", category: "Backend" },
  { icon: Code2,     name: "GraphQL & REST Design",    desc: "Apollo, Hasura, tRPC, OpenAPI Spec",          iconBg: "bg-pink-500/10",    iconColor: "#ec4899", category: "Backend" },
  { icon: Terminal,  name: "JWT / OAuth2 / Auth",      desc: "NextAuth, Supabase Auth, Clerk, Auth0",       iconBg: "bg-amber-500/10",   iconColor: "#f59e0b", category: "Backend" },

  // ── Databases ───────────────────────────────────────────────────────────────
  { icon: Database,  name: "PostgreSQL",               desc: "Query Optimization, CTEs, JSONB, pgvector",  iconBg: "bg-indigo-500/10",  iconColor: "#6366f1", category: "Databases" },
  { icon: Database,  name: "MongoDB & Redis",          desc: "Aggregations, Sharding, Caching Patterns",   iconBg: "bg-orange-500/10",  iconColor: "#ea580c", category: "Databases" },
  { icon: Database,  name: "Supabase & Firebase",      desc: "RLS, Realtime, Edge Functions, Storage",     iconBg: "bg-teal-500/10",    iconColor: "#0d9488", category: "Databases" },
  { icon: Database,  name: "MySQL & SQLite",           desc: "Indexing, Views, Stored Procedures",         iconBg: "bg-blue-400/10",    iconColor: "#60a5fa", category: "Databases" },
  { icon: Database,  name: "ClickHouse & Analytics",  desc: "OLAP, Time-series, Dashboard Data Pipelines", iconBg: "bg-red-400/10",     iconColor: "#f87171", category: "Databases" },

  // ── Cloud & DevOps ──────────────────────────────────────────────────────────
  { icon: Cloud,     name: "AWS & GCP",                desc: "EC2, S3, Lambda, CloudFront, Cloud Run",     iconBg: "bg-sky-500/10",     iconColor: "#0ea5e9", category: "DevOps" },
  { icon: Boxes,     name: "Docker & Kubernetes",      desc: "Compose, Helm, EKS, Autoscaling, Ingress",   iconBg: "bg-cyan-600/10",    iconColor: "#0891b2", category: "DevOps" },
  { icon: GitBranch, name: "CI/CD & GitHub Actions",  desc: "Automated Pipelines, Tests, Releases, IaC",  iconBg: "bg-red-500/10",     iconColor: "#ef4444", category: "DevOps" },
  { icon: Server,    name: "Linux & Bash",             desc: "Ubuntu, CentOS, Shell Scripting, Cron",      iconBg: "bg-stone-500/10",   iconColor: "#78716c", category: "DevOps" },
  { icon: Cloud,     name: "Vercel & Netlify",         desc: "Edge Deployments, Preview Environments",     iconBg: "bg-neutral-400/10", iconColor: "#a3a3a3", category: "DevOps" },
  { icon: Server,    name: "Nginx & Reverse Proxies",  desc: "SSL/TLS, Load Balancing, Rate Limiting",     iconBg: "bg-lime-500/10",    iconColor: "#84cc16", category: "DevOps" },
];

const categories = ["All", "AI", "Frontend", "Backend", "Databases", "DevOps"];
const categoryLabels = {
  "All": "ALL_SYSTEMS",
  "AI": "AI_COGNITIVE",
  "Frontend": "FRONT_UI",
  "Backend": "BACK_API",
  "Databases": "DB_STORAGE",
  "DevOps": "CLOUD_DEVOPS"
};

// ── Continuous Drifting Ticker Component ──────────────────────────────────────
const InfiniteSkillTicker = ({ skills }) => {
  const doubled = [...skills, ...skills];
  return (
    <div className="w-full overflow-hidden my-6 py-3 border-y border-white/[0.06] bg-black/40 backdrop-blur-md">
      <motion.div
        className="flex gap-6 whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((s, idx) => {
          const Icon = s.icon || Brain;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0 hover:border-[#4FFFB0]/40 transition-colors"
            >
              <Icon size={14} style={{ color: s.iconColor || "#4FFFB0" }} />
              <span className="text-xs font-mono font-medium text-white/90">{s.name}</span>
              <span className="text-[10px] text-[#4FFFB0] font-mono">[{s.category}]</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ── Individual Skill Card with Drifting Floating Animation ─────────────────────
const SkillCard = ({ skill, index }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, amount: 0.2, margin: "0px" });

  useEffect(() => {
    controls.start(inView ? "show" : "hidden");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.95 },
        show: {
          opacity: 1, y: 0, scale: 1,
          transition: { duration: 0.45, delay: (index % 5) * 0.06, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="group relative overflow-hidden bg-[#0d0d12]/75 border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between items-center text-center gap-3 cursor-pointer backdrop-blur-sm"
    >
      {/* Continuous Gentle Floating Levitation */}
      <motion.div
        className="w-full flex flex-col items-center"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 3 + (index % 3) * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: (index % 4) * 0.2
        }}
      >
        {/* Radial glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${skill.iconColor}14, transparent 70%)`,
            boxShadow: `0 0 0 1px ${skill.iconColor}30`,
          }}
        />

        {/* Cyber Brackets */}
        <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/5 group-hover:border-[#4FFFB0]/30 transition-colors" />
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/5 group-hover:border-[#4FFFB0]/30 transition-colors" />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: -8, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${skill.iconBg}`}
          style={{ 
            border: `1px solid ${skill.iconColor}25`,
            boxShadow: `0 4px 20px ${skill.iconColor}20` 
          }}
        >
          <skill.icon size={18} style={{ color: skill.iconColor }} />
        </motion.div>

        {/* Details */}
        <div className="w-full flex-1 flex flex-col items-center mt-2">
          <p className="relative z-10 text-[13px] font-semibold text-white group-hover:text-[#4FFFB0] transition-colors duration-300 leading-tight">
            {skill.name}
          </p>
          <p className="relative z-10 text-white/35 text-[11px] leading-normal mt-1 max-w-[130px]">{skill.desc}</p>
        </div>

        {/* Mini Level Indicator */}
        <div className="w-full mt-3 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${skill.percentage || 80}%`, 
              backgroundColor: skill.iconColor,
              boxShadow: `0 0 8px ${skill.iconColor}`
            }}
          />
        </div>

        {/* Bottom glow line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] w-0 group-hover:w-3/4 transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${skill.iconColor}60, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
};

// ── GSAP Animated section title ───────────────────────────────────────────────
const AnimatedTitle = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-split animation
      const words = containerRef.current.querySelectorAll(".gsap-word");
      gsap.fromTo(
        words,
        { y: "120%", opacity: 0, filter: "blur(8px)" },
        {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      // Underline expand
      const line = containerRef.current.querySelector(".gsap-line");
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, opacity: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.4,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // Subtitle fade
      const sub = containerRef.current.querySelector(".gsap-sub");
      if (sub) {
        gsap.fromTo(
          sub,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.55,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

    return (
    <div ref={containerRef} className="flex flex-col items-center mb-16">
      <div className="mb-4">
        <span className="hud-badge">skills.system</span>
      </div>
      
      <div className="relative overflow-hidden pb-5">
        <h2 className="text-4xl md:text-5xl flex gap-3 flex-wrap justify-center font-black">
          <span className="heading-premium gsap-word">Creative &amp;</span>
          <span className="heading-italic gsap-word">Tech Stack</span>
        </h2>
        <div
          className="gsap-line h-1.5 bg-[#4FFFB0] rounded-2xl absolute -bottom-0 left-[25%]"
          style={{ width: "50%", opacity: 0 }}
        />
      </div>
      <p className="gsap-sub text-white/30 text-sm mt-6 max-w-sm text-center opacity-0">
        Technologies I use to build intelligent and high-performance systems
      </p>
    </div>
  );
};

// ── Main Skills Component ─────────────────────────────────────────────────────
// ── Lucide Icon Map ────────────────────────────────────────────────────────────
const iconMap = {
  Brain: Brain,
  Bot: Bot,
  Cpu: Cpu,
  Code2: Code2,
  Globe: Globe,
  FileCode: FileCode,
  Database: Database,
  Server: Server,
  GitBranch: GitBranch,
  Boxes: Boxes,
  Terminal: Terminal,
  Layers: Layers,
  Cloud: Cloud,
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbSkills, setDbSkills] = useState(null); // null = not loaded yet

  useEffect(() => {
    const loadSkills = async () => {
      const { data } = await safeQuery((sb) =>
        sb.from("db_skills").select("*").order("created_at", { ascending: true })
      );
      if (data && data.length > 0) {
        // Normalize DB skill shape to match static skill shape
        const categoryColors = {
          AI: "#a855f7",
          Frontend: "#06b6d4",
          Backend: "#22c55e",
          Databases: "#6366f1",
          DevOps: "#0ea5e9",
        };
        const normalized = data.map((s) => {
          const cat = s.category || "Languages";
          const color = categoryColors[cat] || "#4FFFB0";
          return {
            name: s.name,
            desc: `${s.percentage ?? 0}% proficiency`,
            icon: iconMap[s.icon] || Brain,
            iconName: s.icon || "Brain",
            iconBg: `rgba(${parseInt(color.slice(1,3), 16) || 79}, ${parseInt(color.slice(3,5), 16) || 255}, ${parseInt(color.slice(5,7), 16) || 176}, 0.1)`,
            iconColor: color,
            category: cat,
            percentage: s.percentage ?? 80,
          };
        });
        setDbSkills(normalized);
      } else {
        setDbSkills(allSkills); // fallback to static
      }
    };
    loadSkills();
  }, []);

  const source = dbSkills ?? allSkills;
  const filtered = activeCategory === "All"
    ? source
    : source.filter((s) => s.category === activeCategory);

  return (
    <section
      id="Skills"
      className="w-full bg-[#0A0A0A] flex flex-col items-center px-4 py-12 pt-20"
    >
      <AnimatedTitle />

      {/* Infinite Continuous Drifting Skill Stream */}
      <InfiniteSkillTicker skills={source} />

      {/* Cyber Panel Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-2.5 mb-14 justify-center"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-5 py-2.5 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-300 border overflow-hidden ${
              activeCategory === cat
                ? "text-[#4FFFB0]"
                : "bg-[#0d0d12]/40 border-white/5 text-white/30 hover:border-white/15 hover:text-white/60"
            }`}
            style={activeCategory === cat ? {
              background: "linear-gradient(135deg, rgba(79,255,176,0.12), rgba(79,255,176,0.05))",
              borderColor: "rgba(79,255,176,0.4)",
              boxShadow: "0 0 25px rgba(79,255,176,0.2), 0 0 50px rgba(79,255,176,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
            } : {}}
          >
            {activeCategory === cat && (
              <span className="absolute inset-0 opacity-100 pointer-events-none" style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(79,255,176,0.06) 50%, transparent 100%)",
              }} />
            )}
            [ {categoryLabels[cat] || cat.toUpperCase()} ]
          </button>
        ))}
      </motion.div>

      {/* Dynamic layout: Technical Screen + Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-10 max-w-6xl w-full items-start">
        
        {/* Left column: Technical HUD screen with Orbital Diagram */}
        <div className="lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d12]/75 backdrop-blur-md p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
              <span className="font-mono text-[9px] text-[#4FFFB0] tracking-widest">// COGNITIVE_MAP</span>
              <span className="font-mono text-[9px] text-white/20">SYS_ID: CORE_CONSTELLATION</span>
            </div>
            
            <OrbitalDiagram />
            
            <div className="font-mono text-[10px] space-y-2 mt-2 text-white/35">
              <div className="flex justify-between border-b border-white/[0.03] pb-1">
                <span>ACTIVE_SECTOR</span>
                <span className="text-white/80 font-bold tracking-wide">{activeCategory.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.03] pb-1">
                <span>INDEXED_NODES</span>
                <span className="text-[#4FFFB0] font-bold">{filtered.length} UNITS</span>
              </div>
              <div className="flex justify-between">
                <span>GRID_STATUS</span>
                <span className="text-emerald-400 font-semibold animate-pulse">OPTIMIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Filtered Skills Grid grouped by Category */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-2">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">
              Tech Matrix Unit
            </span>
            <span className="text-[#4FFFB0] text-[9px] font-mono">
              LOADED: {filtered.length} ITEMS
            </span>
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 w-full"
          >
            {(activeCategory === "All"
              ? ["AI", "Frontend", "Backend", "Databases", "DevOps"]
              : [activeCategory]
            ).map((catName) => {
              const catSkills = filtered.filter((s) => s.category === catName);
              if (catSkills.length === 0) return null;

              const catInfo = {
                AI: { title: "🤖 AI & Machine Learning", desc: "LLMs, RAG, PyTorch & Agent Systems" },
                Frontend: { title: "⚡ Frontend & UI Frameworks", desc: "React, Next.js, Modern CSS & State" },
                Backend: { title: "⚙️ Backend & API Engineering", desc: "Python, Node.js, FastAPI & Architecture" },
                Databases: { title: "🗄️ Database & Storage Systems", desc: "PostgreSQL, Supabase, Redis & Vector DBs" },
                DevOps: { title: "☁️ Cloud & DevOps Infrastructure", desc: "AWS, Docker, CI/CD Pipelines & Vercel" },
              }[catName] || { title: catName, desc: "" };

              return (
                <div key={catName} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-l-2 border-[#4FFFB0] pl-3 py-1">
                    <div>
                      <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                        {catInfo.title}
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#4FFFB0]/10 text-[#4FFFB0] font-normal">
                          {catSkills.length} skills
                        </span>
                      </h3>
                      <p className="text-[11px] text-white/40">{catInfo.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {catSkills.map((skill, i) => (
                      <SkillCard key={skill.name} skill={skill} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Count badge */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-white/15 text-[10px] font-mono tracking-widest"
      >
        // MATRIX_LOADED: {filtered.length} NODES // {activeCategory.toUpperCase()}_SECTOR
      </motion.p>
    </section>
  );
};

export default Skills;
