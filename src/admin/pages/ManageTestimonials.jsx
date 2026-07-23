import { useEffect, useState } from "react";
import { safeQuery } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, Textarea, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";
import { Star } from "lucide-react";

const EMPTY = { client_name: "", company: "", review: "", rating: 5, photo_url: "" };

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)} className="transition-transform hover:scale-110">
        <Star size={20} fill={n <= value ? "#fbbf24" : "transparent"} stroke={n <= value ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
      </button>
    ))}
  </div>
);

const ManageTestimonials = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_testimonials").select("*").order("created_at", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm(row); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { client_name: form.client_name, company: form.company, review: form.review, rating: form.rating, photo_url: form.photo_url };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_testimonials").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_testimonials").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed"); return; }
    toast.success(form.id ? "Updated!" : "Testimonial added!");
    setModal(false);
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("db_testimonials").delete().eq("id", confirmId));
    setDeleting(false); setConfirmId(null);
    toast.success("Deleted!"); fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Testimonials" subtitle={`${rows.length} total`} onAdd={openAdd} addLabel="Add Testimonial" />

      <Table headers={["Client", "Company", "Rating", "Review Preview", "Actions"]} empty={rows.length === 0 ? "No testimonials yet" : null}>
        {rows.map(row => (
          <Tr key={row.id}>
            <Td>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#4FFFB0]/15 border border-[#4FFFB0]/25 flex items-center justify-center text-[#4FFFB0] text-xs font-bold flex-shrink-0">
                  {(row.client_name || "?")[0].toUpperCase()}
                </div>
                <span className="text-white font-medium text-sm">{row.client_name}</span>
              </div>
            </Td>
            <Td><span className="text-white/40 text-xs">{row.company}</span></Td>
            <Td>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={11} fill={n <= (row.rating || 5) ? "#fbbf24" : "transparent"} stroke={n <= (row.rating || 5) ? "#fbbf24" : "rgba(255,255,255,0.15)"} />
                ))}
              </div>
            </Td>
            <Td><span className="text-white/35 text-xs line-clamp-1 max-w-[200px]">{row.review}</span></Td>
            <Td>
              <div className="flex gap-1">
                <EditBtn onClick={() => openEdit(row)} />
                <DeleteBtn onClick={() => setConfirmId(row.id)} />
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client Name">
              <Input value={form.client_name} onChange={e => set("client_name", e.target.value)} placeholder="Ahmed Al-Rashid" required />
            </Field>
            <Field label="Company">
              <Input value={form.company} onChange={e => set("company", e.target.value)} placeholder="NovaTech, Dubai" required />
            </Field>
          </div>
          <Field label="Review">
            <Textarea rows={4} value={form.review} onChange={e => set("review", e.target.value)} placeholder="Excellent work, delivered on time..." required />
          </Field>
          <Field label="Rating">
            <StarPicker value={form.rating || 5} onChange={v => set("rating", v)} />
          </Field>
          <Field label="Photo URL (optional)">
            <Input value={form.photo_url || ""} onChange={e => set("photo_url", e.target.value)} placeholder="https://..." />
          </Field>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white transition-all">Cancel</button>
            <SubmitBtn loading={saving}>{form.id ? "Update" : "Add Testimonial"}</SubmitBtn>
          </div>
        </form>
      </Modal>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default ManageTestimonials;
