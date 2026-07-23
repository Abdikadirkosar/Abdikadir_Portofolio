import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — Animates a number from 0 to `target` when `trigger` becomes true.
 * @param {number}  target   — Final value to count to
 * @param {number}  duration — Animation duration in ms (default 1800)
 * @param {boolean} trigger  — Start the animation when true
 */
const useCountUp = (target, duration = 1800, trigger = true) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const startTime = performance.now();
    const start = 0;

    const ease = (t) => 1 - Math.pow(1 - t, 4); // ease-out-quart

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + ease(progress) * (target - start));
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger]);

  return value;
};

export default useCountUp;
