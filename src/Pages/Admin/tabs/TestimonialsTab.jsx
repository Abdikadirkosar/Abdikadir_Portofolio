import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Star } from "lucide-react";
import { safeQuery, uploadFile } from "../../../lib/supabase";
import { toast } from "react-toastify";

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    client_name: "",
    company: "",
    photo_url: "",
    review: "",
    rating: 5
  });

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const publicUrl = await uploadFile(file, folder);
      setForm(prev => ({ ...prev, [fieldName]: publicUrl }));
      toast.update(toastId, { render: "Photo uploaded!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: `Upload failed: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
    }
  };


  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_testimonials").select("*").order("created_at", { ascending: false }));
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (t) => {
    setEditingId(t.id);
    setForm({
      client_name: t.client_name,
      company: t.company || "",
      photo_url: t.photo_url || "",
      review: t.review,
      rating: t.rating || 5
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      client_name: "",
      company: "",
      photo_url: "",
      review: "",
      rating: 5
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const { error } = await safeQuery(sb => sb.from("db_testimonials").delete().eq("id", id));
    if (!error) {
      toast.success("Testimonial deleted");
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_testimonials").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Testimonial updated");
        fetchTestimonials();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_testimonials").insert([form]));
      if (!error) {
        toast.success("Testimonial added");
        fetchTestimonials();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Testimonials</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage client feedback, company endorsements, and ratings.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No testimonials found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">{t.client_name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-white text-xs font-bold">{t.client_name}</p>
                    <p className="text-[10px] text-white/30 font-mono">{t.company}</p>
                  </div>
                </div>
                <p className="text-white/40 text-xs italic mt-3 leading-relaxed">"{t.review}"</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-white/10"} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(t)} className="text-white/40 hover:text-white p-1 cursor-pointer"><Edit2 size={12}/></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-400/50 hover:text-red-400 p-1 cursor-pointer"><Trash2 size={12}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Client Name</label>
                  <input type="text" name="client_name" value={form.client_name} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Company / Role</label>
                    <input type="text" name="company" placeholder="e.g. CEO at TechCorp" value={form.company} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Rating (1-5)</label>
                    <input type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Photo URL / Upload</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="photo_url" 
                      placeholder="Paste URL or upload photo..."
                      value={form.photo_url} 
                      onChange={handleInputChange} 
                      className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 min-w-0" 
                    />
                    {form.photo_url && (
                      <img src={form.photo_url} alt="preview" className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0" />
                    )}
                    <label className="px-2.5 py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[9px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "photo_url", "testimonials")} />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Review Message</label>
                  <textarea name="review" rows="3" value={form.review} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Testimonial
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsTab;
