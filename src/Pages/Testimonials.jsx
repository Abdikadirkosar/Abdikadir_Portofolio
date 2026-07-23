import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import { useSectionGSAP } from "../hooks/useSectionGSAP";

// ── Default testimonials (shown when DB is empty) ─────────────────────────────
const defaultTestimonials = [
  {
    id: 1,
    client_name: "Ahmed Al-Rashid",
    company: "NovaTech Solutions, Dubai",
    review:
      "Abdikadir delivered a world-class AI attendance system that transformed how we manage 500+ employees. His technical depth in computer vision and ability to communicate complex solutions clearly made him stand out. The system exceeded every requirement — on time and on budget.",
    rating: 5,
    photo_url: "",
  },
  {
    id: 2,
    client_name: "Dr. Fathia Hassan",
    company: "SomTech Institute, Hargeisa",
    review:
      "The LLM-powered knowledge base Abdikadir built for us handles thousands of queries daily in Arabic, English, and Somali. Exceptional engineering quality. He brings both AI expertise and rare product thinking — a combination that's very hard to find.",
    rating: 5,
    photo_url: "",
  },
  {
    id: 3,
    client_name: "James Okonkwo",
    company: "Meridian Logistics, Lagos",
    review:
      "We hired Abdikadir to build our enterprise ERP and it now processes over 8,000 shipments daily. His React + Django stack knowledge is elite-level. He anticipated problems before they happened and delivered a system that feels built for scale.",
    rating: 5,
    photo_url: "",
  },
  {
    id: 4,
    client_name: "Sara Lundgren",
    company: "Nordic Digital, Stockholm",
    review:
      "Abdikadir's work on our analytics dashboard was flawless. Sub-200ms queries on 50M+ rows. He is self-directed, communicates proactively, and writes clean, documented code. I would work with him on any project without hesitation.",
    rating: 5,
    photo_url: "",
  },
  {
    id: 5,
    client_name: "Mohamed Abdi Warsame",
    company: "Dahabshiil Group, Djibouti",
    review:
      "Our mobile banking platform needed both speed and security. Abdikadir delivered beyond expectations — $2M+ monthly volume processed with sub-100ms latency and zero security incidents in 14 months. A true professional.",
    rating: 5,
    photo_url: "",
  },
];

// ── Star rating display ───────────────────────────────────────────────────────
const StarRating = ({ rating = 5, color = "#4FFFB0" }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < rating ? color : "transparent"}
        stroke={i < rating ? color : "rgba(255,255,255,0.2)"}
      />
    ))}
  </div>
);

// ── Avatar fallback ───────────────────────────────────────────────────────────
const Avatar = ({ name = "", photoUrl = "", accent = "#4FFFB0" }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover border-2"
        style={{ borderColor: `${accent}50` }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
      style={{ background: accent }}
    >
      {initials}
    </div>
  );
};

// ── Accent colors per card ────────────────────────────────────────────────────
const ACCENTS = ["#4FFFB0", "#818cf8", "#f472b6", "#38bdf8", "#fb923c"];

// ── Main Testimonials Component ───────────────────────────────────────────────
const Testimonials = () => {
  const [items, setItems] = useState(defaultTestimonials);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    safeQuery((sb) =>
      sb.from("db_testimonials").select("*").order("created_at", { ascending: false })
    ).then(({ data }) => {
      if (data && data.length > 0) setItems(data);
    });
  }, []);

  const go = (dir) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + items.length) % items.length);
  };

  // Auto-play — advances every 5 s, pauses on hover
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [paused, items.length, active]);

  const current = items[active];
  const accent = ACCENTS[active % ACCENTS.length];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.96 }),
  };

  return (
    <section
      id="Testimonials"
      ref={sectionRef}
      className="relative py-28 px-4 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse, ${accent}08 0%, transparent 70%)`, filter: "blur(80px)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono tracking-[0.25em] text-white/30 uppercase mb-4">
            — Client Feedback —
          </p>
          <h2 className="heading text-4xl lg:text-5xl font-black text-white">
            WHAT CLIENTS <span style={{ color: accent }}>SAY</span>
          </h2>
          <div
            className="h-px w-24 mx-auto mt-5 rounded-full transition-all duration-700"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
        </motion.div>

        {/* Main card */}
        <div
          className="relative min-h-[320px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border p-8 lg:p-12 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0d0d0d 0%, #0a0a0a 100%)",
                borderColor: `${accent}20`,
                boxShadow: `0 0 60px ${accent}08, inset 0 1px 0 ${accent}10`,
              }}
            >
              {/* Top-edge shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}60, transparent 90%)` }}
              />

              {/* Quote icon */}
              <Quote
                size={48}
                className="absolute top-8 right-10 opacity-[0.06]"
                style={{ color: accent }}
              />

              {/* Review text */}
              <p className="text-white/75 text-base lg:text-lg leading-relaxed font-light mb-10 relative z-10 max-w-3xl">
                "{current.review}"
              </p>

              {/* Author row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={current.client_name} photoUrl={current.photo_url} accent={accent} />
                  <div>
                    <p className="text-white font-bold text-sm">{current.client_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Building2 size={11} className="text-white/30" />
                      <p className="text-white/40 text-[12px] font-mono">{current.company}</p>
                    </div>
                    <div className="mt-1.5">
                      <StarRating rating={current.rating} color={accent} />
                    </div>
                  </div>
                </div>

                {/* Counter */}
                <span
                  className="font-mono text-[11px] tracking-widest px-3 py-1.5 rounded-full border"
                  style={{ color: accent, borderColor: `${accent}30`, background: `${accent}08` }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <motion.button
            onClick={() => go(-1)}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 24 : 6,
                  height: 6,
                  background: i === active ? accent : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          <motion.button
            onClick={() => go(1)}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
