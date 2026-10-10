import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2 text-sm">Sign in to your Cartivo account.</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="text-muted-foreground text-center text-sm">
        New to Cartivo?{" "}
        <Link href="/register" className="text-foreground font-medium underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
