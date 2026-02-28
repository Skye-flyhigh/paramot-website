import { Camera } from 'lucide-react';
import Image from 'next/image';

import type { ServiceImage as ServiceImageType } from '@/data/service-pages';

interface ServiceImageProps {
  image: ServiceImageType;
}

export default function ServiceImage({ image }: ServiceImageProps) {
  if (!image.src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-linear-to-br from-sky-50 to-sky-100">
        <div className="text-center text-sky-300">
          <Camera className="mx-auto mb-2 h-8 w-8" />
          <p className="text-sm">Photo coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <figure>
      <Image
        src={image.src}
        alt={image.alt}
        width={800}
        height={450}
        className="rounded-xl"
      />
      {image.caption && (
        <figcaption className="mt-2 text-center text-sm text-sky-500">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
