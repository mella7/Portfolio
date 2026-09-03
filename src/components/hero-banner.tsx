import Image from "next/image";

// Full-bleed banner photo at the top of the homepage.
//
// Two techniques worth knowing here:
//   - `w-screen left-1/2 -translate-x-1/2` breaks the image out of the
//     centred max-width column so it spans the whole viewport.
//   - `-mt-14` pulls it up behind the 56px-tall sticky header, so the bar
//     floats over the photo rather than sitting above it.
export function HeroBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative -mt-14 left-1/2 w-screen -translate-x-1/2">
      <div className="relative h-[280px] sm:h-[380px] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Darkened top edge so white header text stays legible whatever the
            photo looks like, and a fade into the page background below. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
      </div>
    </div>
  );
}
