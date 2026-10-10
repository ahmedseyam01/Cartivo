import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Heart, Package } from "lucide-react";
import { getAccessToken, getCurrentUser } from "@/lib/auth/session";
import { fetchAddresses } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { AddressBook } from "@/components/account/AddressBook";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata: Metadata = { title: "My account" };

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t py-10 md:grid-cols-[260px_1fr]">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default async function ProfilePage() {
  const [token, user] = await Promise.all([getAccessToken(), getCurrentUser()]);
  if (!token || !user) redirect("/login?callbackUrl=/profile");

  const addresses = await fetchAddresses(token).catch(() => []);

  const shortcuts = [
    { href: "/allorders", label: "Orders", text: "Track and review purchases", icon: Package },
    { href: "/wishlist", label: "Wishlist", text: "Products you saved", icon: Heart },
  ];

  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title={`Hi, ${user.name.split(" ")[0]}`}
        description={user.email}
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Account" }]}
        action={<SignOutButton />}
      />

      <div className="grid gap-3 pb-10 sm:grid-cols-2">
        {shortcuts.map(({ href, label, text, icon: Icon }) => (
          <Link key={href} href={href} className="hover:border-foreground flex items-center gap-4 rounded-2xl border p-5 transition-colors">
            <span className="bg-muted flex size-11 items-center justify-center rounded-full">
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{label}</span>
              <span className="text-muted-foreground text-sm">{text}</span>
            </span>
            <ChevronRight className="size-4" />
          </Link>
        ))}
      </div>

      <Section title="Personal information" description="Update your name, email and phone number.">
        <ProfileForm name={user.name} email={user.email} />
      </Section>
      <Section title="Addresses" description="Saved addresses appear at checkout.">
        <AddressBook initialAddresses={addresses} />
      </Section>
      <Section title="Password" description="Use at least 8 characters with upper & lower case, a number and a symbol.">
        <PasswordForm />
      </Section>
    </div>
  );
}
