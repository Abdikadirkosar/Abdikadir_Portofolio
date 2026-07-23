import React from "react";

const row1 = [
  "Generative AI & LLMs",
  "Full-Stack R&D",
  "Python Automation",
  "PyTorch Deep Learning",
  "React.js & Next.js",
  "Intelligent UI/UX",
  "Vector DB / Supabase",
  "LangChain Agent Workflows",
];

const row2 = [
  "PostgreSQL Databases",
  "Docker Containerization",
  "Scalable API Systems",
  "Cloud Deployments AWS/GCP",
  "Intelligent Software Development",
  "Interactive Data Visualizations",
  "Modern Interface Engineering",
  "Machine Learning Pipelines",
];

const Marquee = () => {
  return (
    <div className="relative py-12 overflow-hidden bg-neutral-950/60 border-y border-white/[0.04] flex flex-col gap-5 w-full select-none">
      {/* Gradients on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-l from-neutral-950 via-neutral-950/40 to-transparent" />

      {/* Row 1 - Left */}
      <div className="flex overflow-hidden w-full">
        <div className="flex gap-4 shrink-0 animate-scroll-left will-change-transform">
          {/* Double array for seamless loop */}
          {[...row1, ...row1, ...row1].map((text, idx) => (
            <div key={idx} className="flex items-center gap-4 shrink-0">
              <span
                className="text-xs md:text-sm px-4 py-2 rounded-full font-mono font-semibold tracking-wider text-black border border-transparent"
                style={{
                  backgroundColor: "#4FFFB0",
                  boxShadow: "0 0 15px rgba(79, 255, 176, 0.2)",
                }}
              >
                {text}
              </span>
              <span className="text-[#4FFFB0] text-sm font-bold opacity-60">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Right */}
      <div className="flex overflow-hidden w-full">
        <div className="flex gap-4 shrink-0 animate-scroll-right will-change-transform">
          {[...row2, ...row2, ...row2].map((text, idx) => (
            <div key={idx} className="flex items-center gap-4 shrink-0">
              <span className="text-xs md:text-sm px-4 py-2 rounded-full font-mono font-medium tracking-wide text-white/70 border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                {text}
              </span>
              <span className="text-[#4FFFB0] text-sm font-bold opacity-60">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
