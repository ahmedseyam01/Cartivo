"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto md:max-h-[560px] md:flex-col md:overflow-y-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors md:size-20",
                i === active ? "border-foreground" : "border-transparent hover:border-border",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="bg-muted relative aspect-square flex-1 overflow-hidden rounded-2xl">
        <Image
          key={images[active]}
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="animate-in fade-in object-cover duration-300"
        />
      </div>
    </div>
  );
}
