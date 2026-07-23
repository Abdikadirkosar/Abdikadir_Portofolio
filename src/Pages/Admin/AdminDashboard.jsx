import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, User, Briefcase, Cpu, Landmark, GraduationCap, Award, FileText,
  Mail, BarChart2, MessageSquare, Shield, Image, Globe, Palette, Settings,
  LogOut, Menu, X, ChevronRight
} from "lucide-react";

// Tab Imports
import DashboardHome from "./tabs/DashboardHome";
import ProfileTab from "./tabs/ProfileTab";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import ExperienceTab from "./tabs/ExperienceTab";
import EducationTab from "./tabs/EducationTab";
import CertificatesTab from "./tabs/CertificatesTab";
import BlogTab from "./tabs/BlogTab";
import MessagesTab from "./tabs/MessagesTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import ServicesTab from "./tabs/ServicesTab";
import MediaTab from "./tabs/MediaTab";
import SeoTab from "./tabs/SeoTab";
import AppearanceTab from "./tabs/AppearanceTab";
import SettingsTab from "./tabs/SettingsTab";

const menuItems = [
  { id: "dashboard",    label: "Dashboard",     Icon: Home,           category: "General" },
  { id: "profile",      label: "Profile",       Icon: User,           category: "General" },
  { id: "projects",     label: "Projects",      Icon: Briefcase,      category: "Content" },
  { id: "skills",       label: "Skills",        Icon: Cpu,            category: "Content" },
  { id: "experience",   label: "Experience",    Icon: Landmark,       category: "Content" },
  { id: "education",    label: "Education",     Icon: GraduationCap,  category: "Content" },
  { id: "certificates", label: "Certificates",  Icon: Award,          category: "Content" },
  { id: "blog",         label: "Blog",          Icon: FileText,       category: "Content" },
  { id: "messages",     label: "Messages",      Icon: Mail,           category: "Communications" },
  { id: "analytics",    label: "Analytics",     Icon: BarChart2,      category: "Communications" },
  { id: "testimonials", label: "Testimonials",  Icon: MessageSquare,  category: "Content" },
  { id: "services",     label: "Services",      Icon: Shield,         category: "Content" },
  { id: "media",        label: "Media",         Icon: Image,          category: "Settings" },
  { id: "seo",          label: "SEO",           Icon: Globe,          category: "Settings" },
  { id: "appearance",   label: "Appearance",    Icon: Palette,        category: "Settings" },
  { id: "settings",     label: "Settings",      Icon: Settings,       category: "Settings" },
];

const AdminDashboard = ({ onLogout }) => {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderActiveView = () => {
    switch (active) {
      case "dashboard":    return <DashboardHome setActiveTab={setActive} />;
      case "profile":      return <ProfileTab />;
      case "projects":     return <ProjectsTab />;
      case "skills":       return <SkillsTab />;
      case "experience":   return <ExperienceTab />;
      case "education":    return <EducationTab />;
      case "certificates": return <CertificatesTab />;
      case "blog":         return <BlogTab />;
      case "messages":     return <MessagesTab />;
      case "analytics":    return <AnalyticsTab />;
      case "testimonials": return <TestimonialsTab />;
      case "services":     return <ServicesTab />;
      case "media":        return <MediaTab />;
      case "seo":          return <SeoTab />;
      case "appearance":   return <AppearanceTab />;
      case "settings":     return <SettingsTab />;
      default:             return <DashboardHome setActiveTab={setActive} />;
    }
  };

  // Group items by category
  const categories = ["General", "Content", "Communications", "Settings"];

  return (
    <div className="min-h-screen bg-[#020307] text-white flex overflow-hidden font-sans">
      
      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 70 }}
        className="hidden md:flex flex-col border-r border-white/[0.06] bg-[#03040a]/90 backdrop-blur-md relative z-30 h-screen overflow-hidden flex-shrink-0"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-[#4FFFB0] bg-[#4FFFB0]/10 border border-[#4FFFB0]/20 flex-shrink-0">
              A
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-white text-xs font-bold leading-none">Abdikadir</p>
                <p className="text-[#4FFFB0] text-[8px] font-mono tracking-widest uppercase mt-0.5">ADMIN COCKPIT</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight size={16} className={`transform transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5 scrollbar-thin">
          {categories.map((cat) => {
            const items = menuItems.filter((item) => item.category === cat);
            return (
              <div key={cat} className="flex flex-col gap-1">
                {sidebarOpen && (
                  <p className="px-3 text-[9px] font-mono tracking-widest text-white/20 uppercase mb-1">{cat}</p>
                )}
                {items.map(({ id, label, Icon }) => {
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left ${
                        isActive
                          ? "bg-[#4FFFB0]/10 text-[#4FFFB0] border border-[#4FFFB0]/15"
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-[#4FFFB0]" : "text-white/40 group-hover:text-white/80"} />
                      {sidebarOpen && <span className="truncate">{label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer / View Site & Logout */}
        <div className="p-3 border-t border-white/[0.06] flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#4FFFB0]/80 hover:text-[#4FFFB0] hover:bg-[#4FFFB0]/5 transition-all duration-200 text-left border border-transparent hover:border-[#4FFFB0]/10"
          >
            <Globe size={14} className="text-[#4FFFB0]" />
            {sidebarOpen && <span>View Website</span>}
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 text-left"
          >
            <LogOut size={14} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── MOBILE MENU ────────────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#020307]/90 backdrop-blur-md border-b border-white/[0.06] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-[#4FFFB0] bg-[#4FFFB0]/10 border border-[#4FFFB0]/20">A</div>
          <span className="text-white text-xs font-bold font-mono tracking-widest uppercase">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/50 hover:text-white p-2">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 bg-[#03040a] border-r border-white/[0.06] flex flex-col pt-16"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
              {categories.map((cat) => {
                const items = menuItems.filter((item) => item.category === cat);
                return (
                  <div key={cat} className="flex flex-col gap-1">
                    <p className="text-[9px] font-mono tracking-widest text-white/20 uppercase mb-1">{cat}</p>
                    {items.map(({ id, label, Icon }) => {
                      const isActive = active === id;
                      return (
                        <button
                          key={id}
                          onClick={() => { setActive(id); setSidebarOpen(false); }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-[#4FFFB0]/10 text-[#4FFFB0]"
                              : "text-white/40 hover:text-white/80"
                          }`}
                        >
                          <Icon size={16} />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/[0.06] flex flex-col gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#4FFFB0] bg-[#4FFFB0]/5 border border-[#4FFFB0]/10"
              >
                <Globe size={16} />
                <span>View Website</span>
              </a>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/5 transition-all duration-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen pt-14 md:pt-0 overflow-y-auto">
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
