import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Download, X, User, Phone, Mail, Globe, MapPin, Briefcase } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function VCardModal() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Abdikadir Kosar Osman
TITLE:AI Engineer & Full Stack Developer
EMAIL;TYPE=INTERNET,WORK:abdikadirkosara@gmail.com
TEL;TYPE=CELL,VOICE:+252634825481
URL;TYPE=WORK:https://abdikadirkosar.dev
ADR;TYPE=WORK:;;Hargeisa;Somaliland;;;
NOTE:Technical Architect specializing in C# Enterprise Systems, React 19, Python, & AI Pipelines.
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Abdikadir_Kosar.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/30 hover:bg-[#4FFFB0]/10 transition-all duration-300 cursor-pointer font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        title="Digital Business Card & QR Code"
      >
        <QrCode size={14} className="text-[#4FFFB0]" />
        <span>vCard QR</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm rounded-2xl border border-[#4FFFB0]/30 bg-[#0d0d12] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white font-sans text-center relative overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>

              {/* Avatar & Title */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src="/Photos/image copy 2.png"
                  alt="Abdikadir Kosar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#4FFFB0] shadow-[0_0_20px_rgba(79,255,176,0.3)] mb-2"
                />
                <h3 className="text-base font-bold text-white font-mono">Abdikadir Kosar Osman</h3>
                <p className="text-xs text-[#4FFFB0] font-mono">AI Engineer & Full-Stack Architect</p>
              </div>

              {/* SVG QR Code */}
              <div className="p-3 rounded-2xl bg-white flex items-center justify-center mx-auto w-48 h-48 shadow-lg mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="25" height="25" fill="#0d0d12" />
                  <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                  <rect x="11" y="11" width="13" height="13" fill="#0d0d12" />

                  <rect x="70" y="5" width="25" height="25" fill="#0d0d12" />
                  <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                  <rect x="76" y="11" width="13" height="13" fill="#0d0d12" />

                  <rect x="5" y="70" width="25" height="25" fill="#0d0d12" />
                  <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                  <rect x="11" y="76" width="13" height="13" fill="#0d0d12" />

                  {/* Decorative QR Data Grid Blocks */}
                  <rect x="35" y="10" width="8" height="8" fill="#059669" />
                  <rect x="48" y="10" width="8" height="8" fill="#0d0d12" />
                  <rect x="10" y="35" width="8" height="8" fill="#0d0d12" />
                  <rect x="22" y="35" width="8" height="8" fill="#059669" />
                  <rect x="35" y="35" width="12" height="12" fill="#0d0d12" />
                  <rect x="55" y="35" width="8" height="8" fill="#059669" />
                  <rect x="70" y="35" width="12" height="8" fill="#0d0d12" />
                  <rect x="35" y="55" width="12" height="8" fill="#0d0d12" />
                  <rect x="55" y="55" width="15" height="15" fill="#059669" />
                  <rect x="75" y="55" width="15" height="15" fill="#0d0d12" />
                  <rect x="35" y="75" width="15" height="15" fill="#059669" />
                  <rect x="55" y="75" width="15" height="15" fill="#0d0d12" />
                </svg>
              </div>

              <p className="text-[11px] text-white/50 font-mono mb-4">
                {lang === "SO" ? "Scan sii QR code-ka ama soo deoso vCard-ka halkan" : "Scan QR code to save contact or download vCard directly"}
              </p>

              {/* Download vCard Button */}
              <button
                onClick={handleDownloadVCard}
                className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(5,150,105,0.4)]"
              >
                <Download size={14} />
                <span>Download vCard Contact (.vcf)</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
