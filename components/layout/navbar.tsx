"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils/cn";
import { Map, Trophy, BarChart3, User, Shield, LogOut } from "lucide-react";

const navLinks = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile, isAdmin, signOut } = useAuth();

  return (
    <nav className="hidden md:block border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto max-w-4xl px-4 flex items-center justify-between h-16">
        <Link href="/roadmap" className="flex items-center gap-2">
          <span className="font-display text-xl neon-pink">Hot Diggity</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === href
                  ? "text-neon-cyan bg-neon-cyan/10"
                  : "text-muted hover:text-foreground hover:bg-surface-border/30",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === "/admin"
                  ? "text-neon-orange bg-neon-orange/10"
                  : "text-muted hover:text-foreground hover:bg-surface-border/30",
              )}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-border/30 transition-colors ml-2"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
