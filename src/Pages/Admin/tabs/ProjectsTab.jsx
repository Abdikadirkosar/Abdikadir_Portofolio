import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Heart, ExternalLink, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import { safeQuery, uploadFile } from "../../../lib/supabase";
import { toast } from "react-toastify";

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Modal / Form state
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tech: "",
    image_url: "",
    video_url: "",
    github_link: "",
    live_link: "",
    category: "AI",
    featured: false,
    status: "Completed"
  });

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const publicUrl = await uploadFile(file, folder);
      setForm(prev => ({ ...prev, [fieldName]: publicUrl }));
      toast.update(toastId, {
        render: "Media uploaded successfully!",
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

  const fetchAllData = async () => {
    setLoading(true);
    
    // 1. Fetch Projects from DB
    const { data: dbProjs } = await safeQuery(sb => sb.from("db_projects").select("*").order("created_at", { ascending: false }));
    setProjects(dbProjs || []);

    // 2. Fetch Likes
    const { data: dbLikes } = await safeQuery(sb => sb.from("project_likes").select("project_id"));
    if (dbLikes) {
      const counts = {};
      dbLikes.forEach(({ project_id }) => {
        counts[project_id] = (counts[project_id] || 0) + 1;
      });
      setLikes(counts);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditClick = (proj) => {
    setEditingId(proj.id);
    setForm({
      name: proj.name,
      description: proj.description || "",
      tech: proj.tech ? proj.tech.join(", ") : "",
      image_url: proj.image_url || "",
      video_url: proj.video_url || "",
      github_link: proj.github_link || "",
      live_link: proj.live_link || "",
      category: proj.category || "AI",
      featured: proj.featured || false,
      status: proj.status || "Completed"
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      tech: "",
      image_url: "",
      video_url: "",
      github_link: "",
      live_link: "",
      category: "AI",
      featured: false,
      status: "Completed"
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const { error } = await safeQuery(sb => sb.from("db_projects").delete().eq("id", id));
    if (!error) {
      toast.success("Project deleted successfully");
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formattedTech = form.tech.split(",").map(t => t.trim()).filter(Boolean);
    const payload = {
      ...form,
      tech: formattedTech
    };

    if (editingId) {
      // Edit mode
      const { error } = await safeQuery(sb =>
        sb.from("db_projects").update(payload).eq("id", editingId)
      );
      if (!error) {
        toast.success("Project updated successfully!");
        fetchAllData();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update project");
      }
    } else {
      // Add mode
      const { error } = await safeQuery(sb =>
        sb.from("db_projects").insert([payload])
      );
      if (!error) {
        toast.success("Project created successfully!");
        fetchAllData();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create project");
      }
    }
  };

  const toggleFeatured = async (proj) => {
    const newVal = !proj.featured;
    const { error } = await safeQuery(sb =>
      sb.from("db_projects").update({ featured: newVal }).eq("id", proj.id)
    );
    if (!error) {
      toast.success(`Project ${newVal ? "marked as featured" : "unfeatured"}`);
      setProjects(prev =>
        prev.map(p => (p.id === proj.id ? { ...p, featured: newVal } : p))
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Projects Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Edit, add, delete, and feature your projects.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No projects found. Create your first project.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-white font-bold text-sm truncate">{proj.name}</h3>
                  <div className="flex gap-1.5">
                    <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">
                      {proj.category}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                      proj.status === "Completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                </div>
                <p className="text-white/40 text-xs line-clamp-2 mt-1.5">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {proj.tech && proj.tech.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/40 border border-white/[0.06]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lower Section Buttons */}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-1">
                <div className="flex items-center gap-4 text-xs font-mono text-white/30">
                  <span className="flex items-center gap-1">
                    <Heart size={10} className="text-red-400" /> {likes[proj.id] || 0}
                  </span>
                  <button 
                    onClick={() => toggleFeatured(proj)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    {proj.featured ? (
                      <><ToggleRight size={16} className="text-[#4FFFB0]" /> Featured</>
                    ) : (
                      <><ToggleLeft size={16} /> Feature</>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(proj)}
                    className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/55 hover:text-white hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="w-7 h-7 flex items-center justify-center rounded border border-red-500/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL FORM ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-[#0a0a0f] border border-white/[0.08] rounded-xl overflow-hidden p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 mb-4">
                <h3 className="text-white font-bold text-sm">
                  {editingId ? "Edit Project" : "Add Project"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Project Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={form.name} 
                      onChange={handleInputChange} 
                      required
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Category</label>
                    <select 
                      name="category" 
                      value={form.category} 
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                    >
                      <option value="AI">AI</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="Mobile">Mobile</option>
                      <option value="UI/UX">UI/UX</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Description</label>
                  <textarea 
                    name="description" 
                    rows="3"
                    value={form.description} 
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    name="tech" 
                    value={form.tech} 
                    onChange={handleInputChange}
                    placeholder="React, Tailwind, Supabase"
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Image URL</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        name="image_url" 
                        value={form.image_url} 
                        onChange={handleInputChange}
                        placeholder="URL or Upload..."
                        className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 min-w-0"
                      />
                      <label className="px-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[9px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "image_url", "projects")} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Video Demo URL</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        name="video_url" 
                        value={form.video_url} 
                        onChange={handleInputChange}
                        placeholder="URL or Upload..."
                        className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 min-w-0"
                      />
                      <label className="px-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[9px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                        Upload
                        <input 
                          type="file" 
                          accept="video/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "video_url", "projects")} 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">GitHub Link</label>
                    <input 
                      type="text" 
                      name="github_link" 
                      value={form.github_link} 
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Live Demo Link</label>
                    <input 
                      type="text" 
                      name="live_link" 
                      value={form.live_link} 
                      onChange={handleInputChange}
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-white/50 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="featured" 
                        checked={form.featured} 
                        onChange={handleInputChange} 
                      />
                      Featured Project
                    </label>
                    
                    <label className="flex items-center gap-2 text-xs text-white/50 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="status"
                        checked={form.status === "In Progress"}
                        onChange={(e) => setForm(p => ({ ...p, status: e.target.checked ? "In Progress" : "Completed" }))}
                      />
                      In Progress
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 transition-all cursor-pointer"
                  >
                    <Save size={13} /> Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProjectsTab;
