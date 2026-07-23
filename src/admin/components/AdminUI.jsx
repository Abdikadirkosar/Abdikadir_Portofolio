// Shared reusable admin UI components
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";

// ── Modal wrapper ─────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = "max-w-xl" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          className={`relative w-full ${width} bg-[#0d0d14] border border-white/[0.08] rounded-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col`}
          initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.5), transparent)" }} />
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
            <h3 className="text-white font-bold text-base">{title}</h3>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Form field ────────────────────────────────────────────────────────────────
export const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] uppercase tracking-[.2em] text-white/30 font-mono">{label}</label>
    {children}
  </div>
);

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm px-4 py-2.5 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_2px_rgba(79,255,176,0.05)] transition-all duration-200 ${className}`}
    {...props}
  />
);

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm px-4 py-2.5 outline-none placeholder:text-white/15 font-mono focus:border-[#4FFFB0]/35 focus:shadow-[0_0_0_2px_rgba(79,255,176,0.05)] transition-all duration-200 resize-none leading-relaxed ${className}`}
    {...props}
  />
);

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ options = [], className = "", ...props }) => (
  <select
    className={`w-full bg-[#0a0a10] border border-white/[0.07] rounded-xl text-white text-sm px-4 py-2.5 outline-none font-mono focus:border-[#4FFFB0]/35 transition-all duration-200 ${className}`}
    {...props}
  >
    {options.map(o => (
      <option key={o.value} value={o.value} className="bg-[#0d0d14]">{o.label}</option>
    ))}
  </select>
);

// ── Submit button ─────────────────────────────────────────────────────────────
export const SubmitBtn = ({ loading, children = "Save" }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: loading ? 1 : 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-mono font-bold text-black disabled:opacity-50 transition-all"
    style={{ background: loading ? "rgba(79,255,176,0.5)" : "#4FFFB0" }}
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : null}
    {loading ? "Saving..." : children}
  </motion.button>
);

// ── Page header ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, onAdd, addLabel = "Add New" }) => (
  <div className="flex items-center justify-between mb-7">
    <div>
      <h1 className="text-2xl font-black text-white">{title}</h1>
      {subtitle && <p className="text-white/30 text-sm mt-1">{subtitle}</p>}
    </div>
    {onAdd && (
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-bold text-black"
        style={{ background: "#4FFFB0" }}
      >
        <Plus size={15} />
        {addLabel}
      </motion.button>
    )}
  </div>
);

// ── Table shell ───────────────────────────────────────────────────────────────
export const Table = ({ headers, children, empty }) => (
  <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
          {headers.map(h => (
            <th key={h} className="text-left px-4 py-3 text-[9px] font-mono uppercase tracking-widest text-white/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
        {empty && (
          <tr>
            <td colSpan={headers.length} className="px-4 py-10 text-center text-white/20 text-sm font-mono">{empty}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ── Table row ─────────────────────────────────────────────────────────────────
export const Tr = ({ children }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors last:border-0"
  >
    {children}
  </motion.tr>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-white/70 ${className}`}>{children}</td>
);

// ── Action buttons ────────────────────────────────────────────────────────────
export const EditBtn = ({ onClick }) => (
  <button onClick={onClick} className="p-1.5 rounded-lg text-white/30 hover:text-[#4FFFB0] hover:bg-[#4FFFB0]/10 transition-all">
    <Pencil size={13} />
  </button>
);

export const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
    <Trash2 size={13} />
  </button>
);

// ── Confirm delete dialog ─────────────────────────────────────────────────────
export const ConfirmDelete = ({ open, onClose, onConfirm, loading }) => (
  <Modal open={open} onClose={onClose} title="Confirm Delete" width="max-w-sm">
    <div className="flex flex-col items-center gap-4 text-center py-2">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <p className="text-white/70 text-sm">Are you sure you want to delete this item? This action cannot be undone.</p>
      <div className="flex gap-3 mt-2">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/25 transition-all">
          Cancel
        </button>
        <motion.button
          onClick={onConfirm}
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium disabled:opacity-50 transition-all hover:bg-red-500/25"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {loading ? "Deleting..." : "Delete"}
        </motion.button>
      </div>
    </div>
  </Modal>
);

// ── Loading spinner ───────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-[#4FFFB0]/30 border-t-[#4FFFB0] rounded-full animate-spin" />
  </div>
);
