import { LogoMark } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container flex min-h-[calc(100dvh-12rem)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <LogoMark className="mx-auto mb-6 size-12" />
        {children}
      </div>
    </div>
  );
}
