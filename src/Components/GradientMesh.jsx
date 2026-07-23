import { useEffect, useRef } from "react";

/**
 * GradientMesh — Animated SVG turbulence gradient mesh background.
 * Creates a living, morphing ambient gradient effect.
 * Responds subtly to mouse position.
 */
const GradientMesh = ({ opacity = 0.55, className = "" }) => {
  const svgRef    = useRef(null);
  const turbRef   = useRef(null);
  const animRef   = useRef(null);
  const seedRef   = useRef(0);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Track mouse for subtle parallax shift
    const onMouse = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Slowly advance the turbulence seed to create motion
    let frame = 0;
    const loop = () => {
      frame++;
      if (turbRef.current && frame % 3 === 0) {
        seedRef.current += 0.008;
        turbRef.current.setAttribute("baseFrequency",
          `${0.008 + mouseRef.current.x * 0.003} ${0.010 + mouseRef.current.y * 0.003}`
        );
        turbRef.current.setAttribute("seed", String(Math.floor(seedRef.current * 100) % 300));
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="gradient-mesh-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.008 0.010"
              numOctaves="4"
              seed="42"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="220"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradient blobs */}
          <radialGradient id="blob1" cx="20%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#4FFFB0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob2" cx="80%" cy="70%" r="55%">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob3" cx="55%" cy="15%" r="50%">
            <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Layered gradient blobs */}
        <rect width="100%" height="100%" fill="url(#blob1)" />
        <rect width="100%" height="100%" fill="url(#blob2)" />
        <rect width="100%" height="100%" fill="url(#blob3)" />

        {/* The distortion layer */}
        <rect
          width="100%"
          height="100%"
          fill="url(#blob1)"
          filter="url(#gradient-mesh-filter)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default GradientMesh;
