"use client";

import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <QueryProvider>
        <AuthProvider>
        <AuthGuard>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-4xl">
              {children}
            </main>
            <MobileNav />
          </div>
        </AuthGuard>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              border: "1px solid #2a2a4a",
              color: "#e0e0e8",
            },
          }}
        />
      </AuthProvider>
      </QueryProvider>
    </SupabaseProvider>
  );
}
