"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./CartProvider";
import { WishlistProvider } from "./WishlistProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: { background: "#0a0a0a", color: "#fff", borderRadius: "999px", fontSize: "14px" },
          iconTheme: { primary: "#fff", secondary: "#0a0a0a" },
        }}
      />
    </SessionProvider>
  );
}
