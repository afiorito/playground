"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils/cn";
import { Map, Trophy, BarChart3, User, Shield } from "lucide-react";

const tabs = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-surface-border bg-surface/95 backdrop-blur-sm">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-colors",
              pathname === href
                ? "text-neon-cyan"
                : "text-muted",
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-colors",
              pathname === "/admin"
                ? "text-neon-orange"
                : "text-muted",
            )}
          >
            <Shield size={20} />
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
