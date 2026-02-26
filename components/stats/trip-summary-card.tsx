"use client";

import { StarDisplay } from "@/components/ratings/star-display";
import { Button } from "@/components/ui/button";
import type { TripStatsData } from "@/lib/utils/stats";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface TripSummaryCardProps {
  stats: TripStatsData;
}

export function TripSummaryCard({ stats }: TripSummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#0a0a0f",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "hot-diggity-trip-summary.png";
      link.href = dataUrl;
      link.click();
      toast.success("Summary card downloaded!");
    } catch {
      toast.error("Failed to generate image.");
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#0a0a0f",
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "hot-diggity-trip-summary.png", {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "Hot Diggity Trip Summary",
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch {
      toast.error("Failed to share.");
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="rounded-xl border border-surface-border bg-surface p-6 space-y-4"
      >
        <div className="text-center">
          <h2
            className="font-display text-2xl neon-pink"
            style={{ fontFamily: "var(--font-bungee-shade)" }}
          >
            Hot Diggity
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-mono font-bold neon-cyan">
              {stats.visitedStops}/{stats.totalStops}
            </div>
            <div className="text-xs text-muted">Stops Visited</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold neon-yellow">
              {stats.totalRatings}
            </div>
            <div className="text-xs text-muted">Total Ratings</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold neon-green">
              {stats.overallAvgRating?.toFixed(1) ?? "—"}
            </div>
            <div className="text-xs text-muted">Avg Rating</div>
          </div>
        </div>

        {stats.topRatedStop && (
          <div className="text-center pt-2 border-t border-surface-border">
            <div className="text-xs text-muted mb-1">Top Rated Stop</div>
            <div className="font-medium">{stats.topRatedStop.name}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <StarDisplay rating={stats.topRatedStop.avg} size={14} />
              <span className="text-sm font-mono text-neon-yellow">
                {stats.topRatedStop.avg.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="w-full bg-surface-border rounded-full h-2 mt-2">
            <div
              className="bg-neon-green h-2 rounded-full transition-all"
              style={{ width: `${stats.tripProgress}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-1">
            {stats.tripProgress.toFixed(0)}% Complete
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleDownload} className="flex-1">
          <Download size={16} />
          Download
        </Button>
        <Button variant="secondary" onClick={handleShare} className="flex-1">
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );
}
