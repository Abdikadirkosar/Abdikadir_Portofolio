import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button after scrolling 300px
      setVisible(scrollY > 300);

      // Calculate progress percentage
      if (totalHeight > 0) {
        setProgress((scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG parameters
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition-all hover:border-[#4FFFB0]/50 hover:text-[#4FFFB0] hover:shadow-[0_0_20px_rgba(79,255,176,0.15)] cursor-pointer"
          aria-label="Scroll back to top"
        >
          {/* Progress circle */}
          <svg className="absolute -rotate-90 h-full w-full">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#4FFFB0"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-75"
            />
          </svg>

          {/* Arrow Icon */}
          <ArrowUp size={16} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
