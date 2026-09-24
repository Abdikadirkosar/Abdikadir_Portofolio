import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, CheckCircle2, User, Building, MessageSquare, Image } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import { soundFX } from "../lib/soundFX";

export default function LeaveReviewModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    client_name: "",
    position: "",
    company: "",
    feedback: "",
    rating: 5,
    photo_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client_name || !form.feedback) return;

    soundFX.playPop();
    setLoading(true);

    try {
      await safeQuery((sb) =>
        sb.from("testimonials").insert([
          {
            client_name: form.client_name,
            position: form.position || "Client",
            company: form.company || "Independent",
            feedback: form.feedback,
            rating: form.rating,
            photo_url: form.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            approved: false, // Requires admin review
          },
        ])
      );

      soundFX.playSuccess();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setForm({
          client_name: "",
          position: "",
          company: "",
          feedback: "",
          rating: 5,
          photo_url: "",
        });
      }, 2500);
    } catch (err) {
      console.error("Testimonial submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={() => { soundFX.playClick(); onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden text-white font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-bold text-lg text-white">Leave a Testimonial</h3>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                Share your experience working with Abdikadir Kosar
              </p>
            </div>
            <button
              onClick={() => { soundFX.playClick(); onClose(); }}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 size={46} className="text-[#4FFFB0] animate-bounce" />
              <h4 className="text-lg font-bold text-white">Thank You So Much!</h4>
              <p className="text-xs text-white/50 max-w-xs font-mono">
                Your testimonial has been submitted and will appear on the portfolio once verified by Abdikadir.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Rating Stars */}
              <div>
                <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-2">
                  Overall Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { soundFX.playClick(); setForm({ ...form, rating: star }); }}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={20}
                        className={
                          star <= form.rating
                            ? "text-[#4FFFB0] fill-[#4FFFB0]"
                            : "text-white/20"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-white/30" />
                    <input
                      required
                      type="text"
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#4FFFB0]/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                    Position & Company
                  </label>
                  <div className="relative">
                    <Building size={14} className="absolute left-3 top-3 text-white/30" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. CTO at Apex Labs"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#4FFFB0]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Your Review / Feedback *
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={form.feedback}
                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    placeholder="Describe the software Abdikadir delivered, speed, quality, and communication..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#4FFFB0]/40 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Photo Link Optional */}
              <div>
                <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Avatar / LinkedIn Photo URL (Optional)
                </label>
                <div className="relative">
                  <Image size={14} className="absolute left-3 top-3 text-white/30" />
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#4FFFB0]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !form.client_name.trim() || !form.feedback.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4FFFB0] hover:bg-[#4FFFB0]/90 text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(79,255,176,0.25)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Submit Testimonial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
