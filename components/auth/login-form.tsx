"use client";

import { useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function LoginForm() {
  const supabase = useSupabase();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter your name!");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          display_name: trimmed,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      router.replace("/roadmap");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm text-muted">
          Your name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Frank McWiener"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? "Joining..." : "Join the Crawl"}
      </Button>
    </form>
  );
}
