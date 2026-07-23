import React, { useRef, useState } from "react";

/**
 * ThreeDTilt — Premium GPU-accelerated 3D tilt + animated SVG border trace + dynamic glare.
 */
export default function ThreeDTilt({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.02,
  accentColor = "#4FFFB0",
  borderRadius = "16px",
  glowColor,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const resolvedGlow = glowColor || `${accentColor}22`;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -maxTilt * 2;
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x, y });
    setGlare({ x: glareX, y: glareY, opacity: 0.22 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none overflow-hidden ${className}`}
      style={{
        transform: isHovered
          ? `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${scale})`
          : "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: isHovered
          ? "transform 0.08s ease-out, box-shadow 0.3s ease"
          : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
        boxShadow: isHovered
          ? `0 20px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}30, 0 0 30px ${resolvedGlow}`
          : "0 4px 20px -8px rgba(0,0,0,0.5)",
        borderRadius,
      }}
    >
      {/* SVG animated border tracer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-40"
        fill="none"
        style={{ borderRadius }}
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          stroke={accentColor}
          strokeWidth="1.5"
          style={{
            strokeDasharray: 1500,
            strokeDashoffset: isHovered ? 0 : 1500,
            transition: "stroke-dashoffset 1.2s ease-in-out",
            filter: `drop-shadow(0 0 5px ${accentColor}80)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      </svg>

      {/* Content with depth */}
      <div
        style={{
          transform: "translateZ(15px)",
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </div>

      {/* Dynamic glare */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 150px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.18), transparent 70%)`,
          transition: "opacity 0.25s ease",
          borderRadius,
        }}
      />

      {/* Top-edge highlight shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}
