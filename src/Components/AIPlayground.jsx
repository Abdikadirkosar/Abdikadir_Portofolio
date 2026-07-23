import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play, Cpu, CheckCircle2, RotateCcw, Copy, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const samplePrompts = [
  {
    id: "rag",
    title: "RAG Vector Pipeline",
    model: "GPT-4o + Pinecone",
    prompt: "Extract semantic keyframes and index into Vector DB for enterprise search.",
    output: `[STATUS: RUNNING]
-> Initializing Embedding Model: text-embedding-3-large
-> Chunking Document: 1,420 tokens processed.
-> Generating Dense Vector Embeddings (1536 dims)...
-> Upserting vectors into Pinecone Index ('enterprise-docs')...
[SUCCESS]: 42 vectors indexed. Query latency: 12ms. Similarity Score: 0.962.`
  },
  {
    id: "agent",
    title: "Autonomous AI Agent",
    model: "Claude 3.5 Sonnet",
    prompt: "Analyze repository code for performance bottlenecks and propose microservice refactoring.",
    output: `[STATUS: AGENT THINKING]
-> Agent Tool Call: git_grep_search("database_query")
-> Identified Bottleneck: N+1 query pattern in main router.
-> Executing Refactor Tool: Converting to Async Batch Loader.
[PROPOSAL GENERATED]: Refactored 3 files. Reduced database roundtrips by 84%.`
  },
  {
    id: "vision",
    title: "Computer Vision Model",
    model: "YOLOv8 + OpenCV",
    prompt: "Detect object bounding boxes and calculate confidence scores in real-time frame.",
    output: `[STATUS: INFERENCE COMPLETE]
-> Frame Resolution: 1920x1080 @ 60 FPS
-> Object Detected: 'Laptop' (Confidence: 98.4%, BBox: [120, 240, 600, 800])
-> Object Detected: 'Developer' (Confidence: 99.1%, BBox: [40, 10, 1080, 1920])
[STATUS]: Low-latency edge inference verified.`
  }
];

export default function AIPlayground() {
  const { lang } = useLanguage();
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(samplePrompts[0].output);
  const [copied, setCopied] = useState(false);

  const handleRun = (promptItem) => {
    setSelectedPrompt(promptItem);
    setIsRunning(true);
    setOutput("Executing AI pipeline...");

    setTimeout(() => {
      setOutput(promptItem.output);
      setIsRunning(false);
    }, 800);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 p-6 rounded-2xl border border-[#4FFFB0]/30 bg-[#0d0d12]/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4FFFB0]/15 border border-[#4FFFB0]/30 flex items-center justify-center text-[#4FFFB0]">
            <Sparkles size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              {lang === "SO" ? "AI Live Playground Demo" : "AI Live Playground Demo"}
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#4FFFB0]/10 text-[#4FFFB0] font-normal border border-[#4FFFB0]/20">
                LIVE_DEMO
              </span>
            </h3>
            <p className="text-xs text-white/40 font-mono">
              {lang === "SO" ? "Tijaabi awoodda moodallada AI ee uu Abdikadir dhisay" : "Test interactive AI model pipelines & architecture simulations"}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#4FFFB0] flex items-center gap-1.5 bg-[#4FFFB0]/5 px-3 py-1 rounded-full border border-[#4FFFB0]/20">
          <Cpu size={14} /> Model: {selectedPrompt.model}
        </span>
      </div>

      {/* Preset Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {samplePrompts.map((item) => (
          <button
            key={item.id}
            onClick={() => handleRun(item)}
            className={`p-3.5 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              selectedPrompt.id === item.id
                ? "bg-[#4FFFB0]/15 border-[#4FFFB0]/50 text-white shadow-[0_0_20px_rgba(79,255,176,0.15)]"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <span className="text-xs font-bold font-mono text-[#4FFFB0]">{item.title}</span>
            <span className="text-[11px] text-white/40 mt-1 line-clamp-1">{item.prompt}</span>
          </button>
        ))}
      </div>

      {/* Terminal Output Screen */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-hidden min-h-[160px]">
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 text-white/30 text-[10px]">
          <span>PIPELINE_CONSOLE // {selectedPrompt.title.toUpperCase()}</span>
          <button
            onClick={copyOutput}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy Console"}</span>
          </button>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed font-mono">
          {isRunning ? (
            <span className="animate-pulse text-[#4FFFB0]">⚡ Executing AI neural pipeline...</span>
          ) : (
            output
          )}
        </pre>
      </div>
    </div>
  );
}
