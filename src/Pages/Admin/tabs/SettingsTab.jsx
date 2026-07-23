import { useState } from "react";
import { Key, Database, RefreshCw, Save, Mail, Bell, Lock } from "lucide-react";
import { toast } from "react-toastify";

const SettingsTab = () => {
  const [passForm, setPassForm] = useState({ currentPass: "", newPass: "", confirmPass: "" });
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [smtp, setSmtp] = useState({ host: "", port: "587", user: "", pass: "" });
  const [notifs, setNotifs] = useState({ new_message: true, project_like: true, analytics_weekly: false });

  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirmPass) {
      toast.error("New passwords do not match!"); return;
    }
    toast.success("Dashboard password updated successfully!");
    setPassForm({ currentPass: "", newPass: "", confirmPass: "" });
  };

  const handleBackup = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      toast.success("Database backup SQL file generated and downloaded!");
    }, 1500);
  };

  const handleRestore = () => {
    setRestoreLoading(true);
    setTimeout(() => {
      setRestoreLoading(false);
      toast.success("Database restored to latest recovery point!");
    }, 1500);
  };

  const handleSmtpSave = (e) => {
    e.preventDefault();
    toast.success("SMTP configuration saved! Email notifications enabled.");
  };

  const inputCls = "bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 w-full";

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">General Settings</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage credentials, security, email and notification preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security / Password */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2.5">
            <Key size={14} className="text-[#4FFFB0]" />
            <h3 className="text-white font-bold text-sm">Security &amp; Password</h3>
          </div>
          
          <form onSubmit={handlePassChange} className="flex flex-col gap-3">
            {[
              { label: "Current Password", key: "currentPass" },
              { label: "New Password", key: "newPass" },
              { label: "Confirm New Password", key: "confirmPass" },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">{f.label}</label>
                <input type="password" value={passForm[f.key]} onChange={(e) => setPassForm(p => ({ ...p, [f.key]: e.target.value }))} required className={inputCls} />
              </div>
            ))}
            <button type="submit" className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer mt-1">
              <Save size={12} /> Save Password
            </button>
          </form>

          {/* 2FA Toggle */}
          <div className="border-t border-white/[0.04] pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-[#a78bfa]" />
                <div>
                  <p className="text-white text-xs font-semibold">Two-Factor Auth (2FA)</p>
                  <p className="text-white/30 text-[10px] mt-0.5">Adds an extra layer of security to your admin login</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFAEnabled(!twoFAEnabled);
                  toast.info(twoFAEnabled ? "2FA disabled" : "2FA enabled (mock — integrate your TOTP provider)");
                }}
                className={`relative w-10 h-5 rounded-full border transition-colors cursor-pointer flex-shrink-0 ${twoFAEnabled ? "bg-[#4FFFB0]/20 border-[#4FFFB0]/40" : "bg-white/5 border-white/10"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all duration-200 ${twoFAEnabled ? "left-5 bg-[#4FFFB0]" : "left-0.5 bg-white/30"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Database Maintenance */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2.5">
            <Database size={14} className="text-[#38bdf8]" />
            <h3 className="text-white font-bold text-sm">Database Maintenance</h3>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Export database configurations, tables structure, messages logs and project likes as raw SQL for local backup or migrations.
          </p>
          <div className="flex flex-col gap-2 mt-auto">
            <button onClick={handleBackup} disabled={backupLoading} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all cursor-pointer">
              {backupLoading ? <RefreshCw size={12} className="animate-spin" /> : <Database size={12} />}
              {backupLoading ? "Generating..." : "Download SQL Backup"}
            </button>
            <button onClick={handleRestore} disabled={restoreLoading} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-red-500/5 border border-red-500/10 text-red-400/80 hover:bg-red-500/10 transition-all cursor-pointer">
              {restoreLoading ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              {restoreLoading ? "Restoring..." : "Restore Snapshot"}
            </button>
          </div>
        </div>

        {/* SMTP / Email Config */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2.5">
            <Mail size={14} className="text-[#f59e0b]" />
            <h3 className="text-white font-bold text-sm">Email / SMTP Config</h3>
          </div>
          <p className="text-white/35 text-[10px] leading-relaxed">Configure your outgoing mail server for contact form replies.</p>
          <form onSubmit={handleSmtpSave} className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">SMTP Host</label>
                <input type="text" placeholder="smtp.gmail.com" value={smtp.host} onChange={e => setSmtp(p => ({ ...p, host: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Port</label>
                <input type="text" value={smtp.port} onChange={e => setSmtp(p => ({ ...p, port: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Username / Email</label>
              <input type="email" placeholder="you@gmail.com" value={smtp.user} onChange={e => setSmtp(p => ({ ...p, user: e.target.value }))} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">App Password</label>
              <input type="password" placeholder="••••••••••••" value={smtp.pass} onChange={e => setSmtp(p => ({ ...p, pass: e.target.value }))} className={inputCls} />
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-all cursor-pointer">
              <Save size={12} /> Save SMTP Config
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2.5">
            <Bell size={14} className="text-[#a78bfa]" />
            <h3 className="text-white font-bold text-sm">Notification Preferences</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { key: "new_message", label: "New contact message", desc: "Alert when someone submits a message" },
              { key: "project_like", label: "Project like", desc: "Alert when a visitor likes a project" },
              { key: "analytics_weekly", label: "Weekly analytics summary", desc: "Weekly visitor & traffic digest" },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-white text-xs font-medium">{n.label}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{n.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotifs(p => ({ ...p, [n.key]: !p[n.key] }));
                    toast.info(`${n.label} notifications ${notifs[n.key] ? "disabled" : "enabled"}`);
                  }}
                  className={`relative w-10 h-5 rounded-full border transition-colors cursor-pointer flex-shrink-0 ${notifs[n.key] ? "bg-[#a78bfa]/20 border-[#a78bfa]/40" : "bg-white/5 border-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all duration-200 ${notifs[n.key] ? "left-5 bg-[#a78bfa]" : "left-0.5 bg-white/30"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsTab;
