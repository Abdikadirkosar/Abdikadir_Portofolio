import { useEffect } from "react";
import { safeQuery } from "../lib/supabase";

/**
 * usePageViews — tracks a page visit in Supabase.
 * Call once per page/section with the page name.
 */
export function usePageViews(page = "home") {
  useEffect(() => {
    const trackView = async () => {
      const device =
        window.innerWidth < 768
          ? "mobile"
          : window.innerWidth < 1024
          ? "tablet"
          : "desktop";

      // Parse Browser
      const ua = navigator.userAgent;
      let browser = "Other";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("SamsungBrowser")) browser = "Samsung";
      else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
      else if (ua.includes("Edge") || ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";

      // Parse Referrer
      let referrer = "Direct";
      if (document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.hostname !== window.location.hostname) {
            referrer = refUrl.hostname;
          }
        } catch (err) {}
      }

      // Detect Country (using CORS-free API)
      let country = "Global";
      try {
        const res = await fetch("https://ipwho.is/", { mode: "cors" });
        if (res.ok) {
          const json = await res.json();
          country = json.country || "Global";
        }
      } catch (e) {
        country = "Global";
      }

      safeQuery((sb) =>
        sb.from("page_views").insert([{ page, device, browser, country, referrer }])
      ).catch(() => {});
    };

    trackView();
  }, [page]);
}

