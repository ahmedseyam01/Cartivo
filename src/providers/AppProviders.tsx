"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { CartProvider } from "./CartProvider";
import { WishlistProvider } from "./WishlistProvider";

export function AppProviders({ locale, t, children }: { locale: Locale; t: Dictionary; children: React.ReactNode }) {
  return (
    <I18nProvider locale={locale} t={t}>
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
    </I18nProvider>
  );
}
