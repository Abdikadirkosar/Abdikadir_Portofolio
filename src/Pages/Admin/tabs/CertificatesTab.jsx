import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, ExternalLink } from "lucide-react";
import { safeQuery, uploadFile } from "../../../lib/supabase";
import { toast } from "react-toastify";

const CertificatesTab = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    pdf_url: ""
  });

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const publicUrl = await uploadFile(file, folder);
      setForm(prev => ({ ...prev, [fieldName]: publicUrl }));
      toast.update(toastId, {
        render: "Certificate uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: `Upload failed: ${err.message || err}`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const fetchCerts = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_certificates").select("*").order("created_at", { ascending: false }));
    setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (cert) => {
    setEditingId(cert.id);
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      issue_date: cert.issue_date || "",
      credential_url: cert.credential_url || "",
      pdf_url: cert.pdf_url || ""
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      name: "",
      issuer: "",
      issue_date: "",
      credential_url: "",
      pdf_url: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    const { error } = await safeQuery(sb => sb.from("db_certificates").delete().eq("id", id));
    if (!error) {
      toast.success("Certificate deleted");
      setCerts(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_certificates").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Certificate updated");
        fetchCerts();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_certificates").insert([form]));
      if (!error) {
        toast.success("Certificate added");
        fetchCerts();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Certificates</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage professional certificates and credentials.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Certificate
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No certificates found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex justify-between items-start">
              <div>
                <p className="text-white text-xs font-bold">{cert.name}</p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">{cert.issuer} — {cert.issue_date}</p>
                <div className="flex gap-3 mt-3">
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-[#4FFFB0] hover:underline">
                      View Credential <ExternalLink size={8} />
                    </a>
                  )}
                  {cert.pdf_url && (
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60">
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(cert)} className="text-white/40 hover:text-white p-1"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(cert.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={12}/></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Certificate" : "Add Certificate"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Certificate Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Issuer</label>
                    <input type="text" name="issuer" placeholder="e.g. Google" value={form.issuer} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Issue Date</label>
                    <input type="text" name="issue_date" placeholder="e.g. Jan 2026" value={form.issue_date} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Credential Link</label>
                  <input type="text" name="credential_url" value={form.credential_url} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">PDF Upload/URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="pdf_url" 
                      placeholder="Paste URL or upload PDF..."
                      value={form.pdf_url} 
                      onChange={handleInputChange} 
                      className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 min-w-0" 
                    />
                    <label className="px-3 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[9px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                      Upload
                      <input 
                        type="file" 
                        accept="application/pdf"
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, "pdf_url", "certificates")} 
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Certificate
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificatesTab;
