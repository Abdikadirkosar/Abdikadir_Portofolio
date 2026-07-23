import { useEffect, useState } from "react";
import { safeQuery } from "../../lib/supabase";
import { toast } from "react-toastify";
import { Modal, Field, Input, SubmitBtn, PageHeader, Table, Tr, Td, EditBtn, DeleteBtn, ConfirmDelete, PageLoader } from "../components/AdminUI";
import { ExternalLink } from "lucide-react";

const EMPTY = { name: "", issuer: "", issue_date: "", credential_url: "", pdf_url: "", image_url: "" };

const ManageCertificates = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_certificates").select("*").order("issue_date", { ascending: false }));
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setForm(row); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: form.name, issuer: form.issuer, issue_date: form.issue_date, credential_url: form.credential_url, pdf_url: form.pdf_url, image_url: form.image_url };
    let err;
    if (form.id) {
      ({ error: err } = await safeQuery(sb => sb.from("db_certificates").update(payload).eq("id", form.id)));
    } else {
      ({ error: err } = await safeQuery(sb => sb.from("db_certificates").insert([payload])));
    }
    setSaving(false);
    if (err) { toast.error("Save failed"); return; }
    toast.success(form.id ? "Updated!" : "Certificate added!");
    setModal(false);
    fetch();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await safeQuery(sb => sb.from("db_certificates").delete().eq("id", confirmId));
    setDeleting(false); setConfirmId(null);
    toast.success("Deleted!"); fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Certificates" subtitle={`${rows.length} total`} onAdd={openAdd} addLabel="Add Certificate" />

      <Table headers={["Name", "Issuer", "Year", "Verify", "Actions"]} empty={rows.length === 0 ? "No certificates added" : null}>
        {rows.map(row => (
          <Tr key={row.id}>
            <Td><span className="text-white font-medium line-clamp-1">{row.name}</span></Td>
            <Td><span className="text-white/50 text-xs">{row.issuer}</span></Td>
            <Td><span className="text-white/40 text-xs font-mono">{row.issue_date}</span></Td>
            <Td>
              {row.credential_url && (
                <a href={row.credential_url} target="_blank" rel="noreferrer" className="text-[#4FFFB0]/60 hover:text-[#4FFFB0] transition-colors">
                  <ExternalLink size={13} />
                </a>
              )}
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

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? "Edit Certificate" : "Add Certificate"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Certificate Name">
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="AWS Solutions Architect Professional" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Issuer">
              <Input value={form.issuer} onChange={e => set("issuer", e.target.value)} placeholder="Amazon Web Services" required />
            </Field>
            <Field label="Issue Year / Date">
              <Input value={form.issue_date || ""} onChange={e => set("issue_date", e.target.value)} placeholder="2024" />
            </Field>
          </div>
          <Field label="Credential URL (verify link)">
            <Input value={form.credential_url || ""} onChange={e => set("credential_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="PDF URL (optional)">
            <Input value={form.pdf_url || ""} onChange={e => set("pdf_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Certificate Image URL (optional)">
            <Input value={form.image_url || ""} onChange={e => set("image_url", e.target.value)} placeholder="https://..." />
          </Field>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <button type="button" onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white transition-all">Cancel</button>
            <SubmitBtn loading={saving}>{form.id ? "Update" : "Add Certificate"}</SubmitBtn>
          </div>
        </form>
      </Modal>

      <ConfirmDelete open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default ManageCertificates;
