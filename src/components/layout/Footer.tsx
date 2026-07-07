import Image from "next/image";
import { withBasePath } from "@/lib/paths";

/**
 * Institutional footer. A flat gradient panel; the Argus mission patch pops
 * out above its top edge (pulled up with a negative margin), with CMU (left)
 * and IST (right) flanking it, all sharing the same bottom baseline.
 */
export function Footer() {
  return (
    <footer className="relative z-10 mt-12 bg-bg">
      <div className="relative mx-auto flex max-w-6xl items-end justify-between gap-2 px-4 pb-10 pt-4 md:px-16">
        <a
          href="https://www.cmu.edu"
          target="_blank"
          rel="noreferrer"
          aria-label="Carnegie Mellon University"
          className="mb-1 shrink-0 transition-transform duration-300 hover:-translate-y-1"
        >
          <Image
            src={withBasePath("/images/logos/cmu.png")}
            alt="Carnegie Mellon University"
            width={280}
            height={280}
            className="h-16 w-auto max-w-none sm:h-20 md:h-36"
          />
        </a>

        {/* the patch: pulled up so it pops out above the panel's top edge */}
        <div className="-mt-24 flex-shrink-0 sm:-mt-32 md:-mt-44">
          <Image
            src={withBasePath("/images/logos/patch.svg")}
            alt="Argus mission patch"
            width={380}
            height={393}
            priority
            className="h-40 w-auto drop-shadow-[0_14px_50px_rgba(0,0,0,0.7)] sm:h-48 md:h-72"
          />
        </div>

        <a
          href="https://tecnico.ulisboa.pt"
          target="_blank"
          rel="noreferrer"
          aria-label="Instituto Superior Técnico"
          className="mb-1 shrink-0 transition-transform duration-300 hover:-translate-y-1"
        >
          <Image
            src={withBasePath("/images/logos/ist.png")}
            alt="Instituto Superior Técnico"
            width={260}
            height={312}
            className="h-16 w-auto max-w-none sm:h-20 md:h-36"
          />
        </a>
      </div>
    </footer>
  );
}
