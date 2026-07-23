import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    // Loading state
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#4FFFB0]/30 border-t-[#4FFFB0] rounded-full animate-spin" />
          <p className="text-white/30 text-xs font-mono tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
