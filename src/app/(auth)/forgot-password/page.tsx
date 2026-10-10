import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <ForgotPasswordFlow />
      <p className="text-muted-foreground text-center text-sm">
        Remembered it?{" "}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
