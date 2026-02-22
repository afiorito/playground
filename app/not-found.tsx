import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-4">
        <div className="text-6xl">🌭</div>
        <h1 className="font-display text-4xl neon-pink">404</h1>
        <p className="text-lg text-muted">
          This page went the way of the last hot dog at a cookout — gone without
          a trace.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-neon-cyan px-6 py-2.5 text-sm text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
