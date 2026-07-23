import { useEffect } from "react";

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keybindings if user is typing inside input, textarea, or contentEditable
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || e.target.isContentEditable) {
        return;
      }

      // Single-key navigation shortcuts
      const key = e.key.toLowerCase();
      const mappings = {
        h: "Home",
        a: "About",
        s: "Skills",
        p: "Projects",
        e: "Experience",
        c: "Contact",
      };

      if (mappings[key]) {
        const section = document.getElementById(mappings[key]);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
