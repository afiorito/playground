"use client";

import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        {children}
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
    </SupabaseProvider>
  );
}
