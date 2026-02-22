"use client";

import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import Link from "next/link";

function LandingContent() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl space-y-8">
        <h1 className="font-display text-5xl sm:text-7xl neon-pink animate-neon-flicker leading-tight">
          Hot Diggity
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/80">
          Rate, rank, and relish every stop on the ultimate hot dog crawl.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isLoading && user ? (
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-pink px-8 py-3 text-lg font-medium text-white hover:shadow-[0_0_20px_var(--neon-pink)] transition-all"
            >
              View Roadmap
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-pink px-8 py-3 text-lg font-medium text-white hover:shadow-[0_0_20px_var(--neon-pink)] transition-all"
            >
              Join the Crawl
            </Link>
          )}
        </div>
        <div className="flex items-center justify-center gap-8 pt-8 text-muted">
          <div className="text-center">
            <div className="text-3xl">🌭</div>
            <div className="text-sm mt-1">Enjoy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl">⭐️</div>
            <div className="text-sm mt-1">Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl">🏆</div>
            <div className="text-sm mt-1">Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <LandingContent />
      </AuthProvider>
    </SupabaseProvider>
  );
}
