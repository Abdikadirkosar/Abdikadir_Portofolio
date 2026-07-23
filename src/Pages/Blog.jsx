import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Tag, ArrowUpRight, Clock, X, BookOpen } from "lucide-react";
import { safeQuery } from "../lib/supabase";
import { useSectionGSAP } from "../hooks/useSectionGSAP";

// ── Default blog posts (shown when DB is empty) ────────────────────────────────
const defaultPosts = [
  {
    id: 1,
    title: "Building Production-Grade RAG Systems with LangChain & pgvector",
    category: "AI",
    tags: ["LangChain", "PostgreSQL", "LLM"],
    cover_image: "",
    content: "A deep dive into building reliable Retrieval-Augmented Generation pipelines — from document ingestion and chunking strategies to embedding models, vector search, and answer synthesis with GPT-4o. Includes real latency benchmarks and accuracy optimizations for multi-language support.",
    created_at: "2024-11-01T00:00:00Z",
    published: true,
  },
  {
    id: 2,
    title: "LangGraph vs AutoGen: Which Multi-Agent Framework Should You Use?",
    category: "AI",
    tags: ["LangGraph", "AutoGen", "Agents"],
    cover_image: "",
    content: "A hands-on comparison of the two leading agentic frameworks. I built the same supervisor-researcher-coder pipeline in both and measured latency, reliability, and developer experience. Includes code samples and when to choose each approach.",
    created_at: "2024-09-14T00:00:00Z",
    published: true,
  },
  {
    id: 3,
    title: "React Performance in 2024: useTransition, Suspense, and Server Components",
    category: "Frontend",
    tags: ["React", "Performance", "Next.js"],
    cover_image: "",
    content: "Modern React has powerful tools for keeping UIs fast. This article explores concurrent features, proper Suspense boundaries, and when Server Components actually help (or hurt) your app — with before/after profiler screenshots.",
    created_at: "2024-07-22T00:00:00Z",
    published: true,
  },
  {
    id: 4,
    title: "PostgreSQL at Scale: Indexing Strategies, CTEs, and JSONB",
    category: "Backend",
    tags: ["PostgreSQL", "SQL", "Performance"],
    cover_image: "",
    content: "After optimizing queries across multi-million row tables, I share the patterns that consistently cut query times by 10x: partial indexes, covering indexes, recursive CTEs, and when JSONB beats a relational schema.",
    created_at: "2024-05-09T00:00:00Z",
    published: true,
  },
  {
    id: 5,
    title: "From Prototype to Production: Deploying FastAPI + Docker + AWS ECS",
    category: "DevOps",
    tags: ["FastAPI", "Docker", "AWS"],
    cover_image: "",
    content: "A step-by-step guide to containerizing a FastAPI application and deploying it with zero-downtime releases on AWS ECS with Fargate, ALB health checks, and auto-scaling policies.",
    created_at: "2024-03-30T00:00:00Z",
    published: true,
  },
  {
    id: 6,
    title: "Building AI-Powered Attendance with DeepFace, OpenCV & Liveness Detection",
    category: "AI",
    tags: ["Computer Vision", "OpenCV", "DeepFace"],
    cover_image: "",
    content: "How I built an enterprise attendance system using DeepFace for recognition, a custom liveness detector to prevent photo spoofing, and a React dashboard for real-time monitoring — deployed across 12 organizations.",
    created_at: "2024-01-15T00:00:00Z",
    published: true,
  },
];

// ── Category accent colors ────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  AI:       { color: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)" },
  Frontend: { color: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)" },
  Backend:  { color: "#4FFFB0", bg: "rgba(79,255,176,0.12)", border: "rgba(79,255,176,0.25)" },
  DevOps:   { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.25)"  },
  Tech:     { color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.25)" },
};
const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Tech;

// ── Format date ───────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return ""; }
};

// ── Estimate reading time ─────────────────────────────────────────────────────
const readTime = (text = "") => Math.max(1, Math.ceil(text.split(/\s+/).length / 200));

