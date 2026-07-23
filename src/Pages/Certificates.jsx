import React, { useEffect, useState } from "react";
import { Award, Calendar, ExternalLink, FileText, X, Shield, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { safeQuery } from "../lib/supabase";
import ThreeDTilt from "../Components/ThreeDTilt";
import { useSectionGSAP } from "../hooks/useSectionGSAP";

// ── Default certificates ───────────────────────────────────────────────────────
const defaultCertificates = [
  {
    id: 1,
    name: "Deep Learning Specialization (5 Courses)",
    issuer: "DeepLearning.AI / Coursera",
    issue_date: "2023",
    credential_url: "https://www.coursera.org/specializations/deep-learning",
    pdf_url: "",
    image_url: "",
  },
  {
    id: 2,
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (Facebook)",
    issue_date: "2023",
    credential_url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    pdf_url: "",
    image_url: "",
  },
  {
    id: 3,
    name: "Full Stack Open — University of Helsinki",
    issuer: "University of Helsinki",
    issue_date: "2023",
    credential_url: "https://fullstackopen.com/en",
    pdf_url: "",
    image_url: "",
  },
  {
    id: 4,
    name: "LangChain & Vector Databases in Production",
    issuer: "Activeloop / DeepLearning.AI",
    issue_date: "2024",
    credential_url: "https://learn.activeloop.ai/courses/langchain",
    pdf_url: "",
    image_url: "",
  },
];

// ── Issuer → accent color map ─────────────────────────────────────────────────
const ISSUER_ACCENT = {
  "Amazon Web Services": "#fb923c",
  "AWS": "#fb923c",
  "Google": "#4FFFB0",
  "Google Cloud": "#4FFFB0",
  "Microsoft": "#38bdf8",
  "Meta": "#818cf8",
  "DeepLearning": "#a855f7",
  "Coursera": "#3b82f6",
  "University": "#ec4899",
  "Udemy": "#f472b6",
  "Activeloop": "#fb923c",
  "Default": "#4FFFB0",
};

const getAccent = (issuer = "") => {
  const match = Object.keys(ISSUER_ACCENT).find((k) => issuer.toLowerCase().includes(k.toLowerCase()));
  return ISSUER_ACCENT[match] || ISSUER_ACCENT.Default;
};

// ── Image Preview Modal ───────────────────────────────────────────────────────
const ImageModal = ({ cert, onClose }) => {
  const accent = getAccent(cert.issuer);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" />
      <motion.div
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden z-10"
        style={{ background: "#0d0d0d", borderColor: `${accent}25` }}
        initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />

        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white bg-black/40 backdrop-blur-sm transition-all">
          <X size={14} />
        </button>

        {/* Image */}
        {cert.image_url ? (
          <img src={cert.image_url} alt={cert.name} className="w-full object-contain max-h-80 bg-black" />
        ) : (
          <div className="w-full h-52 flex flex-col items-center justify-center gap-3" style={{ background: `${accent}08` }}>
            <BadgeCheck size={52} style={{ color: `${accent}60` }} />
            <p className="text-white/30 text-sm font-mono">No certificate image uploaded</p>
          </div>
        )}

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck size={14} style={{ color: accent }} />
            <span className="text-[11px] font-mono" style={{ color: accent }}>{cert.issuer}</span>
          </div>
          <h3 className="text-white font-bold text-base mb-4 leading-snug">{cert.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {cert.credential_url && (
              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-mono font-bold transition-all duration-300"
                style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}>
                Verify Credential <ExternalLink size={11} />
              </a>
            )}
            {cert.pdf_url && (
              <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-mono font-bold text-white/60 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                View PDF <FileText size={11} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Certificate Card ──────────────────────────────────────────────────────────
const CertCard = ({ item, index, onClick }) => {
  const accent = getAccent(item.issuer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <ThreeDTilt
        className="rounded-2xl border bg-[#0d0d0d] p-6 relative group cursor-pointer flex flex-col justify-between h-full"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
        maxTilt={7}
        accentColor={accent}
        onClick={onClick}
      >
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}70, transparent)` }} />

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accent}08 0%, transparent 65%)` }} />

        <div>
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
              <Award size={18} style={{ color: accent }} />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/35">
              <Calendar size={10} style={{ color: accent }} />
              {item.issue_date}
            </div>
          </div>

          {/* Issuer badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <Shield size={10} style={{ color: `${accent}80` }} />
            <span className="text-[10px] font-mono" style={{ color: `${accent}80` }}>{item.issuer}</span>
          </div>

          {/* Name */}
          <h3 className="text-white font-bold text-[14px] leading-snug mb-4 transition-colors duration-300 group-hover:text-white line-clamp-2">
            {item.name}
          </h3>
        </div>

        {/* Preview thumbnail if image exists */}
        {item.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden border border-white/[0.05] h-28">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 border-t pt-4 mt-2" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {item.credential_url && (
            <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold font-mono uppercase transition-all duration-300"
              style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}10`; }}>
              Verify <ExternalLink size={10} />
            </a>
          )}
          {item.pdf_url && (
            <a href={item.pdf_url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold font-mono uppercase bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
              PDF <FileText size={10} />
            </a>
          )}
          {/* Click to preview */}
          {item.image_url && (
            <button
              className="px-3 py-2 rounded-lg text-[10px] font-bold font-mono uppercase transition-all duration-300"
              style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent }}>
              Preview
            </button>
          )}
        </div>

        {/* Bottom trace line */}
        <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      </ThreeDTilt>
    </motion.div>
  );
};

// ── Main Certificates Component ───────────────────────────────────────────────
const Certificates = () => {
  const [certs, setCerts] = useState(defaultCertificates);
  const [selectedCert, setSelectedCert] = useState(null);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    safeQuery((sb) =>
      sb.from("db_certificates").select("*").order("created_at", { ascending: false })
    ).then(({ data }) => {
      if (data && data.length > 0) setCerts(data);
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="Certificates"
      className="relative py-28 px-4 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-4">
            <span className="hud-badge">certificates.system</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 flex gap-3 justify-center flex-wrap">
            <span className="heading-premium">Certificates</span>
            <span className="heading-italic">&amp; Badges</span>
          </h2>
          <p className="text-white/35 text-sm max-w-sm mx-auto leading-relaxed">
            Professional credentials that validate my expertise across AI, cloud, and full-stack development.
          </p>
          <div className="h-px w-24 mx-auto mt-6 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #4FFFB0, transparent)" }} />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {certs.map((item, index) => (
            <CertCard
              key={item.id || index}
              item={item}
              index={index}
              onClick={() => setSelectedCert(item)}
            />
          ))}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <ImageModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
