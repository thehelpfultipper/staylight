"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type StayGalleryProps = {
  images: string[];
  stayName: string;
};

export function StayGallery({ images, stayName }: StayGalleryProps) {
  const galleryImages = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex];
  const hasMultiple = galleryImages.length > 1;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-border sm:aspect-[2/1]">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${stayName} — photo ${activeIndex + 1} of ${galleryImages.length}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full min-h-[240px] items-center justify-center text-sm text-muted"
            aria-label={`No photos available for ${stayName}`}
          >
            No photos available
          </div>
        )}
      </div>

      {hasMultiple && (
        <ul
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label={`${stayName} photo thumbnails`}
        >
          {galleryImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={`${image}-${index}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show photo ${index + 1} of ${galleryImages.length}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative h-16 w-24 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-28",
                    isActive
                      ? "border-foreground"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
