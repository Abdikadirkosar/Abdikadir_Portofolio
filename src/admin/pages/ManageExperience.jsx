import { useEffect, useState } from "react";
import { safeQuery } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, Textarea, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";

const EMPTY = { company: "", position: "", start_date: "", end_date: "", description: "", accent: "#4FFFB0" };
const ACCENTS = ["#4FFFB0", "#a855f7", "#38bdf8", "#fb923c", "#f472b6", "#fbbf24"];

const ManageExperience = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_experience").select("*").order("start_date", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm(row); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { company: form.company, position: form.position, start_date: form.start_date, end_date: form.end_date, description: form.description, accent: form.accent };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_experience").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_experience").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed"); return; }
    toast.success(form.id ? "Updated!" : "Added!");
    setModal(false);
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("db_experience").delete().eq("id", confirmId));
    setDeleting(false); setConfirmId(null);
    toast.success("Deleted!");
    fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Work Experience" subtitle={`${rows.length} entries`} onAdd={openAdd} addLabel="Add Experience" />

      <Table headers={["Company", "Position", "Period", "Accent", "Actions"]} empty={rows.length === 0 ? "No experience added yet" : null}>
        {rows.map(row => (
          <Tr key={row.id}>
            <Td><span className="text-white font-medium">{row.company}</span></Td>
            <Td><span className="text-white/60">{row.position}</span></Td>
            <Td><span className="text-white/40 text-xs font-mono">{row.start_date} – {row.end_date || "Present"}</span></Td>
            <Td>
              <div className="w-5 h-5 rounded-full border border-white/20" style={{ background: row.accent || "#4FFFB0" }} />
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

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Company / Organization">
            <Input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Company Name — City, Country" required />
          </Field>
          <Field label="Position / Title">
            <Input value={form.position} onChange={e => set("position", e.target.value)} placeholder="Senior Engineer" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Year">
              <Input value={form.start_date} onChange={e => set("start_date", e.target.value)} placeholder="2020" required />
            </Field>
            <Field label="End Year (blank = Present)">
              <Input value={form.end_date || ""} onChange={e => set("end_date", e.target.value)} placeholder="Present" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Key responsibilities and achievements..." required />
          </Field>
          <Field label="Accent Color">
            <div className="flex gap-2 flex-wrap">
              {ACCENTS.map(c => (
                <button key={c} type="button" onClick={() => set("accent", c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: form.accent === c ? "white" : "transparent" }}
                />
              ))}
              <input type="color" value={form.accent || "#4FFFB0"} onChange={e => set("accent", e.target.value)}
                className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent" title="Custom color" />
            </div>
          </Field>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white transition-all">Cancel</button>
            <SubmitBtn loading={saving}>{form.id ? "Update" : "Add"}</SubmitBtn>
          </div>
        </form>
      </Modal>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default ManageExperience;
