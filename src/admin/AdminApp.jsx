import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import {
  LayoutDashboard, FolderKanban, BookOpen, Briefcase,
  GraduationCap, Award, MessageSquareQuote, Mail,
  Settings, LogOut, Menu, X, ExternalLink, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin/dashboard",    icon: LayoutDashboard,      label: "Dashboard" },
  { to: "/admin/projects",     icon: FolderKanban,         label: "Projects" },
  { to: "/admin/blog",         icon: BookOpen,             label: "Blog Posts" },
  { to: "/admin/experience",   icon: Briefcase,            label: "Experience" },
  { to: "/admin/education",    icon: GraduationCap,        label: "Education" },
  { to: "/admin/certificates", icon: Award,                label: "Certificates" },
  { to: "/admin/testimonials", icon: MessageSquareQuote,   label: "Testimonials" },
  { to: "/admin/messages",     icon: Mail,                 label: "Messages" },
  { to: "/admin/settings",     icon: Settings,             label: "Settings" },
];

const AdminApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : "p-5"}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg bg-[#4FFFB0]/15 border border-[#4FFFB0]/25 flex items-center justify-center flex-shrink-0">
          <span className="text-[#4FFFB0] text-xs font-black">A</span>
        </div>
        {(sidebarOpen || mobile) && (
          <div>
            <p className="text-white font-bold text-sm leading-none">Admin Panel</p>
            <p className="text-white/25 text-[9px] font-mono tracking-widest uppercase mt-0.5">v1.0</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#4FFFB0]/10 text-[#4FFFB0]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[#4FFFB0]" />
                )}
                <Icon size={16} className="flex-shrink-0" />
                {(sidebarOpen || mobile) && (
                  <span className="text-sm font-medium">{label}</span>
                )}
                {!sidebarOpen && !mobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a24] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-200"
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          {(sidebarOpen || mobile) && <span className="text-sm">View Site</span>}
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 w-full"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(sidebarOpen || mobile) && <span className="text-sm">Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080810] flex text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col relative bg-[#0d0d14] border-r border-white/[0.06] flex-shrink-0 overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4FFFB0]/10 to-transparent" />
        <Sidebar />

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all z-10"
        >
          <ChevronRight size={12} className={`transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-[#0d0d14] border-r border-white/[0.08] z-50 flex flex-col"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-4 px-5 border-b border-white/[0.05] bg-[#0a0a12]/80 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/40 hover:text-white transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-[#4FFFB0] animate-pulse" />
            <span className="text-white/30 text-xs font-mono">Admin Online</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
