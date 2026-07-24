/**
 * useVisitorAlert.js
 * ──────────────────
 * Fires a Telegram alert once per browser session when a new visitor
 * lands on the portfolio. Detects country (via ipwho.is), device type,
 * and browser name automatically.
 */

import { useEffect } from "react";
import { sendTelegramVisitorAlert } from "../lib/telegram";

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet 📱";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return "Mobile 📱";
  return "Desktop 💻";
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/"))   return "Edge";
  if (ua.includes("OPR/"))   return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Chrome/"))  return "Chrome";
  if (ua.includes("Safari/"))  return "Safari";
  return "Unknown Browser";
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS"))  return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux"))   return "Linux";
  return "Unknown OS";
}

export function useVisitorAlert() {
  useEffect(() => {
    // Only fire ONCE per browser session — not on every page refresh
    if (sessionStorage.getItem("visitor_alerted")) return;

    const device  = getDeviceType();
    const browser = getBrowserName();
    const os      = getOS();
    const page    = window.location.pathname || "/";
    const referrer = document.referrer
      ? new URL(document.referrer).hostname
      : "Direct";

    // Fetch country from ipwho.is (already CORS-free in this project)
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((geo) => {
        const country = geo?.country || "Unknown";
        const city    = geo?.city    || "";
        const flag    = geo?.flag?.emoji || "";
        const ip      = geo?.ip || "";

        sendTelegramVisitorAlert({
          country: `${flag} ${country}${city ? ` · ${city}` : ""}`,
          device:  `${device} (${os})`,
          browser,
          page,
          referrer,
          ip,
        }).catch(() => {});

        sessionStorage.setItem("visitor_alerted", "1");
      })
      .catch(() => {
        // Fallback: send without geo data
        sendTelegramVisitorAlert({
          country: "🌍 Unknown",
          device: `${device} (${os})`,
          browser,
          page,
          referrer,
        }).catch(() => {});
        sessionStorage.setItem("visitor_alerted", "1");
      });
  }, []);
}
