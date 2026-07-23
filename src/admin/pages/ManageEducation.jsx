import { useEffect, useState } from "react";
import { safeQuery } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";

const EMPTY = { university: "", degree: "", department: "", year: "", gpa: "", accentColor: "#4FFFB0", icon: "GraduationCap" };
const ACCENTS = ["#4FFFB0", "#a855f7", "#38bdf8", "#fb923c", "#f472b6", "#fbbf24"];
const ICONS = ["GraduationCap", "BookOpen", "Award"].map(v => ({ value: v, label: v }));

const ManageEducation = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_education").select("*").order("created_at", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm(row); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { university: form.university, degree: form.degree, department: form.department, year: form.year, gpa: form.gpa, accentColor: form.accentColor, icon: form.icon };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_education").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_education").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed"); return; }
    toast.success(form.id ? "Updated!" : "Added!");
    setModal(false);
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("db_education").delete().eq("id", confirmId));
    setDeleting(false); setConfirmId(null);
    toast.success("Deleted!"); fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Education" subtitle={`${rows.length} entries`} onAdd={openAdd} addLabel="Add Education" />

      <Table headers={["Institution", "Degree", "Year", "GPA/Grade", "Accent", "Actions"]} empty={rows.length === 0 ? "No education entries" : null}>
        {rows.map(row => (
          <Tr key={row.id}>
            <Td><span className="text-white font-medium">{row.university}</span></Td>
            <Td><span className="text-white/60 text-xs">{row.degree}</span></Td>
            <Td><span className="text-white/40 text-xs font-mono">{row.year}</span></Td>
            <Td><span className="text-white/40 text-xs">{row.gpa}</span></Td>
            <Td><div className="w-5 h-5 rounded-full border border-white/20" style={{ background: row.accentColor || "#4FFFB0" }} /></Td>
            <Td>
              <div className="flex gap-1">
                <EditBtn onClick={() => openEdit(row)} />
                <DeleteBtn onClick={() => setConfirmId(row.id)} />
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Edit Education" : "Add Education"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Institution / University">
            <Input value={form.university} onChange={e => set("university", e.target.value)} placeholder="University of Helsinki" required />
          </Field>
          <Field label="Degree / Program">
            <Input value={form.degree} onChange={e => set("degree", e.target.value)} placeholder="B.Sc. Computer Science" required />
          </Field>
          <Field label="Department">
            <Input value={form.department || ""} onChange={e => set("department", e.target.value)} placeholder="Faculty of Computing" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Year / Period">
              <Input value={form.year || ""} onChange={e => set("year", e.target.value)} placeholder="2020 — Present" />
            </Field>
            <Field label="Grade / GPA">
              <Input value={form.gpa || ""} onChange={e => set("gpa", e.target.value)} placeholder="GPA: 3.9 / 4.0" />
            </Field>
          </div>
          <Field label="Accent Color">
            <div className="flex gap-2 flex-wrap">
              {ACCENTS.map(c => (
                <button key={c} type="button" onClick={() => set("accentColor", c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: form.accentColor === c ? "white" : "transparent" }} />
              ))}
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

export default ManageEducation;
