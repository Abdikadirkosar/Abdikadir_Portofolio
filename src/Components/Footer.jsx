import { motion } from "framer-motion";
import { LuGithub, LuMail } from "react-icons/lu";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { safeQuery } from "../lib/supabase";

const navLinks = [
  { label: "Home",         target: "Home" },
  { label: "About",        target: "About" },
  { label: "Services",     target: "Services" },
  { label: "Skills",       target: "Skills" },
  { label: "Projects",     target: "Projects" },
  { label: "Experience",   target: "Experience" },
  { label: "Education",    target: "Education" },
  { label: "Certificates", target: "Certificates" },
  { label: "Blog",         target: "Blog" },
  { label: "Contact",      target: "Contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [prof, setProf] = useState(null);

  useEffect(() => {
    safeQuery((sb) => sb.from("db_profile").select("*").eq("id", 1).single())
      .then(({ data }) => { if (data) setProf(data); });
  }, []);

  const socials = [
    {
      icon: LuGithub,
      href: prof?.github || "https://github.com/abdikadirkosar",
      label: "GitHub",
    },
    {
      icon: LuMail,
      href: prof?.email ? `mailto:${prof.email}` : "mailto:abdikadirkosara@gmail.com",
      label: "Email",
    },
    {
      icon: FaLinkedinIn,
      href: prof?.linkedin || "https://linkedin.com/in/abdikadirkosar",
      label: "LinkedIn",
    },
    {
      icon: FaWhatsapp,
      href: prof?.phone ? `https://wa.me/${prof.phone.replace(/[^0-9]/g, '')}` : "https://wa.me/252634812030",
      label: "WhatsApp",
    },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#020307] border-t border-white/[0.05] overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px]"
        style={{
          background: "radial-gradient(ellipse, rgba(79,255,176,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">

        {/* ── Contact CTA Banner ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-8 mb-14 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(13,13,20,0.95) 0%, rgba(8,8,14,0.95) 100%)",
            border: "1px solid rgba(79,255,176,0.12)",
            boxShadow: "0 0 60px rgba(79,255,176,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Animated gradient corner glows */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(79,255,176,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", filter: "blur(20px)" }} />

          {/* Top shimmer line */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(79,255,176,0.5), transparent 95%)" }} />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(168,85,247,0.2), transparent 80%)" }} />

          {/* Sparkle decorations */}
          <motion.div
            className="pointer-events-none absolute top-4 right-24 text-[#4FFFB0]/30 text-lg hidden sm:block"
            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.div>
          <motion.div
            className="pointer-events-none absolute bottom-4 left-24 text-[#a855f7]/25 text-sm hidden sm:block"
            animate={{ rotate: [360, 180, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.div>

          <div className="relative z-10">
            <p className="text-xs font-mono tracking-[0.25em] mb-1.5 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FFFB0] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4FFFB0]" />
              </span>
              <span style={{ color: "rgba(79,255,176,0.7)" }}>Available for Work</span>
            </p>
            <h3 className="text-white text-xl font-black">Have a project in mind?</h3>
            <p className="text-white/30 text-sm mt-1 font-light">Let's build something great together.</p>
          </div>

          <div className="relative z-10 flex items-center gap-3.5 flex-wrap">
            {/* Contact Button */}
            <motion.button
              onClick={() => document.getElementById("Contact")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-full font-mono font-bold text-sm text-[#0A0A0A] cursor-pointer overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4FFFB0 0%, #34d399 100%)",
                boxShadow: "0 0 25px rgba(79,255,176,0.4), 0 0 50px rgba(79,255,176,0.15)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(79,255,176,0.6), 0 0 80px rgba(79,255,176,0.2)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              Contact Me →
            </motion.button>
          </div>
        </motion.div>

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="Abdikadir Logo" 
                className="h-8 w-8 object-cover rounded-full border border-white/10" 
              />
              <p className="text-2xl font-bold text-white">
                {prof?.name?.split(" ")[0] || "Abdikadir"}<span className="text-[#4FFFB0]">.</span>
              </p>
            </div>
            <p className="text-white/30 text-xs font-mono mt-1 tracking-widest uppercase">
              {prof?.job_title || "AI Engineer & Full Stack Dev"}
            </p>
            {prof?.location && (
              <p className="text-white/20 text-[10px] font-mono mt-1">📍 {prof.location}</p>
            )}
          </motion.div>

          {/* Nav links */}
          <motion.nav
            className="flex flex-wrap gap-x-6 gap-y-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.target)}
                className="text-white/35 hover:text-[#4FFFB0] text-sm font-mono transition-colors duration-300 uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </motion.nav>

          {/* Social icons */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/35 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/40 hover:bg-[#4FFFB0]/5 transition-all duration-300"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{}}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

        {/* Bottom row — 2 column */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/20 text-[10px] font-mono tracking-widest">
            © {year} {prof?.name || "Abdikadir Kosar Osman"}. All rights reserved.
          </p>
          <p className="text-white/15 text-[10px] font-mono tracking-wider">
            Built with{" "}
            <span className="text-[#4FFFB0]/50">React</span>
            {" "}&{" "}
            <span className="text-[#4FFFB0]/50">Framer Motion</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
