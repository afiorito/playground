"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      theme="dark"
      toastOptions={{
        style: {
          background: "#1a1a2e",
          border: "1px solid #2a2a4a",
          color: "#e0e0e8",
        },
      }}
    />
  );
}
