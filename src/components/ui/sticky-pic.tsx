import Image from 'next/image';

interface Picture {
  url: string;
  alt: string;
}

export default function StickyPicture({ picture }: { picture: Picture }) {
  return (
    <div className="relative h-[50vh]" style={{ clipPath: 'inset(0)' }}>
      <div className="fixed inset-0 h-screen w-full">
        <Image
          src={picture.url}
          alt={picture.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
