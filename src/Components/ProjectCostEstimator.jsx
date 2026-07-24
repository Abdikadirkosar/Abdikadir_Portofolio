import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, X, Check, ArrowRight, DollarSign, Clock, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const serviceOptions = [
  { id: "webapp", name: "Full-Stack Web App", basePrice: 800, weeks: 2, icon: "💻" },
  { id: "ai", name: "Custom AI Agent / RAG Model", basePrice: 1200, weeks: 3, icon: "🤖" },
  { id: "mobile", name: "Responsive Mobile/Desktop App", basePrice: 700, weeks: 2, icon: "📱" },
  { id: "cloud", name: "Cloud & DevOps Infrastructure", basePrice: 500, weeks: 1, icon: "☁️" },
];

const addonOptions = [
  { id: "auth", name: "Authentication & User Roles", price: 150, weeks: 0.5 },
  { id: "payments", name: "Stripe/M-Pesa Payment Gateway", price: 200, weeks: 0.5 },
  { id: "analytics", name: "Real-Time Dashboard & Analytics", price: 250, weeks: 1 },
  { id: "support", name: "1-Month Maintenance & Support", price: 100, weeks: 0 },
];

export default function ProjectCostEstimator() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(serviceOptions[0]);
  const [selectedAddons, setSelectedAddons] = useState(["auth"]);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let price = selectedService.basePrice;
    let duration = selectedService.weeks;

    addonOptions.forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        price += addon.price;
        duration += addon.weeks;
      }
    });

    return { price, duration: Math.ceil(duration) };
  };

  const { price, duration } = calculateTotal();

  const handleContactWithQuote = () => {
    setIsOpen(false);
    const contactSection = document.getElementById("Contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Trigger Button - Sleek Compact Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#4FFFB0] hover:border-[#4FFFB0]/40 hover:bg-[#4FFFB0]/10 transition-all duration-300 cursor-pointer font-mono text-[11px] font-medium flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        title={lang === "SO" ? "Qiyaas Mashruucaaga (Quote Calculator)" : "Estimate Project Cost"}
      >
        <Calculator size={14} className="shrink-0 text-[#4FFFB0]" />
        <span className="hidden xl:inline">{lang === "SO" ? "Qiyaas Mashruuc" : "Get Quote"}</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-2xl border border-[#4FFFB0]/30 bg-[#0d0d12]/95 backdrop-blur-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden font-sans text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4FFFB0]/20 border border-[#4FFFB0]/30 flex items-center justify-center text-[#4FFFB0]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono">
                      {lang === "SO" ? "Xisaabiyaha Qiyaasta Mashruuca" : "Project Scope & Cost Estimator"}
                    </h3>
                    <p className="text-xs text-white/40 font-mono">
                      {lang === "SO" ? "Dooro nooca mashruuca iyo sifooyinka aad rabto" : "Select your project type and features to estimate scope"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Service Selection */}
              <div className="mb-6">
                <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-2">
                  1. {lang === "SO" ? "DOORO NOOCA MASHRUUCA" : "SELECT PRIMARY SERVICE"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {serviceOptions.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selectedService.id === srv.id
                          ? "bg-[#059669] border-[#10B981] text-white font-bold shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <span className="text-lg">{srv.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">{srv.name}</div>
                        <div className="text-[10px] text-white/70 font-mono">From ${srv.basePrice}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons Selection */}
              <div className="mb-6">
                <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-2">
                  2. {lang === "SO" ? "SIFOOYINKA DHEERIGA AH (ADD-ONS)" : "SELECT FEATURE ADD-ONS"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {addonOptions.map((addon) => {
                    const active = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          active
                            ? "bg-[#059669] border-[#10B981] text-white font-bold shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                        }`}
                      >
                        <span className="text-xs text-white font-medium">{addon.name}</span>
                        <span className={`text-[10px] font-mono ${active ? "text-emerald-100 font-bold" : "text-[#4FFFB0]"}`}>+$ {addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculation Summary Footer */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[10px] font-mono text-white/50 block">ESTIMATED PRICE</span>
                    <span className="text-xl font-bold font-mono text-[#4FFFB0]">${price} USD</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 block">ESTIMATED DURATION</span>
                    <span className="text-xl font-bold font-mono text-white">~{duration} Weeks</span>
                  </div>
                </div>

                <button
                  onClick={handleContactWithQuote}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                >
                  <span className="text-white font-bold">{lang === "SO" ? "Soo Dir Qiyaastan" : "Submit Scope to Abdikadir"}</span>
                  <ArrowRight size={15} className="text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
