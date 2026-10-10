import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Heart, Package } from "lucide-react";
import { getAccessToken, getCurrentUser } from "@/lib/auth/session";
import { fetchAddresses } from "@/lib/api/account";
import { format } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { AddressBook } from "@/components/account/AddressBook";
import { SignOutButton } from "@/components/account/SignOutButton";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).profile.title };
}

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

export default async function ProfilePage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const [token, user] = await Promise.all([getAccessToken(), getCurrentUser()]);
  if (!token || !user) redirect("/login?callbackUrl=/profile");

  const addresses = await fetchAddresses(token).catch(() => []);

  const shortcuts = [
    { href: "/allorders", label: t.nav.orders, text: t.profile.ordersText, icon: Package },
    { href: "/wishlist", label: t.nav.wishlist, text: t.profile.wishlistText, icon: Heart },
  ];

  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title={format(t.profile.greeting, { name: user.name.split(" ")[0] })}
        description={user.email}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.account }]}
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
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        ))}
      </div>

      <Section title={t.profile.personal} description={t.profile.personalText}>
        <ProfileForm name={user.name} email={user.email} />
      </Section>
      <Section title={t.profile.addresses} description={t.profile.addressesText}>
        <AddressBook initialAddresses={addresses} />
      </Section>
      <Section title={t.profile.password} description={t.profile.passwordText}>
        <PasswordForm />
      </Section>
    </div>
  );
}
