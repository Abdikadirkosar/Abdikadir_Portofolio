import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { safeQuery } from "../lib/supabase";
import { Send, Zap, Terminal, Sparkles, ArrowRight } from "lucide-react";

/* ─── Floating particle ─────────────────────────────────────── */
const Particle = ({ dark, i }) => {
  const colors = dark
    ? ["#4FFFB0", "#a855f7", "#38bdf8", "#fb923c"]
    : ["#059669", "#7c3aed", "#0284c7", "#ea580c"];
  const color = colors[i % colors.length];
  const size = 2 + Math.random() * 3;
  const x = Math.random() * 100;
  const dur = 8 + Math.random() * 12;
  const delay = Math.random() * 6;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, bottom: "-10px", width: size, height: size, backgroundColor: color, opacity: 0.5 }}
      animate={{ y: [0, -(400 + Math.random() * 300)], opacity: [0, 0.6, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
    />
  );
};

/* ─── Typewriter ─────────────────────────────────────────────── */
const words = ["build something great.", "collaborate.", "bring ideas to life.", "create impact."];
const Typewriter = ({ dark }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const full = words[idx];
    const speed = deleting ? 35 : 70;
    const timeout = setTimeout(() => {
      if (!deleting && text === full) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIdx((p) => (p + 1) % words.length);
      } else {
        setText(full.slice(0, deleting ? text.length - 1 : text.length + 1));
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);
  return (
    <span style={{ color: dark ? "#4FFFB0" : "#059669" }}>
      {text}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}>|</motion.span>
    </span>
  );
};

/* ─── Magnetic card ──────────────────────────────────────────── */
const MagneticCard = ({ children, dark, accent }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [3, -3]);
  const rotateY = useTransform(x, [-50, 50], [-3, 3]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const resetMouse = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="relative group rounded-2xl overflow-hidden cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [prof, setProf] = useState(null);
  const [focused, setFocused] = useState(null);
  const dark = true;
  const [sent, setSent] = useState(false);

  useEffect(() => {
    safeQuery(sb => sb.from("db_profile").select("*").eq("id", 1).single())
      .then(({ data }) => { if (data) setProf(data); });
  }, []);

  const contactItems = [
    { icon: <MdEmail />, label: "EMAIL", value: prof?.email || "abdikadirkosara@gmail.com", link: `mailto:${prof?.email || "abdikadirkosara@gmail.com"}`, accent: dark ? "#4FFFB0" : "#059669" },
    { icon: <FaGithub />, label: "GITHUB", value: (prof?.github || "github.com/abdikadirkosar").replace("https://", ""), link: prof?.github || "https://github.com/abdikadirkosar", accent: dark ? "#a855f7" : "#7c3aed" },
    { icon: <FaLinkedin />, label: "LINKEDIN", value: (prof?.linkedin || "linkedin.com/in/abdikadirkosar").replace("https://", ""), link: prof?.linkedin || "https://linkedin.com/in/abdikadirkosar", accent: dark ? "#38bdf8" : "#0284c7" },
    { icon: <FaWhatsapp />, label: "WHATSAPP", value: prof?.phone || "+252 63 4812030", link: prof?.phone ? `https://wa.me/${prof.phone.replace(/[^0-9]/g, "")}` : "https://wa.me/252634812030", accent: dark ? "#4ade80" : "#16a34a" },
  ];

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const email = formData.get("from_email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_mt5m909",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_8ucamhf",
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "jMGByHwDBu18FSXCt",
      );
      safeQuery(sb => sb.from("messages").insert([{ name, email, subject, message }]));
      setLoading(false);
      setSent(true);
      toast.success("Message sent successfully 🎉");
      formRef.current.reset();
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  /* ── Theme tokens ──────────────────────────────────────────── */
  const bg        = dark ? "#060609"        : "#f8fafc";
  const surface   = dark ? "#0d0d14"        : "#ffffff";
  const border    = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textMain  = dark ? "#ffffff"        : "#0f172a";
  const textSub   = dark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.5)";
  const accent    = dark ? "#4FFFB0"        : "#059669";
  const accentRgb = dark ? "79,255,176"    : "5,150,105";
  const inputBg   = dark ? "#0a0a10"        : "#f1f5f9";
  const inputText = dark ? "#ffffff"        : "#0f172a";
  const labelCol  = dark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.4)";

  const inputBase = `w-full border rounded-xl text-sm px-4 py-3.5 outline-none font-mono transition-all duration-300 resize-none placeholder:opacity-40`;
  const inputStyle = (f) => ({
    background: inputBg,
    color: inputText,
    borderColor: focused === f ? `rgba(${accentRgb},0.45)` : border,
    boxShadow: focused === f ? `0 0 0 3px rgba(${accentRgb},0.07), 0 0 18px rgba(${accentRgb},0.05)` : "none",
  });

  return (
    <section
      id="Contact"
      className="relative min-h-screen w-full px-4 sm:px-6 py-24 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* ── Particles ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 28 }, (_, i) => <Particle key={i} dark={dark} i={i} />)}
      </div>

      {/* ── Ambient blobs ──────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "5%", width: 420, height: 420, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(79,255,176,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)",
          filter: "blur(60px)" }}
      />
      <motion.div
        className="pointer-events-none absolute"
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(60px)" }}
      />

      {/* ── Grid texture (dark only) ───────────────────────────── */}
      {dark && (
        <div className="pointer-events-none absolute inset-0 opacity-[0.013]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">



        {/* ── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="hud-badge">
              <Sparkles size={11} />
              contact.system
              <Sparkles size={11} />
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black leading-tight tracking-tight"
            style={{ color: textMain }}
          >
            Let's{" "}
            <Typewriter dark={dark} />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-lg mx-auto text-sm leading-relaxed"
            style={{ color: textSub }}
          >
            Have a project, a question, or just want to say hello? I&apos;d love to hear from you — every great collaboration starts with a conversation.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="h-px max-w-xs mx-auto mt-8"
            style={{ background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.5), transparent)` }}
          />
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.75fr] gap-6">

          {/* ─── LEFT PANEL ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Terminal card */}
            <div className="rounded-2xl p-5 relative overflow-hidden transition-colors duration-500"
              style={{ border: `1px solid ${border}`, background: surface }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}99, transparent)` }} />
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <span className="text-[10px] font-mono tracking-widest ml-2" style={{ color: textSub }}>sys.contact_info</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs" style={{ color: textSub }}>
                <p>{"// Initializing secure channel..."}</p>
                <p><span style={{ color: dark ? "#a855f7" : "#7c3aed" }}>const</span> <span style={{ color: dark ? "#38bdf8" : "#0284c7" }}>engineer</span> = <span style={{ color: accent }}>&quot;Abdikadir&quot;</span>;</p>
                <p><span style={{ color: dark ? "#a855f7" : "#7c3aed" }}>const</span> <span style={{ color: dark ? "#38bdf8" : "#0284c7" }}>status</span> = <span style={{ color: dark ? "#4ade80" : "#16a34a" }}>&quot;available&quot;</span>;</p>
                <p><span style={{ color: dark ? "#a855f7" : "#7c3aed" }}>const</span> <span style={{ color: dark ? "#38bdf8" : "#0284c7" }}>response_time</span> = <span style={{ color: dark ? "#fb923c" : "#ea580c" }}>&quot;&lt; 24h&quot;</span>;</p>
                <p className="mt-2 opacity-50">{"// Channels open ↓"}</p>
              </div>
            </div>

            {/* Contact cards */}
            {contactItems.map((it, i) => (
              <MagneticCard key={it.label} dark={dark} accent={it.accent}>
                <motion.a
                  href={it.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 relative overflow-hidden transition-all duration-300"
                  style={{ border: `1px solid ${border}`, background: surface, borderRadius: 16 }}
                >
                  {/* Hover gradient bg */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${it.accent}08, transparent)` }} />

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${it.accent}14`, border: `1px solid ${it.accent}28`, color: it.accent }}>
                    {it.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-mono tracking-[0.2em] mb-0.5" style={{ color: `${it.accent}80` }}>{it.label}</p>
                    <p className="text-sm font-medium truncate" style={{ color: textMain }}>{it.value}</p>
                  </div>
                  <ArrowRight size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-60 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" style={{ color: it.accent }} />

                  {/* Bottom shimmer line */}
                  <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${it.accent}70, transparent)` }} />
                </motion.a>
              </MagneticCard>
            ))}

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-3 p-4 rounded-2xl transition-colors duration-500"
              style={{ border: `1px solid rgba(${accentRgb},0.2)`, background: `rgba(${accentRgb},0.04)` }}
            >
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: accent }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: accent }} />
              </span>
              <p className="text-xs leading-snug" style={{ color: textSub }}>
                Currently <span className="font-semibold" style={{ color: accent }}>available for hire</span> — open to freelance &amp; full-time
              </p>
            </motion.div>
          </motion.div>

          {/* ─── RIGHT: FORM ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-colors duration-500"
            style={{ border: `1px solid ${border}`, background: surface }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }} />

            {/* Corner glow */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full"
              style={{ background: `radial-gradient(circle, rgba(${accentRgb},0.1) 0%, transparent 70%)`, filter: "blur(20px)" }} />

            {/* Form header */}
            <div className="flex items-center gap-2 mb-8">
              <Zap size={14} style={{ color: accent }} />
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: textSub }}>compose_message.exe</span>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-20 gap-5 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="text-5xl"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-2xl font-black" style={{ color: textMain }}>Message Sent!</h3>
                  <p className="text-sm" style={{ color: textSub }}>I'll get back to you within 24 hours.</p>
                  <div className="h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={sendEmail}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[.2em] font-mono" style={{ color: labelCol }}>Name</label>
                      <input
                        name="name" type="text" placeholder="Your name" required
                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                        className={inputBase}
                        style={inputStyle("name")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[.2em] font-mono" style={{ color: labelCol }}>Email</label>
                      <input
                        name="from_email" type="email" placeholder="your@email.com" required
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                        className={inputBase}
                        style={inputStyle("email")}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[.2em] font-mono" style={{ color: labelCol }}>Subject</label>
                    <div className="relative">
                      <select
                        name="subject" defaultValue="" required
                        onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                        className={`${inputBase} appearance-none pr-10`}
                        style={inputStyle("subject")}
                      >
                        <option disabled value="">Select a topic...</option>
                        <option>Freelance project</option>
                        <option>Full-time opportunity</option>
                        <option>Collaboration</option>
                        <option>Just saying hi 👋</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: textSub }}>▾</div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[.2em] font-mono" style={{ color: labelCol }}>Message</label>
                    <textarea
                      name="message" rows={5} placeholder="Tell me about your project or idea..." required
                      onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                      className={`${inputBase} leading-relaxed`}
                      style={inputStyle("message")}
                    />
                  </div>

                  <div className="h-px -mx-2" style={{ background: border }} />

                  {/* Submit row */}
                  <div className="flex items-center gap-4 pt-1">
                    {/* ── SEND BUTTON ── */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="relative overflow-hidden flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-mono font-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${dark ? "#00d9ff" : "#34d399"})`,
                        color: dark ? "#050a07" : "#ffffff",
                        boxShadow: `0 0 20px rgba(${accentRgb},0.3), 0 4px 15px rgba(${accentRgb},0.2)`,
                      }}
                    >
                      {/* Shimmer sweep */}
                      <motion.span
                        className="absolute inset-0 -skew-x-12"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)" }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                      />
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    <span className="text-[11px] font-mono" style={{ color: textSub }}>
                      Response &lt; 24h
                    </span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Bottom decorative strip ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex flex-wrap gap-8 justify-center items-center"
        >
          {["Available Worldwide", "Remote Friendly", "Quick Response", "Passionate Builder"].map((tag, i) => (
            <motion.div
              key={tag}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
              style={{ color: textSub }}
            >
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent, opacity: 0.7 }} />
              {tag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
