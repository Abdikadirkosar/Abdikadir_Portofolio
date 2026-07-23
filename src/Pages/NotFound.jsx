import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ThreeDTilt from "../Components/ThreeDTilt";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4FFFB0]/5 filter blur-[100px] pointer-events-none" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-md w-full text-center relative z-10">
        {/* 3D Tilt Card containing 404 */}
        <ThreeDTilt
          className="rounded-3xl border border-white/[0.06] bg-[#0d0d0d]/80 p-10 backdrop-blur-md relative group select-none cursor-default"
          maxTilt={12}
          accentColor="#4FFFB0"
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.4), transparent)" }} />

          {/* Glare effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(79,255,176,0.06) 0%, transparent 65%)" }} />

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#4FFFB0]/30 tracking-widest"
          >
            404
          </motion.h1>

          <h2 className="text-white text-lg font-bold mt-4 tracking-wide uppercase">
            Page Not Found
          </h2>

          <p className="text-white/40 text-xs mt-3 leading-relaxed max-w-xs mx-auto">
            The page you are looking for does not exist or has been moved. Use the navigation buttons below to get back on track.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mt-8 relative z-20">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#4FFFB0] text-black border border-transparent shadow-[0_0_20px_rgba(79,255,176,0.2)] hover:shadow-[0_0_25px_rgba(79,255,176,0.35)] transition-all duration-300"
              >
                <Home size={12} /> Go Home
              </motion.button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <ArrowLeft size={12} /> Back
            </button>
          </div>

          {/* Bottom trace line */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
            style={{ background: "linear-gradient(90deg, #4FFFB0, transparent)" }} />
        </ThreeDTilt>
      </div>
    </div>
  );
};

export default NotFound;
