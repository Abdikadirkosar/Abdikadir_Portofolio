import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      onLogin();
    } else {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020307] flex items-center justify-center px-4 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(79,255,176,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,255,176,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,176,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 w-full max-w-md ${shaking ? "animate-shake" : ""}`}
      >
        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(79,255,176,0.08)",
                border: "1px solid rgba(79,255,176,0.2)",
                boxShadow: "0 0 30px rgba(79,255,176,0.1)",
              }}
            >
              <Shield size={28} className="text-[#4FFFB0]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-1">
              Admin<span className="text-[#4FFFB0]">.</span>
            </h1>
            <p className="text-white/30 text-sm font-mono tracking-wider">
              PORTFOLIO DASHBOARD
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm pl-10 pr-12 py-3.5 outline-none placeholder:text-white/20 focus:border-[#4FFFB0]/30 focus:bg-[#4FFFB0]/[0.03] transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 hover:border-[#4FFFB0]/50 transition-all duration-300 cursor-pointer"
              style={{ boxShadow: "0 0 20px rgba(79,255,176,0.05)" }}
            >
              Access Dashboard
            </motion.button>
          </form>

          {/* Back to portfolio */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/20 text-xs hover:text-white/50 transition-colors font-mono tracking-widest uppercase"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
