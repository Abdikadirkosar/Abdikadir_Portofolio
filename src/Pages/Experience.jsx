import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const defaultExperience = [
  {
    company: "Freelance & Independent Projects",
    position: "Independent Software Developer",
    start_date: "2022",
    end_date: "Present",
    description: "Developing custom desktop and web solutions for local businesses. Engineered comprehensive C# management systems (School, Hotel, and Gym systems) using WinForms and SQL Server to automate billing, scheduling, and registries.",
    accent: "#4FFFB0",
  },
  {
    company: "AI & Automation Projects",
    position: "Independent AI Integrator",
    start_date: "2023",
    end_date: "Present",
    description: "Building custom generative AI integrations. Developed LLM-driven agents and chatbots utilizing LangChain and Python, connecting vector storage to web frontends for conversational document search.",
    accent: "#a855f7",
  },
];

const Experience = () => {
  const [exp, setExp] = useState(defaultExperience);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchExp = async () => {
      const { data } = await safeQuery((sb) =>
        sb.from("db_experience").select("*").order("created_at", { ascending: false })
      );
      if (data && data.length > 0) setExp(data);
    };
    fetchExp();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          }
        );
      }

      const words = sectionRef.current.querySelectorAll(".exp-word");
      if (words.length) {
        gsap.fromTo(
          words,
          { y: "110%", opacity: 0, filter: "blur(6px)" },
          {
            y: "0%", opacity: 1, filter: "blur(0px)",
            duration: 0.7, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
          }
        );
      }

      const tag = sectionRef.current.querySelector(".exp-tag");
      if (tag) {
        gsap.fromTo(tag, { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
        );
      }

      const cards = sectionRef.current.querySelectorAll(".exp-card");
      gsap.fromTo(cards,
        { opacity: 0, x: -40, filter: "blur(4px)" },
        {
          opacity: 1, x: 0, filter: "blur(0px)",
          duration: 0.65, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current.querySelector(".exp-timeline"), start: "top 80%", once: true },
        }
      );

      const dots = sectionRef.current.querySelectorAll(".exp-dot");
      gsap.fromTo(dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.4, stagger: 0.12, ease: "back.out(2)",
          scrollTrigger: { trigger: sectionRef.current.querySelector(".exp-timeline"), start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [exp]);

  return (
    <section
      ref={sectionRef}
      id="Experience"
      className="relative min-h-screen px-4 sm:px-6 py-24 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at 80% 30%, rgba(79,255,176,0.04) 0%, transparent 55%)",
      }} />

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Title */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="hud-badge">career.system</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black flex gap-3 justify-center flex-wrap">
            <span className="heading-premium exp-word">Work</span>
            <span className="heading-italic exp-word">Experience</span>
          </h2>

          <p className="exp-tag text-white/35 text-sm mt-4 max-w-sm mx-auto opacity-0 leading-relaxed">
            A chronological overview of my professional journey in technology and engineering.
          </p>
        </div>

        {/* Timeline */}
        <div className="exp-timeline relative pl-8 sm:pl-10 ml-2 sm:ml-4">
          {/* Animated vertical line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-[1.5px] rounded-full"
            style={{
              background: "linear-gradient(to bottom, rgba(79,255,176,0.8), rgba(79,255,176,0.2), transparent)",
              boxShadow: "0 0 8px rgba(79,255,176,0.2)",
            }}
          />

          {exp.map((item, index) => {
            const accent = item.accent || "#4FFFB0";
            const isActive = activeIndex === index;
            return (
              <div
                key={item.id || index}
                className="exp-card relative mb-10 last:mb-0 opacity-0"
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Timeline dot */}
                <div
                  className="exp-dot absolute -left-[37px] sm:-left-[45px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "#020307",
                    borderColor: isActive ? accent : "rgba(79,255,176,0.5)",
                    boxShadow: isActive
                      ? `0 0 20px ${accent}90, 0 0 8px ${accent}60, 0 0 40px ${accent}20`
                      : "0 0 8px rgba(79,255,176,0.2)",
                    transform: isActive ? "scale(1.3)" : "scale(1)",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? accent : "rgba(79,255,176,0.8)",
                      boxShadow: isActive ? `0 0 8px ${accent}` : "none",
                    }}
                  />
                </div>

                {/* Year chip */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? `${accent}18` : "rgba(255,255,255,0.03)",
                      color: isActive ? accent : "rgba(255,255,255,0.3)",
                      border: `1px solid ${isActive ? accent + "35" : "rgba(255,255,255,0.06)"}`,
                      boxShadow: isActive ? `0 0 12px ${accent}30` : "none",
                    }}
                  >
                    <Calendar size={10} />
                    {item.start_date} – {item.end_date || "Present"}
                  </span>
                </div>

                {/* Card */}
                <motion.div
                  className="rounded-2xl border p-5 sm:p-6 backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: isActive ? `${accent}06` : "rgba(255,255,255,0.01)",
                    borderColor: isActive ? `${accent}30` : "rgba(255,255,255,0.05)",
                    boxShadow: isActive ? `0 8px 40px rgba(0,0,0,0.4), 0 0 20px ${accent}10` : "none",
                  }}
                  animate={{ x: isActive ? 4 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3
                        className="text-white font-bold text-base sm:text-lg leading-tight transition-colors duration-300"
                        style={{ color: isActive ? "white" : "rgba(255,255,255,0.9)" }}
                      >
                        {item.position}
                      </h3>
                      <p
                        className="text-xs font-semibold mt-1 flex items-center gap-1.5"
                        style={{ color: isActive ? accent : "#4FFFB0" }}
                      >
                        <Briefcase size={10} />
                        {item.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>

                  {/* Animated bottom line */}
                  <div
                    className="mt-4 h-px transition-all duration-700 ease-out"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, transparent)`,
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
