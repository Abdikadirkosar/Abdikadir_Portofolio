import { useEffect, useRef } from "react";

const OrbitalDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width = canvas.parentElement.offsetWidth || 500);
    let H = (canvas.height = 360);

    const center = { x: W / 2, y: H / 2 };
    const mouse = { x: center.x, y: center.y };

    const skills = [
      { name: "LLMs", r: 50, speed: 0.015, angle: 0, color: "#a855f7" },
      { name: "Python", r: 90, speed: -0.01, angle: 1.5, color: "#3b82f6" },
      { name: "PyTorch", r: 90, speed: 0.012, angle: 4.2, color: "#f43f5e" },
      { name: "React", r: 130, speed: 0.008, angle: 0.5, color: "#06b6d4" },
      { name: "Node.js", r: 130, speed: -0.007, angle: 3.0, color: "#22c55e" },
      { name: "DevOps", r: 160, speed: 0.005, angle: 5.5, color: "#ef4444" },
    ];

    const animate = (t) => {
      if (document.hidden) {
        requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, W, H);

      // ── Draw background grid lines & outer circle ──────────────────
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center.x, center.y, 160, 0, Math.PI * 2);
      ctx.stroke();

      // Radar sweeps
      const sweepAngle = (t * 0.001) % (Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(
        center.x + Math.cos(sweepAngle) * 160,
        center.y + Math.sin(sweepAngle) * 160
      );
      ctx.stroke();

      // ── Draw Orbit Rings ───────────────────────────────────────────
      [50, 90, 130, 160].forEach((radius) => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // ── Draw Central Core (AI Brain) ───────────────────────────────
      const corePulse = 18 + Math.sin(t * 0.004) * 3;
      const gradient = ctx.createRadialGradient(
        center.x, center.y, 2,
        center.x, center.y, corePulse
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center.x, center.y, corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Core text
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI CORE", center.x, center.y);

      // ── Update and Draw Nodes ──────────────────────────────────────
      skills.forEach((s) => {
        s.angle += s.speed;

        // Base coordinates
        let nx = center.x + Math.cos(s.angle) * s.r;
        let ny = center.y + Math.sin(s.angle) * s.r;

        // Magnet attraction to mouse
        const dx = mouse.x - nx;
        const dy = mouse.y - ny;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          const force = (45 - dist) / 45;
          nx += dx * force * 0.55;
          ny += dy * force * 0.55;
          // Glow link connection
          ctx.strokeStyle = `${s.color}35`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }

        // Draw connection back to center core
        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // Glowing node dot
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node label
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "500 10px Inter, sans-serif";
        ctx.textAlign = nx > center.x ? "left" : "right";
        ctx.fillText(s.name, nx + (nx > center.x ? 8 : -8), ny);
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = center.x;
      mouse.y = center.y;
    };

    const handleResize = () => {
      W = canvas.width = canvas.parentElement.offsetWidth || 500;
      center.x = W / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center p-2 bg-neutral-900/35 border border-white/[0.04] rounded-2xl backdrop-blur-md">
      <canvas ref={canvasRef} className="max-w-full block" />
    </div>
  );
};

export default OrbitalDiagram;
