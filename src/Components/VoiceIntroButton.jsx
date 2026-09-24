import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mic } from "lucide-react";
import { soundFX } from "../lib/soundFX";

export default function VoiceIntroButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const handleToggleVoice = () => {
    soundFX.playClick();
    if (!supported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const introText =
        "Welcome! I am Abdikadir Kosar, a Full Stack Developer and AI Engineer based in Hargeisa. I build intelligent web systems, scalable backend architectures, and custom AI agents. Feel free to explore my projects or get in touch.";
      
      const utterance = new SpeechSynthesisUtterance(introText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Natural")) ||
                       voices.find(v => v.lang.startsWith("en"));
      if (engVoice) utterance.voice = engVoice;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={handleToggleVoice}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-mono font-medium transition-all duration-300 backdrop-blur-md cursor-pointer ${
        isPlaying
          ? "bg-[#4FFFB0]/15 border-[#4FFFB0] text-[#4FFFB0] shadow-[0_0_20px_rgba(79,255,176,0.3)]"
          : "bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:border-[#4FFFB0]/40 hover:bg-white/[0.06]"
      }`}
      title={isPlaying ? "Stop Voice Intro" : "Listen to 20-second Voice Intro"}
    >
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <Volume2 size={14} className="text-[#4FFFB0] animate-pulse" />
        ) : (
          <Mic size={14} className="text-[#4FFFB0]" />
        )}
      </div>

      <span>{isPlaying ? "Playing Intro..." : "Voice Intro (30s)"}</span>

      {/* Audio Waveform Bars when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-0.5 ml-1"
          >
            {[0.4, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-[#4FFFB0] rounded-full"
                animate={{
                  height: [4, 14 * h, 4],
                }}
                transition={{
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
