import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./Pages/NotFound";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CursorFollower from "./Components/CursorFollower";
import CustomCursor from "./Components/CustomCursor";
import SectionProgress from "./Components/SectionProgress";
import NavBar from "./Components/NavBar";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Skills from "./Pages/Skills";
import Projects from "./Pages/Projects";
import Experience from "./Pages/Experience";
import Education from "./Pages/Education";
import Certificates from "./Pages/Certificates";
import Testimonials from "./Pages/Testimonials";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contect";
import Aurora from "./Pages/Home/components/Aurora";
import Home from "./Pages/Home/Home";
import Intro from "./Components/Intro";
import NeuralBackground from "./Components/NeuralBackground";
import ScrollProgress from "./Components/ScrollProgress";
import GradientMesh from "./Components/GradientMesh";
import { useState, useEffect } from "react";
import BackToTop from "./Components/BackToTop";
import Marquee from "./Components/Marquee";
import Footer from "./Components/Footer";
import { usePageViews } from "./hooks/usePageViews";
import { safeQuery } from "./lib/supabase";
import { SoundProvider, SoundToggle } from "./Components/SoundManager";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import AIChatbot from "./Components/AIChatbot";
import InteractiveTerminal from "./Components/InteractiveTerminal";
import AIPlayground from "./Components/AIPlayground";
import KeyboardShortcuts from "./Components/KeyboardShortcuts";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Admin
import AdminApp from "./admin/AdminApp";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";
import Dashboard from "./admin/pages/Dashboard";
import ManageProjects from "./admin/pages/ManageProjects";
import ManageBlog from "./admin/pages/ManageBlog";
import ManageExperience from "./admin/pages/ManageExperience";
import ManageEducation from "./admin/pages/ManageEducation";
import ManageCertificates from "./admin/pages/ManageCertificates";
import ManageTestimonials from "./admin/pages/ManageTestimonials";
import Messages from "./admin/pages/Messages";
import Settings from "./admin/pages/Settings";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// ── Section IDs for sound dispatching ────────────────────────────────────────
const SECTIONS = ["Home", "About", "Services", "Skills", "Projects", "Experience", "Education", "Certificates", "Testimonials", "Blog", "Contact"];

function useSectionSounds() {
  useEffect(() => {
    const observers = SECTIONS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            window.dispatchEvent(new CustomEvent("sectionEnter", { detail: { id } }));
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);
}

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [accentColor, setAccentColor] = useState("#4FFFB0");
  usePageViews("home");
  useSectionSounds();

  useEffect(() => {
    const loadSettings = async () => {
      // 1. Sync SEO
      const { data: seoData } = await safeQuery((sb) =>
        sb.from("db_seo").select("*").eq("id", 1).single()
      );
      if (seoData) {
        if (seoData.meta_title) document.title = seoData.meta_title;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        if (seoData.meta_desc) metaDesc.content = seoData.meta_desc;

        let metaKeys = document.querySelector('meta[name="keywords"]');
        if (!metaKeys) {
          metaKeys = document.createElement("meta");
          metaKeys.name = "keywords";
          document.head.appendChild(metaKeys);
        }
        if (seoData.keywords) metaKeys.content = seoData.keywords;
      }

      // 2. Sync Appearance (dynamic accent colors)
      const { data: appData } = await safeQuery((sb) =>
        sb.from("db_appearance").select("*").eq("id", 1).single()
      );
      if (appData && appData.accent_color) {
        const accent = appData.accent_color;
        setAccentColor(accent);
        document.documentElement.style.setProperty("--accent", accent);

        const r = parseInt(accent.slice(1, 3), 16);
        const g = parseInt(accent.slice(3, 5), 16);
        const b = parseInt(accent.slice(5, 7), 16);
        document.documentElement.style.setProperty(
          "--accent-dim",
          `rgba(${r}, ${g}, ${b}, 0.18)`
        );
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!showIntro) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [showIntro]);

  return (
    <main>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div key="intro" style={{ position: "fixed", inset: 0, zIndex: 999 }}>
            <Intro onFinish={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* ── Global chrome ────────────────────────────────────────── */}
          <CustomCursor />
          <SectionProgress />
          <ScrollProgress />
          <NeuralBackground />
          <CursorFollower />
          <BackToTop />
          <SoundToggle />

          {/* ── Hero section with aurora ──────────────────────────────── */}
          <div className="relative overflow-hidden bg-[#0A0A0A]">
            {/* Aurora background */}
            <div className="absolute inset-0 z-0">
              <Aurora
                colorStops={[accentColor, "#0c021b", "#020108"]}
                blend={0.7}
                amplitude={1.25}
                speed={0.45}
              />
            </div>

            {/* Gradient fade-out overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(10,10,10,0.04)_34%,rgba(10,10,10,0.72)_56%,#0A0A0A_78%)]" />

            <div className="relative z-20">
              <NavBar />
              <Home />
            </div>
          </div>

          {/* ── Main sections ─────────────────────────────────────────── */}
          <Marquee />
          <About />
          <Services />
          <Skills />
          <InteractiveTerminal />
          <Projects />
          <AIPlayground />
          <Experience />
          <Education />
          <Certificates />
          <Testimonials />
          <Blog />
          {/* Contact wrapped in gradient mesh for ambient depth */}
          <div className="relative overflow-hidden">
            <GradientMesh opacity={0.4} />
            <Contact />
          </div>
          <Footer />

          {/* Global Hotkey Keyboard Shortcuts & Floating AI Assistant */}
          <KeyboardShortcuts />
          <AIChatbot />
        </motion.div>
      )}

    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <SoundProvider>
            <Routes>
              {/* Public portfolio */}
              <Route path="/" element={<AppContent />} />

              {/* Admin login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminApp /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="blog" element={<ManageBlog />} />
                <Route path="experience" element={<ManageExperience />} />
                <Route path="education" element={<ManageEducation />} />
                <Route path="certificates" element={<ManageCertificates />} />
                <Route path="testimonials" element={<ManageTestimonials />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          </SoundProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
