import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MagneticButton = ({ children, className = "", strength = 0.4, ...props }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const isMobile = window.matchMedia("(hover: none)").matches;
    if (isMobile) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      gsap.to(btn, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={btnRef} className={`inline-block ${className}`} style={{ willChange: "transform" }} {...props}>
      {children}
    </div>
  );
};

export default MagneticButton;
