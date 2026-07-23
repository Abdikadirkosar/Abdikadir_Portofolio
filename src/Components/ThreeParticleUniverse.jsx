/**
 * ThreeParticleUniverse.jsx
 * ─────────────────────────
 * A GPU-driven full-screen Three.js particle galaxy that:
 *  • Renders ~4000 particles as a swirling star-field
 *  • Reacts to mouse: the field gently rotates toward the cursor
 *  • Particles pulse in brightness using sin-wave on the GPU (GLSL)
 *  • Uses BufferGeometry + ShaderMaterial for minimal CPU cost
 *  • Respects prefers-reduced-motion
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Vertex shader ─────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aRandom;
  attribute vec3  aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

    // pulsing alpha
    float pulse = sin(uTime * 0.6 + aRandom * 6.2831) * 0.5 + 0.5;
    vAlpha = 0.35 + pulse * 0.55;
    vColor = aColor;

    gl_PointSize = aSize * uPixelRatio * (280.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

// ── Fragment shader ────────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    // Circular point
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    // Soft circle
    float alpha = vAlpha * (1.0 - smoothstep(0.0, 1.0, d));
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ── Palette ───────────────────────────────────────────────────────────────────
const palette = [
  new THREE.Color("#4FFFB0"),  // accent teal
  new THREE.Color("#7abfab"),  // muted teal
  new THREE.Color("#a5f3e8"),  // light cyan
  new THREE.Color("#62a58f"),  // dark teal
  new THREE.Color("#e2e8f0"),  // near-white star
  new THREE.Color("#818cf8"),  // lavender star
];

// ── Main Component ─────────────────────────────────────────────────────────────
const ThreeParticleUniverse = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mount = mountRef.current;
    if (!mount) return;

    // ── Setup ───────────────────────────────────────────────────────────────
    const W = window.innerWidth;
    const H = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 6;

    // ── Particles ───────────────────────────────────────────────────────────
    const COUNT = window.innerWidth < 768 ? 1800 : 4000;

    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const randoms   = new Float32Array(COUNT);
    const colors    = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // Spherical distribution with slight galaxy-disc flattening
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 7;

      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.35; // flatten Y
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i]   = 0.5 + Math.random() * 1.5;
      randoms[i] = Math.random();

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aRandom",  new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute("aColor",   new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:       { value: 0 },
        uPixelRatio: { value: pixelRatio },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Mouse tracking ──────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Animation loop ──────────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      if (!reduceMotion) {
        // Slow galaxy spin
        points.rotation.y = elapsed * 0.04;
        points.rotation.x = elapsed * 0.015;

        // Gentle mouse tilt
        points.rotation.y += (mouse.x * 0.08 - points.rotation.y) * 0.02;
        points.rotation.x += (-mouse.y * 0.05 - points.rotation.x) * 0.02;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ThreeParticleUniverse;
