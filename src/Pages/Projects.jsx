import React, { useState, useEffect } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaHeart, FaRegHeart } from "react-icons/fa";
import { Globe, Search, X } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import ThreeDTilt from "../Components/ThreeDTilt";
import { useSectionGSAP } from "../hooks/useSectionGSAP";
import { useLanguage } from "../context/LanguageContext";

// ── Project data ──────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    name: "School Management System",
    bgImage: "/projects-images/Screenshot 2026-05-16 022624.png",
    desc: "A comprehensive administrative system built in C# to manage student enrollments, class scheduling, teacher assignments, grading databases, and academic reporting. Designed for local educational institutes to digitalise their workflows.",
    tech: ["C#", "SQL Server", "Windows Forms", ".NET Framework"],
    link: "https://github.com/abdikadirkosar",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 2,
    name: "Hotel Management System",
    bgImage: "/projects-images/Screenshot 2026-05-16 050538.png",
    desc: "An enterprise-level reservation and operations suite. Features room availability trackers, reservation scheduling, check-in/check-out billing systems, staff allocation, and detailed financial log reports, built entirely in C#.",
    tech: ["C#", "SQL Server", "Windows Forms", ".NET Framework"],
    link: "https://github.com/abdikadirkosar",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 3,
    name: "Gym Management System",
    bgImage: "/projects-images/Screenshot 2026-05-16 050329.png",
    desc: "A custom desktop utility for local fitness centers. Manages member registrations, gym membership subscription statuses, payment tracking, trainer schedules, and member check-ins with an intuitive UI.",
    tech: ["C#", "SQL Server", "Windows Forms", ".NET Framework"],
    link: "https://github.com/abdikadirkosar",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 4,
    name: "AI Agent & Chatbot Integrator",
    bgImage: "/projects-images/Screenshot 2026-05-16 050434.png",
    desc: "A web platform that integrates generative AI models to build custom chatbots. Features context-aware prompt templates, conversational memory, and simple RAG document Q&A to answer user queries dynamically.",
    tech: ["React.js", "Python", "LangChain", "Generative AI", "Supabase"],
    link: "https://github.com/abdikadirkosar",
    category: "AI",
    featured: true,
  },
];

// ── Tech colors ───────────────────────────────────────────────────────────────
const techColors = {
  "React.js":      "bg-blue-500/20 text-blue-300 border-blue-500/20",
  "Node.js":       "bg-green-500/20 text-green-300 border-green-500/20",
  "PostgreSQL":    "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
  "Next.js":       "bg-teal-500/20 text-teal-300 border-teal-500/20",
  "MongoDB":       "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  "Python":        "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
  "LangChain":     "bg-orange-500/20 text-orange-300 border-orange-500/20",
  "Generative AI": "bg-pink-500/20 text-pink-300 border-pink-500/20",
  "Django":        "bg-purple-500/20 text-purple-300 border-purple-500/20",
  "OpenCV":        "bg-rose-500/20 text-rose-300 border-rose-500/20",
  "Supabase":      "bg-teal-500/20 text-teal-300 border-teal-500/20",
  "AWS":           "bg-amber-500/20 text-amber-300 border-amber-500/20",
  "Docker":        "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
  "Redis":         "bg-red-500/20 text-red-300 border-red-500/20",
  "FastAPI":       "bg-lime-500/20 text-lime-300 border-lime-500/20",
  "PyTorch":       "bg-orange-500/20 text-orange-300 border-orange-500/20",
  "C#":            "bg-purple-500/20 text-purple-300 border-purple-500/20",
  "SQL Server":    "bg-red-500/20 text-red-300 border-red-500/20",
  "Windows Forms": "bg-blue-500/20 text-blue-300 border-blue-500/20",
  ".NET Framework":"bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
};

