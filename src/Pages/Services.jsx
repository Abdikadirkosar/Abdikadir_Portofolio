import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Layers, Cpu, Database, Palette, Eye, Server, Rocket } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import ThreeDTilt from "../Components/ThreeDTilt";
import { useSectionGSAP } from "../hooks/useSectionGSAP";

const defaultServices = [
  {
    title: "Full Stack Web Development",
    description: "End-to-end architecture design and delivery of enterprise-grade web platforms. React, Next.js, Node.js, and Django are my daily tools.",
    icon: "Layers",
    accentColor: "#4FFFB0",
    tag: "Production-grade"
  },
  {
    title: "AI & LLM Integration",
    description: "Embedding intelligence into real products — RAG pipelines, fine-tuned LLMs, autonomous agents with LangChain & LlamaIndex.",
    icon: "Brain",
    accentColor: "#a855f7",
    tag: "LangChain · GPT-4"
  },
  {
    title: "Computer Vision & ML Systems",
    description: "Production-grade CV pipelines using PyTorch, TensorFlow, and OpenCV. Face recognition, object detection, real-time video analysis.",
    icon: "Eye",
    accentColor: "#3b82f6",
    tag: "Edge deployment"
  },
  {
    title: "REST & GraphQL API Architecture",
    description: "Bulletproof APIs with OpenAPI specs, JWT/OAuth2 auth, rate limiting, and comprehensive documentation. Sub-50ms p99 latency.",
    icon: "Cpu",
    accentColor: "#f59e0b",
    tag: "100k+ req/day"
  },
  {
    title: "Database Architecture & Optimization",
    description: "Schema design, query optimization, and indexing across PostgreSQL, MySQL, MongoDB, Redis, and ClickHouse.",
    icon: "Database",
    accentColor: "#ec4899",
    tag: "Performance tuning"
  },
  {
    title: "Cloud & DevOps Engineering",
    description: "CI/CD pipelines, containerized workloads with Docker & Kubernetes, infrastructure on AWS, GCP, and Vercel.",
    icon: "Server",
    accentColor: "#06b6d4",
    tag: "Terraform · Grafana"
  },
  {
    title: "UI/UX Design Engineering",
    description: "Bridging design and engineering. Design systems from scratch using Tailwind CSS and Framer Motion. WCAG 2.1 AA compliant.",
    icon: "Palette",
    accentColor: "#f43f5e",
    tag: "Sub-2s LCP"
  },
  {
    title: "Startup MVP & Technical Leadership",
    description: "From zero to deployed product in weeks. Production-ready MVPs with scalable foundations, clean code, and documentation.",
    icon: "Rocket",
    accentColor: "#84cc16",
    tag: "CTO consulting"
  }
];

const iconMap = {
  Layers, Brain, Cpu, Database, Palette, Eye, Server, Rocket
};

const Services = () => {
  const [services, setServices] = useState(defaultServices);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    const fetchSvs = async () => {
      const { data } = await safeQuery(sb => sb.from("db_services").select("*").order("created_at", { ascending: true }));
      if (data && data.length > 0) setServices(data);
    };
    fetchSvs();
  }, []);

  const getBentoSpan = (idx) => {
    const mod = idx % 8;
    if (mod === 0 || mod === 1 || mod === 5 || mod === 6) return "lg:col-span-3 md:col-span-1";
    if (mod === 7) return "lg:col-span-6 md:col-span-2";
    return "lg:col-span-2 md:col-span-1";
  };

  return (
    <section
      ref={sectionRef}
      id="Services"
      className="relative lg:px-20 md:px-10 px-4 py-24 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Ambient glows — premium */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at 85% 15%, rgba(79,255,176,0.07) 0%, transparent 45%), radial-gradient(ellipse at 10% 85%, rgba(168,85,247,0.06) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.03) 0%, transparent 60%)"
      }} />

      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: "linear-gradient(rgba(79,255,176,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,176,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="hud-badge">services.system</span>
          </motion.div>
          
          <h2 className="gsap-title text-4xl md:text-5xl flex gap-3 justify-center flex-wrap font-black">
            <span className="heading-premium">Professional</span>
            <span className="heading-italic">Services</span>
          </h2>

          <p className="gsap-desc text-white/35 text-sm mt-4 max-w-md mx-auto opacity-0 leading-relaxed">
            Delivering robust end-to-end architectures and next-generation AI integrations.
          </p>

          {/* Premium divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="section-divider max-w-xs mx-auto mt-8"
          />
        </div>

        {/* Bento Grid */}
        <div className="gsap-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {services.map((s, index) => {
            const IconComp = iconMap[s.icon] || Layers;
            const accent = s.accentColor || "#4FFFB0";
            return (
              <motion.div
                key={s.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${getBentoSpan(index)}`}
              >
                <ThreeDTilt
                  className="group relative rounded-2xl border border-white/[0.05] bg-[#0d0d12]/80 p-6 h-full flex flex-col justify-between overflow-hidden transition-all duration-500"
                  maxTilt={6}
                  scale={1.02}
                  accentColor={accent}
                >
                  {/* Hover background glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${accent}18 0%, transparent 65%)`,
                    }}
                  />

                  {/* Light sweep on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-[-100%] w-1/3 h-full group-hover:left-[200%] transition-all duration-[800ms] ease-in-out"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)", transform: "skewX(-15deg)" }}
                    />
                  </div>

                  {/* Corner Accent Brackets */}
                  <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/10 group-hover:border-[#4FFFB0]/40 transition-colors duration-300" />
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/10 group-hover:border-[#4FFFB0]/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/10 group-hover:border-[#4FFFB0]/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/10 group-hover:border-[#4FFFB0]/40 transition-colors duration-300" />

                  <div>
                    {/* Top Row: Icon + Number */}
                    <div className="flex justify-between items-start mb-6">
                      <motion.div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{
                          background: `${accent}12`,
                          border: `1px solid ${accent}25`,
                          color: accent,
                        }}
                        whileHover={{ rotate: -8, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <IconComp size={18} />
                      </motion.div>
                      <span className="text-[10px] font-mono text-white/10 tracking-widest">
                        // 0{index + 1}
                      </span>
                    </div>

                    {/* Tag chip */}
                    <span
                      className="inline-flex items-center text-[8.5px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 w-fit border"
                      style={{ 
                        background: `${accent}08`, 
                        color: accent, 
                        borderColor: `${accent}20`,
                        boxShadow: `0 0 10px ${accent}15`,
                      }}
                    >
                      {s.tag || "Service Module"}
                    </span>

                    <h3 className="text-white font-bold text-base mb-2 tracking-wide leading-snug group-hover:text-white transition-colors">
                      {s.title}
                    </h3>
                    
                    <p className="text-white/40 text-[12.5px] leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  {/* Telemetry Code Snippet */}
                  <div className="mt-5 font-mono text-[9px] text-white/20 bg-black/50 rounded-lg p-2.5 border border-white/[0.03] transition-all duration-300 group-hover:text-[#4FFFB0]/80 group-hover:border-[#4FFFB0]/15 group-hover:bg-[#000]/75">
                    <span className="text-white/10 select-none mr-1.5">$</span>
                    {s.snippet || `sys_compile --target="${s.title.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')}"`}
                  </div>

                  {/* Bottom line indicator */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}50, transparent)` }}
                  />
                </ThreeDTilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
