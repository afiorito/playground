"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useRatings } from "@/lib/hooks/use-ratings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StarDisplay } from "@/components/ratings/star-display";
import { LogOut, User, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const supabase = useSupabase();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user's ratings across all places
  const [userRatings, setUserRatings] = useState<
    { id: string; score: number; place_name: string; place_id: string; created_at: string }[]
  >([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchUserRatings() {
      const { data } = await supabase
        .from("ratings")
        .select("id, score, place_id, created_at, places(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (data) {
        setUserRatings(
          data.map((r: any) => ({
            id: r.id,
            score: r.score,
            place_name: r.places?.name ?? "Unknown",
            place_id: r.place_id,
            created_at: r.created_at,
          })),
        );
      }
      setRatingsLoading(false);
    }
    fetchUserRatings();
  }, [supabase, user]);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName || null })
      .eq("id", user.id);

    setIsSaving(false);
    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl sm:text-3xl neon-pink">Profile</h1>

      {/* Profile form */}
      <div className="rounded-xl border border-surface-border bg-surface p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-border flex items-center justify-center">
            <User size={20} className="text-muted" />
          </div>
          <div>
            <div className="font-medium">{profile?.display_name || "Anonymous"}</div>
          </div>
          {isAdmin && (
            <span className="ml-auto flex items-center gap-1 text-xs text-neon-orange">
              <Shield size={12} />
              Admin
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted">Display Name</label>
          <div className="flex gap-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Rating history */}
      <div>
        <h2 className="font-display text-lg neon-cyan mb-3">
          Your Ratings ({userRatings.length})
        </h2>
        {ratingsLoading ? (
          <LoadingSpinner />
        ) : userRatings.length === 0 ? (
          <p className="text-muted text-center py-8">
            You haven&apos;t rated any stops yet. Get out there and taste some dogs!
          </p>
        ) : (
          <div className="space-y-2">
            {userRatings.map((r) => (
              <Link
                key={r.id}
                href={`/place?id=${r.place_id}`}
                className="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-3 hover:border-neon-cyan/50 transition-colors"
              >
                <span className="font-medium">{r.place_name}</span>
                <div className="flex items-center gap-2">
                  <StarDisplay rating={r.score} size={14} />
                  <span className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sign out */}
      <Button variant="ghost" onClick={signOut} className="w-full">
        <LogOut size={16} />
        Sign Out
      </Button>
    </div>
  );
}
