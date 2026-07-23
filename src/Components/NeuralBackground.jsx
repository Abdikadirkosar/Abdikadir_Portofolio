import { useEffect, useRef } from "react";

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const mouse = { x: W / 2, y: H / 2 };

    // ─── Particle Config ───────────────────────────────────────────
    const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 75;
    const CONNECTION_DIST = window.innerWidth < 768 ? 90 : 140;
    const MOUSE_REPEL_DIST = 90;
    const MOUSE_ATTRACT_DIST = 180;

    // Helper to get active accent color
    const getAccent = () => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#4FFFB0";
    };

    // ─── Cyber Grid Config ──────────────────────────────────────────
    const GRID_SIZE = 110;
    
    // ─── Matrix Stream Config ────────────────────────────────────────
    const CHARS = "0101010101ABCDEFUX".split("");
    const streams = Array.from({ length: Math.ceil(window.innerWidth / 70) }, (_, i) => ({
      x: i * 70 + Math.random() * 20,
      y: Math.random() * -H,
      speed: Math.random() * 1.5 + 1.2,
      chars: Array.from({ length: Math.floor(Math.random() * 8) + 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
    }));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = (Math.random() - 0.5) * 0.22;
        this.radius = Math.random() * 1.2 + 0.6;
        this.alpha = Math.random() * 0.35 + 0.2;
        this.pulseSpeed = Math.random() * 0.012 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.age = 0;
      }

      update(t) {
        this.age++;
        this.x += this.vx;
        this.y += this.vy;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_DIST) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
          this.x -= dx * force * 0.025;
          this.y -= dy * force * 0.025;
        } else if (dist < MOUSE_ATTRACT_DIST) {
          const force = (dist - MOUSE_REPEL_DIST) / (MOUSE_ATTRACT_DIST - MOUSE_REPEL_DIST);
          this.x += dx * force * 0.0025;
          this.y += dy * force * 0.0025;
        }

        if (this.x < -30) this.x = W + 30;
        if (this.x > W + 30) this.x = -30;
        if (this.y < -30) this.y = H + 30;
        if (this.y > H + 30) this.y = -30;

        this.alpha = 0.2 + Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.1;
      }

      draw(accentColor) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    const drawGrid = (accentColor) => {
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.35;
      
      // Horizontal lines
      for (let y = 0; y < H; y += GRID_SIZE) {
        const opacity = 0.018 * (1 - y / H);
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x < W; x += GRID_SIZE) {
        ctx.globalAlpha = 0.015;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawMatrixStreams = (accentColor) => {
      ctx.save();
      ctx.font = "8px monospace";
      
      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > H + 60) {
          s.y = Math.random() * -180;
          s.x = Math.random() * W;
        }

        s.chars.forEach((c, idx) => {
          const charY = s.y - idx * 10;
          if (charY > 0 && charY < H) {
            // Fades as it reaches the tail
            const opacity = (1 - idx / s.chars.length) * 0.06;
            ctx.globalAlpha = opacity;
            ctx.fillStyle = accentColor;
            ctx.fillText(c, s.x, charY);
          }
        });
      });
      ctx.restore();
    };

    const drawConnections = (accentColor) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.18;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const drawMouseLines = (accentColor) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.35;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    let rafId;
    let t = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;
      t++;

      ctx.clearRect(0, 0, W, H);
      const activeColor = getAccent();

      drawGrid(activeColor);
      drawMatrixStreams(activeColor);
      drawConnections(activeColor);
      drawMouseLines(activeColor);
      
      particles.forEach((p) => {
        p.update(t);
        p.draw(activeColor);
      });
    };

    animate();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles.forEach((p) => p.reset());
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
};

export default NeuralBackground;
