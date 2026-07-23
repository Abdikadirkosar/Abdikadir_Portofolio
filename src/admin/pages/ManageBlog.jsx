import { useEffect, useState } from "react";
import { safeQuery, uploadFile } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, Textarea, Select, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";
import { Upload, Loader2 } from "lucide-react";

const EMPTY = { title: "", category: "AI", tags: "", content: "", cover_image: "", published: true };
const CATS = ["AI", "Frontend", "Backend", "DevOps", "Tech", "Tutorial"].map(v => ({ value: v, label: v }));

const CATEGORY_COLORS = {
  AI: "#a855f7", Frontend: "#38bdf8", Backend: "#4FFFB0", DevOps: "#fb923c", Tech: "#f472b6", Tutorial: "#fbbf24",
};

const ManageBlog = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, "blogs");
      setForm(f => ({ ...f, cover_image: publicUrl }));
      toast.success("Cover image uploaded!");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_blogs").select("*").order("created_at", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm({ ...row, tags: Array.isArray(row.tags) ? row.tags.join(", ") : (row.tags || "") }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { title: form.title, category: form.category, tags: form.tags, content: form.content, cover_image: form.cover_image, published: form.published };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_blogs").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_blogs").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed"); return; }
    toast.success(form.id ? "Post updated!" : "Post added!");
    setModal(false);
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("db_blogs").delete().eq("id", confirmId));
    setDeleting(false);
    setConfirmId(null);
    toast.success("Deleted!");
    fetch();
  };

  // Toggle published status inline
  const togglePublished = async (row) => {
    await safeQuery(sb => sb.from("db_blogs").update({ published: !row.published }).eq("id", row.id));
    setRows(rows => rows.map(r => r.id === row.id ? { ...r, published: !r.published } : r));
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Blog Posts" subtitle={`${rows.length} total`} onAdd={openAdd} addLabel="New Post" />

      <Table headers={["Title", "Category", "Published", "Actions"]} empty={rows.length === 0 ? "No posts yet" : null}>
        {rows.map(row => {
          const color = CATEGORY_COLORS[row.category] || "#4FFFB0";
          return (
            <Tr key={row.id}>
              <Td><span className="text-white font-medium line-clamp-1">{row.title}</span></Td>
              <Td>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border" style={{ color, background: `${color}12`, borderColor: `${color}25` }}>
                  {row.category}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => togglePublished(row)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${row.published ? "bg-[#4FFFB0]/10 text-[#4FFFB0] border-[#4FFFB0]/25" : "bg-white/[0.03] text-white/30 border-white/[0.08]"}`}
                >
                  {row.published ? "Published" : "Draft"}
                </button>
              </Td>
              <Td>
                <div className="flex gap-1">
                  <EditBtn onClick={() => openEdit(row)} />
                  <DeleteBtn onClick={() => setConfirmId(row.id)} />
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Edit Post" : "New Post"} width="max-w-2xl">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Title">
            <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Post title..." required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select options={CATS} value={form.category} onChange={e => set("category", e.target.value)} />
            </Field>
            <Field label="Tags (comma-separated)">
              <Input value={form.tags || ""} onChange={e => set("tags", e.target.value)} placeholder="React, AI, Performance" />
            </Field>
          </div>
          <Field label="Cover Image">
            <div className="flex gap-3 items-center">
              <Input value={form.cover_image || ""} onChange={e => set("cover_image", e.target.value)} placeholder="https://... or upload one" className="flex-1" />
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#4FFFB0]/20 bg-white/[0.02] hover:bg-[#4FFFB0]/5 text-white/50 hover:text-[#4FFFB0] text-xs font-mono transition-all cursor-pointer flex-shrink-0">
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </Field>
          <Field label="Content">
            <Textarea rows={8} value={form.content} onChange={e => set("content", e.target.value)} placeholder="Write your article here..." required />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="accent-[#4FFFB0] w-4 h-4" />
            <span className="text-white/50 text-sm">Published (visible on site)</span>
          </label>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white transition-all">Cancel</button>
            <SubmitBtn loading={saving}>{form.id ? "Update" : "Publish Post"}</SubmitBtn>
          </div>
        </form>
      </Modal>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default ManageBlog;
