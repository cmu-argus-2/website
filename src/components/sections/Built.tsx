import Image from "next/image";
import { builtInHouse } from "@/content/copy";
import { withBasePath } from "@/lib/paths";

const PHOTOS: { src: string; caption: string; span?: string }[] = [
  { src: "vibe-test-opened-on-bench.webp", caption: "flight unit open on the bench", span: "md:col-span-2 md:row-span-2" },
  { src: "testing-campaign-power-testing.webp", caption: "power testing, both units" },
  { src: "vibe-test-satellite-in-pod.webp", caption: "stowed in the deployer pod" },
  { src: "final-testing-deployed-satellite.webp", caption: "deployment test" },
  { src: "final-testing-tied-up.webp", caption: "ready for integration" },
];

export function Built() {
  return (
    <section data-section="built" className="relative z-10 min-h-svh">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <div data-reveal className="max-w-2xl">
          <p className="mono-label text-cyan">The build</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{builtInHouse.headline}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{builtInHouse.body}</p>
        </div>
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
          {PHOTOS.map((photo) => (
            <figure
              key={photo.src}
              data-reveal
              className={`group relative overflow-hidden rounded-lg border hairline ${photo.span ?? ""}`}
            >
              <Image
                src={withBasePath(`/images/updates/${photo.src}`)}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="mono-label absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-3 pb-2 pt-8 text-[10px] text-fg/90">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
