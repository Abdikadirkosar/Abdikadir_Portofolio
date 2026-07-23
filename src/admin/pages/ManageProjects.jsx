import { useEffect, useState } from "react";
import { safeQuery, uploadFile } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, Textarea, Select, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";
import { Globe, Upload, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const EMPTY = { name: "", description: "", category: "Full Stack", tech: "", link: "", live_link: "", image_url: "", featured: false };
const CATS = ["Full Stack", "AI/ML", "Frontend", "Backend", "Mobile", "DevOps"].map(v => ({ value: v, label: v }));

const ManageProjects = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, "projects");
      setForm(f => ({ ...f, image_url: publicUrl }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_projects").select("*").order("created_at", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm({ ...row, tech: Array.isArray(row.tech) ? row.tech.join(", ") : (row.tech || "") }); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      tech: form.tech,
      github_link: form.link || form.github_link || "",
      live_link: form.live_link || "",
      image_url: form.image_url || "",
      featured: form.featured || false,
    };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_projects").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_projects").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed: " + err.message); return; }
    toast.success(form.id ? "Project updated!" : "Project added!");
    closeModal();
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await safeQuery(sb => sb.from("db_projects").delete().eq("id", confirmId));
    setDeleting(false);
    setConfirmId(null);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Deleted!");
    fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Projects" subtitle={`${rows.length} total`} onAdd={openAdd} addLabel="Add Project" />

      <Table headers={["Image", "Name", "Category", "Tech", "Links", "Actions"]} empty={rows.length === 0 ? "No projects yet" : null}>
        {rows.map(row => (
          <Tr key={row.id}>
            <Td>
              {row.image_url
                ? <img src={row.image_url} alt="" className="w-12 h-8 object-cover rounded-lg border border-white/10" />
                : <div className="w-12 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06]" />}
            </Td>
            <Td><span className="text-white font-medium">{row.name}</span></Td>
            <Td>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#4FFFB0]/10 text-[#4FFFB0] border border-[#4FFFB0]/20">{row.category}</span>
            </Td>
            <Td>
              <span className="text-white/40 text-xs truncate max-w-[140px] block">{Array.isArray(row.tech) ? row.tech.join(", ") : row.tech}</span>
            </Td>
            <Td>
              <div className="flex gap-2">
                {row.github_link && <a href={row.github_link} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white"><FaGithub size={14} /></a>}
                {row.live_link && <a href={row.live_link} target="_blank" rel="noreferrer" className="text-white/30 hover:text-[#4FFFB0]"><Globe size={14} /></a>}
              </div>
            </Td>
            <Td>
              <div className="flex gap-1">
                <EditBtn onClick={() => openEdit(row)} />
                <DeleteBtn onClick={() => setConfirmId(row.id)} />
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      <Modal open={modal} onClose={closeModal} title={form.id ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project Name">
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="My Project" required />
            </Field>
            <Field label="Category">
              <Select options={CATS} value={form.category} onChange={e => set("category", e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="What this project does..." required />
          </Field>
          <Field label="Tech Stack (comma-separated)">
            <Input value={form.tech} onChange={e => set("tech", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub Link">
              <Input value={form.link || form.github_link || ""} onChange={e => set("link", e.target.value)} placeholder="https://github.com/..." />
            </Field>
            <Field label="Live Demo Link">
              <Input value={form.live_link || ""} onChange={e => set("live_link", e.target.value)} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Cover Image">
            <div className="flex gap-3 items-center">
              <Input value={form.image_url || ""} onChange={e => set("image_url", e.target.value)} placeholder="https://... or upload one" className="flex-1" />
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#4FFFB0]/20 bg-white/[0.02] hover:bg-[#4FFFB0]/5 text-white/50 hover:text-[#4FFFB0] text-xs font-mono transition-all cursor-pointer flex-shrink-0">
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured || false} onChange={e => set("featured", e.target.checked)} className="accent-[#4FFFB0] w-4 h-4" />
            <span className="text-white/50 text-sm">Featured project</span>
          </label>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white hover:border-white/25 transition-all">Cancel</button>
            <SubmitBtn loading={saving}>{form.id ? "Update" : "Add Project"}</SubmitBtn>
          </div>
        </form>
      </Modal>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default ManageProjects;
