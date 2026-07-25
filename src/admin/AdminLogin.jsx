import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Eye, EyeOff, Terminal, Shield, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

// ── Send OTP via Telegram ─────────────────────────────────────────────────────
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const sendOTPTelegram = async (otp) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const msg = `🔐 *Admin Login OTP*\n\nYour one-time code: *${otp}*\n\n⏱ Expires in 5 minutes.\n_Do not share this code with anyone._`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
  });
};

// ── Step indicator ────────────────────────────────────────────────────────────
const Step = ({ n, label, active, done }) => (
  <div className={`flex items-center gap-2 text-[10px] font-mono transition-all duration-300 ${active ? "text-[#4FFFB0]" : done ? "text-white/40" : "text-white/15"}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${active ? "border-[#4FFFB0] bg-[#4FFFB0]/10" : done ? "border-white/20 bg-white/5" : "border-white/10"}`}>
      {done ? "✓" : n}
    </div>
    {label}
  </div>
);

// ── OTP Input ─────────────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const digits = (value + "______").slice(0, 6).split("");
  const inputRef = [];

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <div key={i} className={`w-11 h-14 rounded-xl border flex items-center justify-center text-xl font-black font-mono text-white transition-all duration-200 ${
          value.length === i ? "border-[#4FFFB0] shadow-[0_0_15px_rgba(79,255,176,0.2)]" : value.length > i ? "border-[#4FFFB0]/40 bg-[#4FFFB0]/5" : "border-white/[0.06] bg-white/[0.02]"
        }`}>
          {d !== "_" ? d : value.length === i ? <span className="w-0.5 h-6 bg-[#4FFFB0] animate-pulse" /> : ""}
        </div>
      ))}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute opacity-0 w-0 h-0"
        autoFocus
      />
    </div>
  );
};

// ── Main AdminLogin ───────────────────────────────────────────────────────────
const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1=credentials, 2=OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Step 1: verify credentials → send OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) { toast.error("Supabase is not configured."); return; }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast.error(error.message || "Login failed");
      return;
    }

    // Sign out immediately — must verify OTP first
    await supabase.auth.signOut();

    // Generate and send OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 min

    try {
      await sendOTPTelegram(newOtp);
      toast.success("✅ OTP sent to your Telegram!");
    } catch {
      toast.warning("Telegram OTP failed — using fallback");
      // Fallback: show in console for dev
      console.info(`[DEV] OTP: ${newOtp}`);
    }

    setLoading(false);
    setStep(2);
  };

  // Step 2: verify OTP → sign in
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setVerifying(true);

    if (Date.now() > otpExpiry) {
      toast.error("OTP expired. Please request a new one.");
      setVerifying(false);
      setStep(1);
      return;
    }

    if (otp !== generatedOtp) {
      toast.error("Incorrect OTP. Try again.");
      setOtp("");
      setVerifying(false);
      return;
    }

    // OTP correct — sign in for real
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setVerifying(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("🔐 2FA verified — Access granted!");
      navigate("/admin/dashboard");
    }
  };

  const resendOtp = async () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000);
    setOtp("");
    await sendOTPTelegram(newOtp);
    toast.success("New OTP sent to Telegram!");
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(79,255,176,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#0d0d14]/90 backdrop-blur-xl p-8 overflow-hidden">
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.6), transparent)" }} />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 flex items-center justify-center">
              {step === 1 ? <Terminal size={18} className="text-[#4FFFB0]" /> : <Shield size={18} className="text-[#4FFFB0]" />}
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Access</h1>
              <p className="text-white/30 text-[11px] font-mono tracking-widest uppercase">
                {step === 1 ? "secure.dashboard.exe" : "2fa.verification"}
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-4 mb-7 px-1">
            <Step n={1} label="Credentials" active={step === 1} done={step > 1} />
            <div className="flex-1 h-px bg-white/[0.06]" />
            <Step n={2} label="2FA Verify" active={step === 2} done={false} />
          </div>

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Email + Password ── */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[.2em] text-white/30 font-mono">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="admin@yourdomain.com"
                      className="w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm pl-10 pr-4 py-3 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_3px_rgba(79,255,176,0.05)] transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[.2em] text-white/30 font-mono">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="••••••••••••"
                      className="w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm pl-10 pr-12 py-3 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_3px_rgba(79,255,176,0.05)] transition-all duration-300"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/[0.05] my-1" />

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-mono font-bold text-black transition-all duration-300 disabled:opacity-50"
                  style={{ background: loading ? "rgba(79,255,176,0.5)" : "#4FFFB0" }}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Verifying...</>
                  ) : (
                    <><Lock size={14} /> Continue</>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* ── STEP 2: OTP Verification ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={22} className="text-[#a855f7]" />
                  </div>
                  <p className="text-white font-semibold text-sm">Check your Telegram</p>
                  <p className="text-white/30 text-xs mt-1">Enter the 6-digit code sent to your Telegram account</p>
                </div>

                {/* OTP boxes */}
                <div className="relative" onClick={() => document.querySelector('input[type="text"]')?.focus()}>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || verifying}
                  whileHover={{ scale: otp.length === 6 ? 1.02 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-mono font-bold text-black transition-all duration-300 disabled:opacity-40"
                  style={{ background: otp.length === 6 ? "#4FFFB0" : "rgba(79,255,176,0.2)", color: otp.length === 6 ? "black" : "rgba(79,255,176,0.5)" }}
                >
                  {verifying ? (
                    <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Verifying...</>
                  ) : (
                    <><Shield size={14} /> Verify &amp; Login</>
                  )}
                </motion.button>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <button onClick={() => { setStep(1); setOtp(""); }} className="text-white/25 hover:text-white/50 transition-colors flex items-center gap-1">
                    ← Back
                  </button>
                  <button onClick={resendOtp} className="text-[#4FFFB0]/50 hover:text-[#4FFFB0] transition-colors flex items-center gap-1">
                    <RotateCcw size={10} /> Resend OTP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-white/20 text-[10px] font-mono mt-6">
            Abdikadir Portfolio — Admin Panel v2.0 • 2FA Protected
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
