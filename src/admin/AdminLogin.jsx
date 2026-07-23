import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Eye, EyeOff, Terminal } from "lucide-react";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Login failed");
    } else {
      toast.success("Access granted!");
      navigate("/admin/dashboard");
    }
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 flex items-center justify-center">
              <Terminal size={18} className="text-[#4FFFB0]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Access</h1>
              <p className="text-white/30 text-[11px] font-mono tracking-widest uppercase">secure.dashboard.exe</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-[.2em] text-white/30 font-mono">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@yourdomain.com"
                  className="w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm pl-10 pr-4 py-3 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_3px_rgba(79,255,176,0.05)] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-[.2em] text-white/30 font-mono">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm pl-10 pr-12 py-3 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_3px_rgba(79,255,176,0.05)] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-white/[0.05] my-1" />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-mono font-bold text-black transition-all duration-300 disabled:opacity-50"
              style={{ background: loading ? "rgba(79,255,176,0.5)" : "#4FFFB0" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/20 text-[10px] font-mono mt-6">
            Abdikadir Portfolio — Admin Panel v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
