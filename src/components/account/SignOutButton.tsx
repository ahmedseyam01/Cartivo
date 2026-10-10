"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

export function SignOutButton() {
  const { t } = useI18n();
  return (
    <Button variant="outline" className="h-10 rounded-full" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut /> {t.menu.signOut}
    </Button>
  );
}
