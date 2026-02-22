"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/roadmap");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col gap-2 mb-8 text-center">
        <h1 className="font-display text-4xl sm:text-5xl neon-pink animate-neon-flicker mb-2">
          Hot Diggity
        </h1>
        <p className="text-muted text-lg">Enter your name to join the crawl</p>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-surface-border bg-surface p-8">
        <LoginForm />
      </div>
    </div>
  );
}
