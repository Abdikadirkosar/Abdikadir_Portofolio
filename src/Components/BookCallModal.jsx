import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Video, User, Mail, MessageSquare, CheckCircle, X, Sparkles, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { safeQuery } from "../lib/supabase";
import { toast } from "react-toastify";

const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "07:00 PM"];
const topics = [
  "Full-Stack Web App Development",
  "Custom AI Agent & RAG Pipeline",
  "Mobile / Desktop Enterprise System",
  "Cloud Architecture & Consultation"
];

export default function BookCallModal({ triggerClassName, buttonText }) {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[1]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [duration, setDuration] = useState("30 Min");
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedDate) {
      toast.error(lang === "SO" ? "Fadhlan buuxi taariikhda, magacaaga iyo emailkaaga." : "Please fill in date, name, and email.");
      return;
    }

    setSubmitting(true);
    const messageText = `[BOOKING CALL REQUEST] Topic: ${selectedTopic} | Date: ${selectedDate} | Time: ${selectedSlot} (${duration}) | Notes: ${formData.notes}`;

    await safeQuery((sb) =>
      sb.from("db_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          message: messageText,
        }
      ])
    ).catch(() => {});

    setSubmitting(false);
    setCompleted(true);
    toast.success(lang === "SO" ? "Ballantii waa la duubay! Abdikadir wuu kuu soo jawaabi doonaa." : "Discovery Call Scheduled! Abdikadir will confirm via email.");
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setCompleted(false);
    setStep(1);
    setFormData({ name: "", email: "", notes: "" });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={triggerClassName || "px-3 py-1.5 rounded-full bg-[#4FFFB0]/15 border border-[#4FFFB0]/40 text-[#4FFFB0] hover:bg-[#4FFFB0]/25 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(79,255,176,0.2)]"}
      >
        <Video size={14} />
        <span>{buttonText || (lang === "SO" ? "Wada Hadal 15-Min" : "Book Discovery Call")}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-2xl border border-[#4FFFB0]/30 bg-[#0d0d12] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white font-sans overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4FFFB0]/20 border border-[#4FFFB0]/40 flex items-center justify-center text-[#4FFFB0]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono text-white">
                      {lang === "SO" ? "Dalbo Wada Hadal (Book Consultation)" : "Book 1-on-1 Discovery Call"}
                    </h3>
                    <p className="text-xs text-white/50 font-mono">
                      {lang === "SO" ? "Kulan 15-30 Min oo ku saabsan mashruucaaga" : "Schedule a 15 or 30-min strategy session with Abdikadir"}
                    </p>
                  </div>
                </div>
                <button onClick={resetAndClose} className="p-1 text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {!completed ? (
                <form onSubmit={handleBook} className="space-y-4">
                  {/* Topic Selection */}
                  <div>
                    <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-1.5">
                      1. {lang === "SO" ? "MAWDUUCA MASHRUUCA" : "SELECT DISCUSSION TOPIC"}
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4FFFB0]"
                    >
                      {topics.map((t, idx) => (
                        <option key={idx} value={t} className="bg-[#0d0d12] text-white">{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Duration Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-1.5">
                        2. {lang === "SO" ? "TAARIIKHDA" : "PREFERRED DATE"}
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4FFFB0]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-1.5">
                        3. {lang === "SO" ? "WAKHTIGA KULANKA" : "DURATION"}
                      </label>
                      <div className="flex gap-2">
                        {["15 Min", "30 Min"].map((d) => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setDuration(d)}
                            className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                              duration === d ? "bg-[#059669] border-[#10B981] text-white font-bold" : "bg-white/5 border-white/10 text-white/60"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="text-xs font-mono font-semibold text-[#4FFFB0] block mb-1.5">
                      4. {lang === "SO" ? "SACAADDA (TIME SLOT)" : "SELECT TIME SLOT"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? "bg-[#059669] border-[#10B981] text-white font-bold shadow-[0_0_12px_rgba(5,150,105,0.4)]"
                              : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      required
                      placeholder={lang === "SO" ? "Magacaaga Buuxa" : "Your Full Name"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#4FFFB0]"
                    />
                    <input
                      type="email"
                      required
                      placeholder={lang === "SO" ? "Email-kaaga" : "Your Email Address"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#4FFFB0]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                  >
                    <Send size={14} />
                    <span>{submitting ? "Booking..." : (lang === "SO" ? "Xaqiiji Ballanta" : "Confirm Discovery Call")}</span>
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#059669]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {lang === "SO" ? "Ballantii Waa La Duubay!" : "Call Successfully Scheduled!"}
                  </h4>
                  <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                    {lang === "SO"
                      ? `Waad mahadsan tahay ${formData.name}! Abdikadir wuxuu e-mail-kaaga (${formData.email}) uga soo diri doonaa Google Meet Link ${selectedDate} markay tahay ${selectedSlot}.`
                      : `Thank you ${formData.name}! Abdikadir will email you (${formData.email}) a Google Meet invite for ${selectedDate} at ${selectedSlot}.`}
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
