import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Eye, Bold, Italic, Code, Link, Heading2, Quote, List } from "lucide-react";
import { safeQuery, uploadFile } from "../../../lib/supabase";
import { toast } from "react-toastify";

const BlogTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Tech",
    tags: "",
    cover_image: "",
    seo_title: "",
    seo_desc: "",
    published: false
  });

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const publicUrl = await uploadFile(file, folder);
      setForm(prev => ({ ...prev, [fieldName]: publicUrl }));
      toast.update(toastId, {
        render: "Cover image uploaded successfully!",
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

  const insertMarkdown = (tagBefore, tagAfter = "") => {
    const textarea = document.getElementById("blog-content-area");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const selectedText = text.substring(start, end);
    const replacement = tagBefore + selectedText + tagAfter;
    
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setForm(prev => ({ ...prev, content: newValue }));
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagBefore.length, start + tagBefore.length + selectedText.length);
    }, 50);
  };


  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_blogs").select("*").order("created_at", { ascending: false }));
    setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEditClick = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      content: blog.content || "",
      category: blog.category || "Tech",
      tags: blog.tags ? blog.tags.join(", ") : "",
      cover_image: blog.cover_image || "",
      seo_title: blog.seo_title || "",
      seo_desc: blog.seo_desc || "",
      published: blog.published || false
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      category: "Tech",
      tags: "",
      cover_image: "",
      seo_title: "",
      seo_desc: "",
      published: false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    const { error } = await safeQuery(sb => sb.from("db_blogs").delete().eq("id", id));
    if (!error) {
      toast.success("Post deleted");
      setBlogs(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags: tagsArr };

    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_blogs").update(payload).eq("id", editingId));
      if (!error) {
        toast.success("Blog post updated");
        fetchBlogs();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_blogs").insert([payload]));
      if (!error) {
        toast.success("Blog post published");
        fetchBlogs();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Blog & Articles</h1>
          <p className="text-white/40 text-xs mt-0.5">Write articles, manage status, and configure SEO metadata.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> New Article
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No blog posts published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map(blog => (
            <div key={blog.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-white font-bold text-sm truncate">{blog.title}</h3>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                    blog.published ? "bg-[#4FFFB0]/10 border-[#4FFFB0]/20 text-[#4FFFB0]" : "bg-white/5 border-white/10 text-white/40"
                  }`}>
                    {blog.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="text-white/40 text-xs line-clamp-2 mt-1.5">{blog.content}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {blog.tags && blog.tags.map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/40 border border-white/[0.06]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="text-[10px] font-mono text-white/20">Category: {blog.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(blog)} className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/55 hover:text-white transition-colors cursor-pointer"><Edit2 size={11} /></button>
                  <button onClick={() => handleDelete(blog.id)} className="w-7 h-7 flex items-center justify-center rounded border border-red-500/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"><Trash2 size={11} /></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-lg bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Article" : "Write Article"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={form.title} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter article title..."
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Category</label>
                    <input type="text" name="category" value={form.category} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Cover Image</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        name="cover_image" 
                        placeholder="Paste URL or upload..."
                        value={form.cover_image} 
                        onChange={handleInputChange} 
                        className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 min-w-0" 
                      />
                      <label className="px-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[9px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, "cover_image", "blogs")} 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Content (Rich Text Toolbar)</label>
                    <button 
                      type="button" 
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-[10px] uppercase font-mono text-[#4FFFB0] hover:underline"
                    >
                      {previewMode ? "Edit Raw" : "Live Preview"}
                    </button>
                  </div>
                  
                  {!previewMode ? (
                    <>
                      {/* Markdown helper toolbar */}
                      <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.07] rounded-t-lg px-2.5 py-1.5 border-b-0">
                        <button type="button" title="Bold" onClick={() => insertMarkdown("**", "**")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Bold size={13} /></button>
                        <button type="button" title="Italic" onClick={() => insertMarkdown("*", "*")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Italic size={13} /></button>
                        <button type="button" title="Heading" onClick={() => insertMarkdown("\n## ")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Heading2 size={13} /></button>
                        <button type="button" title="Code Block" onClick={() => insertMarkdown("\n```\n", "\n```\n")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Code size={13} /></button>
                        <button type="button" title="Link" onClick={() => insertMarkdown("[", "](url)")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Link size={13} /></button>
                        <button type="button" title="Quote" onClick={() => insertMarkdown("\n> ")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><Quote size={13} /></button>
                        <button type="button" title="List" onClick={() => insertMarkdown("\n- ")} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"><List size={13} /></button>
                      </div>
                      <textarea 
                        id="blog-content-area"
                        name="content" 
                        rows="6" 
                        value={form.content} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full bg-white/[0.03] border border-white/[0.07] rounded-b-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 font-mono resize-none" 
                      />
                    </>
                  ) : (
                    <div className="w-full h-44 bg-white/[0.02] border border-white/[0.07] rounded-lg p-3 overflow-y-auto text-white/70 text-xs leading-relaxed font-sans whitespace-pre-wrap select-text">
                      {form.content || "Empty content. Start typing to preview your work..."}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Tags (comma separated)</label>
                  <input type="text" name="tags" placeholder="ai, coding, webdev" value={form.tags} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="border-t border-white/[0.06] pt-3 flex flex-col gap-3">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#4FFFB0]">SEO CONFIGURATION</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">SEO Meta Title</label>
                      <input type="text" name="seo_title" value={form.seo_title} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">SEO Meta Desc</label>
                      <input type="text" name="seo_desc" value={form.seo_desc} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-2">
                  <label className="flex items-center gap-2 text-xs text-white/50 select-none cursor-pointer">
                    <input type="checkbox" name="published" checked={form.published} onChange={handleInputChange} />
                    Publish Live
                  </label>
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                    <Save size={13} /> Save Post
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

export default BlogTab;
