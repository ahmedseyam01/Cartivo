"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Sends the visitor to the login page and brings them back here afterwards. */
export function useSignInRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }, [router, pathname]);
}
