import React, { useEffect, useState } from "react";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { safeQuery } from "../lib/supabase";
import ThreeDTilt from "../Components/ThreeDTilt";
import { useSectionGSAP } from "../hooks/useSectionGSAP";

const defaultEducation = [
  {
    university: "New Generation University — Gabiley, Somaliland",
    degree: "Bachelor of Science in Computer Science & Information Technology",
    department: "Department of Computing & Digital Innovation",
    year: "2023 — Present",
    gpa: "Grade: A — Active",
    accentColor: "#4FFFB0",
    icon: "GraduationCap",
  },
  {
    university: "DeepLearning.AI / Stanford Online",
    degree: "Professional Certificate — Deep Learning Specialization",
    department: "Neural Networks, CNNs, RNNs, Transformers",
    year: "2022",
    gpa: "Top 3% of Cohort",
    accentColor: "#a855f7",
    icon: "BookOpen",
  },
];

const iconMap = {
  GraduationCap,
  BookOpen,
  Award,
};

const Education = () => {
  const [edu, setEdu] = useState(defaultEducation);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    const fetchEdu = async () => {
      const { data } = await safeQuery(sb => sb.from("db_education").select("*").order("created_at", { ascending: false }));
      if (data && data.length > 0) {
        setEdu(data);
      }
    };
    fetchEdu();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="Education"
      className="relative min-h-[70vh] px-4 sm:px-6 py-24 overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 60%, rgba(168,85,247,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(79,255,176,0.04) 0%, transparent 50%)"
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
            <span className="hud-badge">education.system</span>
          </motion.div>

          <h2 className="gsap-title text-4xl md:text-5xl font-black flex gap-3 justify-center flex-wrap">
            <span className="heading-premium gsap-word">Education</span>
            <span className="heading-italic gsap-word">&amp; Credentials</span>
          </h2>

          <p className="gsap-desc text-white/35 text-sm mt-4 max-w-sm mx-auto opacity-0 leading-relaxed">
            A summary of my formal education and academic credentials.
          </p>
        </div>

        {/* Grid layout */}
        <div className="gsap-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {edu.map((item, index) => {
            const accent = item.accentColor || "#4FFFB0";
            const IconComp = iconMap[item.icon] || GraduationCap;
            return (
              <motion.div
                key={item.id || index}
                className="h-full opacity-0"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <ThreeDTilt
                  className="rounded-2xl border border-white/[0.05] bg-[#0d0d0d] p-6 relative group h-full flex flex-col"
                  maxTilt={7}
                  scale={1.025}
                  accentColor={accent}
                >
                  {/* Top background glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% -10%, ${accent}12 0%, transparent 65%)`,
                    }}
                  />

                  {/* Index */}
                  <span className="absolute top-4 right-5 text-[10px] font-mono text-white/12 tracking-widest">
                    0{index + 1}
                  </span>

                  {/* Icon + title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${accent}12`, borderColor: `${accent}25`, color: accent }}
                    >
                      <IconComp size={22} />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-white font-bold text-base leading-snug">
                        {item.university}
                      </h3>
                      <p className="text-white/35 text-[10px] uppercase tracking-wider mt-1 font-mono">
                        {item.department}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px mb-4"
                    style={{ background: `linear-gradient(90deg, ${accent}25, transparent)` }}
                  />

                  {/* Degree */}
                  <p className="text-white/85 text-sm font-semibold leading-snug flex-1 mb-4">
                    {item.degree}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/35">
                      <Calendar size={10} style={{ color: accent }} />
                      {item.year}
                    </span>
                    {item.gpa && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-lg"
                        style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}
                      >
                        <Award size={10} />
                        {item.gpa}
                      </span>
                    )}
                  </div>

                  {/* Bottom line on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"
                    style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
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

export default Education;