// ── Read Modal ────────────────────────────────────────────────────────────────
const ReadModal = ({ post, onClose }) => {
  const cat = getCat(post.category);
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-8 z-10"
        style={{ background: "#0d0d0d", borderColor: `${cat.color}25` }}
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent 10%, ${cat.color}80, transparent 90%)` }} />

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
          <X size={14} />
        </button>

        {/* Category */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ color: cat.color, background: cat.bg, border: `1px solid ${cat.border}` }}>
          <Tag size={10} /> {post.category}
        </span>

        <h2 className="text-xl font-black text-white mb-4 leading-snug">{post.title}</h2>

        <div className="flex items-center gap-4 text-[11px] text-white/35 font-mono mb-6">
          <span className="flex items-center gap-1.5"><Calendar size={10} />{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1.5"><Clock size={10} />{readTime(post.content)} min read</span>
        </div>

        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="w-full rounded-xl mb-6 object-cover max-h-52" />
        )}

        <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-6">
            {(typeof post.tags === "string" ? post.tags.split(",").map(t => t.trim()) : post.tags).map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10 text-white/40 bg-white/[0.03]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Blog Card ─────────────────────────────────────────────────────────────────
const BlogCard = ({ post, index, onClick }) => {
  const cat = getCat(post.category);
  const tags = typeof post.tags === "string" ? post.tags.split(",").map(t => t.trim()) : (post.tags || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border cursor-pointer overflow-hidden flex flex-col"
      style={{ background: "#0d0d12", borderColor: "rgba(255,255,255,0.05)" }}
      whileHover={{ y: -5, borderColor: `${cat.color}25`, transition: { duration: 0.25 } }}
      onClick={onClick}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}08 0%, transparent 65%)` }} />

      {/* HUD corner frames */}
      <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" style={{ borderColor: `${cat.color}60` }} />
      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" style={{ borderColor: `${cat.color}60` }} />
      <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" style={{ borderColor: `${cat.color}60` }} />
      <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" style={{ borderColor: `${cat.color}60` }} />

      {/* Cover image or gradient placeholder */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cat.color}10, ${cat.color}03)` }}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)" }} />
            <BookOpen size={30} style={{ color: `${cat.color}45` }} />
          </div>
        )}
        {/* Gradient fade to card bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d12] opacity-60" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md"
          style={{ color: cat.color, background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date + read time */}
        <div className="flex items-center gap-3 text-[10px] text-white/25 font-mono mb-3">
          <span className="flex items-center gap-1"><Calendar size={9} />{formatDate(post.created_at)}</span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1"><Clock size={9} />{readTime(post.content)} min read</span>
        </div>

        <h3 className="text-white/90 font-bold text-[14.5px] leading-snug mb-3 group-hover:text-white transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-white/35 text-[12px] leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-md border border-white/[0.05] text-white/25 bg-white/[0.02]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Read more */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold transition-all duration-300 mt-auto"
          style={{ color: cat.color }}>
          Read Article <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Bottom trace */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
        style={{ background: `linear-gradient(90deg, ${cat.color}80, transparent)` }} />
    </motion.div>
  );
};

// ── Main Blog Component ───────────────────────────────────────────────────────
const Blog = () => {
  const [posts, setPosts] = useState(defaultPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const sectionRef = useSectionGSAP();

  useEffect(() => {
    safeQuery((sb) =>
      sb.from("db_blogs").select("*").eq("published", true).order("created_at", { ascending: false })
    ).then(({ data }) => {
      if (data && data.length > 0) setPosts(data);
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filtered =
    activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <section
      id="Blog"
      ref={sectionRef}
      className="relative py-28 px-4 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-[#4FFFB0] text-xs font-mono uppercase tracking-[0.3em] mb-4">
            — Thoughts &amp; Insights —
          </p>
          <h2 className="heading text-4xl lg:text-5xl font-black text-white mb-4">
            Articles <span className="text-[#4FFFB0]" style={{ textShadow: "0 0 30px rgba(79,255,176,0.3)" }}>&amp; Blog</span>
          </h2>
          <p className="text-white/30 text-sm mt-3 max-w-sm mx-auto">Technical deep-dives on AI, full-stack engineering, and developer productivity.</p>
          <div className="h-px w-24 mx-auto mt-5 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #4FFFB0, transparent)" }} />
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const c = cat === "All" ? { color: "#4FFFB0", bg: "rgba(79,255,176,0.12)", border: "rgba(79,255,176,0.25)" } : getCat(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-[12px] font-mono font-semibold transition-all duration-300"
                style={{
                  color: isActive ? c.color : "rgba(255,255,255,0.3)",
                  background: isActive ? c.bg : "transparent",
                  border: `1px solid ${isActive ? c.border : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} onClick={() => setSelectedPost(post)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Read modal */}
      <AnimatePresence>
        {selectedPost && <ReadModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Blog;
