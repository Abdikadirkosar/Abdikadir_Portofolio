import { useRef } from "react";
import { motion } from "framer-motion";

/**
 * RippleButton — Drop-in wrapper that adds a green ripple on click.
 * Usage: <RippleButton className="..." onClick={...}>Label</RippleButton>
 */
const RippleButton = ({ children, className = "", style = {}, onClick, ...props }) => {
  const containerRef = useRef(null);

  const handleClick = (e) => {
    const btn = containerRef.current;
    if (!btn) return;

    const rect    = btn.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height) * 2;
    const x       = e.clientX - rect.left - size / 2;
    const y       = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
      position:   "absolute",
      borderRadius: "50%",
      width:      `${size}px`,
      height:     `${size}px`,
      left:       `${x}px`,
      top:        `${y}px`,
      background: "rgba(79,255,176,0.22)",
      transform:  "scale(0)",
      animation:  "ripple-expand 0.55s ease-out forwards",
      pointerEvents: "none",
    });

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };

  return (
    <motion.button
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default RippleButton;