const filters = ["All", "AI", "Full Stack"];

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
// ── Fast Instant Image Loader (Zero Slow Motion) ─────────────────────────────
const ProgressiveImage = ({ src, alt, className, style, minHeight }) => {
  const [imgSrc, setImgSrc] = useState(src || "/projects-images/Screenshot 2026-05-16 022624.png");

  useEffect(() => {
    if (src) setImgSrc(src);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-900/40" style={{ minHeight }}>
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={style}
        loading="eager"
        onError={() => setImgSrc("/projects-images/dramatic-storm-clouds-vast-barren-field.jpg")}
      />
    </div>
  );
};

// ── Project Detail Modal Component ───────────────────────────────────────────
const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#0d0d12] border border-[#4FFFB0]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,255,176,0.15)] text-white"
        >
          {/* Header Image */}
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={project.bgImage || "/projects-images/Screenshot 2026-05-16 022624.png"}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "/projects-images/dramatic-storm-clouds-vast-barren-field.jpg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/60 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#4FFFB0] hover:text-black transition-all duration-300 z-20"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-6 z-10">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-md bg-[#4FFFB0]/20 text-[#4FFFB0] border border-[#4FFFB0]/30 backdrop-blur-md">
                {project.category}
              </span>
              <h2 className="text-2xl font-bold mt-2 text-white">{project.name}</h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">{project.desc}</p>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#4FFFB0] mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4FFFB0] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(79,255,176,0.3)]"
              >
                <FaGithub size={14} /> View GitHub Repo
              </a>
              {project.live_link && (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/20 transition-all"
                >
                  <Globe size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, large = false, likesCount = 0, onLike, onSelect }) => {
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    // Check local storage if already liked
    const likedProjects = JSON.parse(localStorage.getItem("liked_projects") || "[]");
    setLiked(likedProjects.includes(project.id));
  }, [project.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (liked) return; // Only allow one like per session

    const likedProjects = JSON.parse(localStorage.getItem("liked_projects") || "[]");
    likedProjects.push(project.id);
    localStorage.setItem("liked_projects", JSON.stringify(likedProjects));
    setLiked(true);
    
    // Callback to update parent state
    onLike(project.id);

    // Save to Supabase
    await safeQuery((sb) =>
      sb.from("project_likes").insert([{ project_id: project.id }])
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.3 } }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl overflow-hidden ${large ? "row-span-2" : ""}`}
      onClick={() => onSelect && onSelect(project)}
    >
      <ThreeDTilt className="relative group overflow-hidden rounded-2xl bg-[#0d0d12]/90 border border-white/[0.05] outline-none cursor-pointer h-full w-full" maxTilt={6}>
        {/* Image via Progressive Loader */}
        <ProgressiveImage
          src={project.bgImage}
          alt={`${project.name} preview`}
          className="w-full h-full object-cover transition-all duration-700 lg:grayscale group-hover:grayscale-0 group-hover:scale-105"
          minHeight={large ? "300px" : "180px"}
        />

        {/* Permanent subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 z-[2]" />

        {/* Hover dark overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 z-[1]" />

        {/* Category badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#4FFFB0]/10 text-[#4FFFB0] border border-[#4FFFB0]/20 backdrop-blur-md">
            {project.category}
          </span>
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-3.5 right-3.5 z-20 flex gap-2">
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className={`w-8 h-8 flex items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
              liked
                ? "bg-red-500/20 border-red-500/35 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "bg-white/5 border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/35 hover:bg-red-500/10"
            }`}
            title={liked ? "Liked!" : "Like this project"}
          >
            {liked ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
          </motion.button>

          {/* GitHub link button */}
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-[#4FFFB0] hover:border-[#4FFFB0]/35 hover:bg-[#4FFFB0]/10 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            title="View on GitHub"
          >
            <FaGithub size={13} />
          </motion.a>

          {/* Live Demo button */}
          {project.live_link && (
            <motion.a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/25 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              title="Live Demo"
            >
              <Globe size={12} />
            </motion.a>
          )}
        </div>

        {/* Content — fully responsive — cinematic slide-up reveal */}
        <div className="absolute bottom-0 left-0 p-5 text-white z-10 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h2 className={`font-bold tracking-wide transition-all duration-500 lg:translate-y-8 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${large ? "text-lg md:text-xl" : "text-sm md:text-base"}`}>
                {project.name}
              </h2>
              <MdOutlineArrowOutward className="text-[#4FFFB0] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:opacity-0 lg:group-hover:opacity-100" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/35 font-mono lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
              <FaHeart size={10} className={liked ? "text-red-400" : ""} />
              <span>{likesCount}</span>
            </div>
          </div>

          <p className="text-[12.5px] text-gray-300/85 leading-relaxed line-clamp-2 mb-3.5 transition-all duration-500 delay-75 lg:translate-y-6 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3 transition-all duration-500 delay-100 lg:translate-y-5 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {project.tech.map((t, i) => (
              <span
                key={i}
                className={`text-[9px] font-mono tracking-wide px-2.5 py-0.5 rounded-md border backdrop-blur-sm ${techColors[t] || "bg-white/5 text-white/60 border-white/5"}`}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Cinematic CTA — morphs in on hover */}
          <div className="transition-all duration-500 delay-150 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(project);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                background: "rgba(79,255,176,0.08)",
                border: "1px solid rgba(79,255,176,0.25)",
                color: "#4FFFB0",
                boxShadow: "0 0 14px rgba(79,255,176,0.08)",
              }}
            >
              Case Study <MdOutlineArrowOutward size={11} />
            </button>
          </div>
        </div>

        {/* Cinematic scanline sweep on hover */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl"
        >
          <div
            className="absolute left-0 right-0 h-[1px] scanline-anim"
            style={{ background: "linear-gradient(90deg, transparent, rgba(79,255,176,0.35), transparent)" }}
          />
        </div>

        {/* HUD Border Trace */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(79,255,176,0.25), 0 0 35px rgba(79,255,176,0.06)",
          }}
        />
      </ThreeDTilt>
    </motion.div>
  );
};



// ── Main Projects Component ───────────────────────────────────────────────────
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [likes, setLikes] = useState({});
  const [dbProjects, setDbProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    // Fetch projects from Supabase, fallback to static if empty/unavailable
    const load = async () => {
      const { data } = await safeQuery((sb) =>
        sb.from("db_projects").select("*").order("created_at", { ascending: false })
      );
      if (data && data.length > 0) {
        // Normalize DB fields to match the component's expected shape
        const normalized = data.map((p) => ({
          id: p.id,
          name: p.name,
          bgImage: p.image_url || "",
          desc: p.description || "",
          tech: typeof p.tech === "string" ? p.tech.split(",").map(t => t.trim()) : (p.tech || []),
          link: p.github_link || p.live_link || "https://github.com/abdikadirkosar",
          live_link: p.live_link,
          category: p.category || "Full Stack",
          featured: p.featured,
          status: p.status,
        }));
        setDbProjects(normalized);
      } else {
        setDbProjects(projects); // fallback to static
      }
    };

    // Fetch likes count for all projects
    const getLikes = async () => {
      const { data } = await safeQuery((sb) =>
        sb.from("project_likes").select("project_id")
      );
      if (data) {
        const counts = {};
        data.forEach(({ project_id }) => {
          counts[project_id] = (counts[project_id] || 0) + 1;
        });
        setLikes(counts);
      }
    };

    load();
    getLikes();
  }, []);

  const handleLikeUpdate = (projectId) => {
    setLikes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1,
    }));
  };

  const { t } = useLanguage();
  const PROJECTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Use DB projects (once loaded) or fallback to static
  const source = dbProjects ?? projects;
  const filtered = source.filter((p) => {
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) || 
      (p.tech && p.tech.some(t => t.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filtered.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  return (
    <section
      ref={sectionRef}
      id="Projects"
      className="min-h-screen bg-neutral-950 px-4 sm:px-6 py-12 pt-20 relative"
      style={{ background: "#0A0A0A" }}
    >
      {/* Project Details Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse, rgba(79,255,176,1) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "10%",
        }}
      />

      {/* Heading */}
      <div className="text-center mb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="hud-badge">projects.system</span>
        </motion.div>

        <h1 className="gsap-title text-3xl md:text-4xl font-black flex gap-2 justify-center flex-wrap">
          <span className="heading-premium gsap-word">Selected</span>
          <span className="heading-italic gsap-word">Projects</span>
        </h1>

        <p className="gsap-desc text-gray-400 mt-3 max-w-sm mx-auto text-sm opacity-0">
          AI-powered systems and full-stack solutions built with precision.
        </p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 justify-center mt-8 flex-wrap"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeFilter === f
                  ? "bg-[#4FFFB0]/15 border-[#4FFFB0]/50 text-[#4FFFB0] shadow-[0_0_20px_rgba(79,255,176,0.2)]"
                  : "bg-transparent border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
              }`}
            >
              {f === "All" ? t.projects.all : f}
            </button>
          ))}
        </motion.div>

        {/* Live Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="max-w-md mx-auto mt-6 relative"
        >
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-4 text-[#4FFFB0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.projects.searchPlaceholder}
              className="w-full bg-[#0d0d12]/80 border border-white/10 rounded-full pl-11 pr-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#4FFFB0]/50 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 p-1 rounded-full text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFilter}-${currentPage}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto min-h-[450px] mt-4"
        >
          {/* Left — big card */}
          {paginatedProjects[0] && (
            <ProjectCard
              project={paginatedProjects[0]}
              index={0}
              large
              likesCount={likes[paginatedProjects[0].id] || 0}
              onLike={handleLikeUpdate}
              onSelect={setSelectedProject}
            />
          )}

          {/* Right — 3 smaller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-rows-2 gap-4">
              {paginatedProjects[2] && (
                <ProjectCard
                  project={paginatedProjects[2]}
                  index={1}
                  likesCount={likes[paginatedProjects[2].id] || 0}
                  onLike={handleLikeUpdate}
                  onSelect={setSelectedProject}
                />
              )}
              {paginatedProjects[3] && (
                <ProjectCard
                  project={paginatedProjects[3]}
                  index={2}
                  likesCount={likes[paginatedProjects[3].id] || 0}
                  onLike={handleLikeUpdate}
                  onSelect={setSelectedProject}
                />
              )}
            </div>
            {paginatedProjects[1] && (
              <ProjectCard
                project={paginatedProjects[1]}
                index={3}
                likesCount={likes[paginatedProjects[1].id] || 0}
                onLike={handleLikeUpdate}
                onSelect={setSelectedProject}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 z-10 relative">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/70 hover:border-[#4FFFB0] hover:text-[#4FFFB0] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? "bg-[#4FFFB0] text-black shadow-[0_0_15px_rgba(79,255,176,0.3)]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/70 hover:border-[#4FFFB0] hover:text-[#4FFFB0] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-12"
      >
        <a
          href="https://github.com/abdikadirkosar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#4FFFB0] text-sm transition-all duration-300 group border border-white/10 hover:border-[#4FFFB0]/30 px-6 py-3 rounded-full hover:bg-[#4FFFB0]/5"
        >
          <FaGithub size={16} />
          View all projects on GitHub
          <MdOutlineArrowOutward className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
