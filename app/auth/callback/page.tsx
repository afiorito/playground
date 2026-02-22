"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AuthCallbackPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          return;
        }
        router.replace("/roadmap");
        return;
      }

      // Fallback: check if session was already established via hash detection
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/roadmap");
        return;
      }

      setError("No authentication code found. Please try signing in again.");
    };

    handleCallback();
  }, [supabase, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <p className="text-red-400">{error}</p>
            <a
              href="/auth/login"
              className="text-neon-cyan underline underline-offset-4"
            >
              Back to Login
            </a>
          </>
        ) : (
          <>
            <LoadingSpinner size="lg" />
            <p className="text-muted">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}
