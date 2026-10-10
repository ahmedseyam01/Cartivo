import { PageHeader } from "./PageHeader";

/** Layout for static content pages (about, policies, help). */
export function InfoPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-container max-w-3xl">
      <PageHeader title={title} description={description} breadcrumbs={[{ href: "/", label: "Home" }, { label: title }]} />
      <div className="text-muted-foreground space-y-8 leading-relaxed [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
