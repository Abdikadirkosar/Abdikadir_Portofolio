import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#4FFFB0] via-[#7abfab] to-[#4FFFB0]"
        style={{
          width: "0%",
          boxShadow: "0 0 10px #4FFFB0, 0 0 20px rgba(79, 255, 176, 0.6)",
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
