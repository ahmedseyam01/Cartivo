import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Tile for a category (photo) or brand (logo). */
export function CollectionCard({
  href,
  name,
  image,
  variant = "photo",
  priority = false,
}: {
  href: string;
  name: string;
  image: string;
  variant?: "photo" | "logo";
  priority?: boolean;
}) {
  if (variant === "logo") {
    return (
      <Link
        href={href}
        className="group hover:border-foreground flex flex-col items-center rounded-2xl border bg-white p-4 transition-colors"
      >
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={image}
            alt={name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 200px, 40vw"
            className="object-contain grayscale transition duration-300 group-hover:grayscale-0"
          />
        </div>
        <span className="mt-2 text-sm font-medium">{name}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <span className="mt-3 flex items-center justify-between text-sm font-semibold sm:text-base">
        {name}
        <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </Link>
  );
}
