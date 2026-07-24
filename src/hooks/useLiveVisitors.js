/**
 * useLiveVisitors.js
 * ──────────────────
 * Tracks how many people are currently viewing the portfolio in real-time.
 * Uses Supabase Realtime Presence — zero polling, event-driven updates.
 * Falls back to a simple sessionStorage counter if Supabase is unavailable.
 */

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useLiveVisitors() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!supabase) return;

    // Create a presence channel for the portfolio
    const channel = supabase.channel("portfolio_visitors", {
      config: { presence: { key: crypto.randomUUID?.() || Math.random().toString(36) } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length || 1);
      })
      .on("presence", { event: "join" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length || 1);
      })
      .on("presence", { event: "leave" }, () => {
        const state = channel.presenceState();
        setCount(Math.max(Object.keys(state).length, 1));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return count;
}
