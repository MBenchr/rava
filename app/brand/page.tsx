import type { Metadata } from "next";
import Image from "next/image";

import {
  brandAssets,
  brandPalette,
  brandTypography,
  finishPalette,
  originPlateSpec,
} from "@/lib/isandre/brand";

export const metadata: Metadata = {
  title: "Brand system",
  description: "Internal ISANDRE and ṬĀQA identity reference.",
  robots: { index: false, follow: false },
};

const permanentColours = [
  ["Ink", brandPalette.ink],
  ["Limewash", brandPalette.limewash],
  ["Paper", brandPalette.paper],
  ["Stone", brandPalette.stone],
  ["Umber", brandPalette.umber],
  ["Passage Cobalt", brandPalette.passageCobalt],
] as const;

const finishes = [
  ["Chalk / Craie", finishPalette.chalk],
  ["Butter / Beurre", finishPalette.butter],
  ["Sage / Sauge", finishPalette.sage],
  ["Rose Clay / Argile rose", finishPalette["rose-clay"]],
] as const;

export default function BrandGuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="page-shell grid min-h-[72svh] content-between py-10 sm:py-16">
        <div className="flex items-start justify-between gap-8">
          <Image
            src={brandAssets.wordmark.ink}
            alt="ISANDRE"
            width={1000}
            height={180}
            priority
            unoptimized
            className="h-auto w-40 sm:w-56"
          />
          <p className="eyebrow text-right">Identity A4.1<br />27.07.2026</p>
        </div>
        <div className="grid gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_1.2fr]">
          <p className="eyebrow">ISANDRE / ṬĀQA</p>
          <h1 className="display-title max-w-4xl text-6xl sm:text-8xl lg:text-[9rem]">
            A place made in the material.
          </h1>
        </div>
      </section>

      <section className="bg-[var(--brand-ink)] py-20 text-[var(--brand-limewash)] sm:py-28">
        <div className="page-shell grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-white/45">Primary mark</p>
            <Image
              src={brandAssets.wordmark.paper}
              alt="ISANDRE"
              width={1000}
              height={180}
              unoptimized
              className="mt-12 h-auto w-full max-w-2xl"
            />
          </div>
          <div className="grid grid-cols-[9rem_1fr] items-center gap-10">
            <Image
              src={brandAssets.entaille.paper}
              alt="L'ENTAILLE"
              width={100}
              height={155}
              unoptimized
              className="h-auto w-full"
            />
            <div>
              <p className="eyebrow !text-white/45">Secondary sign</p>
              <h2 className="display-title mt-5 text-6xl">L&apos;Entaille</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
                One dense block. One exact subtraction. No arch, effect or repeated pattern.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Colour system</p>
            <h2 className="display-title mt-5 text-6xl sm:text-8xl">The interface stays quiet.</h2>
          </div>
          <div className="grid gap-10">
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
              {permanentColours.map(([name, value]) => (
                <div key={name} className="bg-background p-3">
                  <div className="aspect-[4/3]" style={{ background: value }} />
                  <p className="mt-3 text-sm font-medium">{name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {finishes.map(([name, value]) => (
                <div key={name} className="bg-background p-3">
                  <div className="aspect-square" style={{ background: value }} />
                  <p className="mt-3 text-xs font-medium">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-20 sm:py-28">
        <div className="page-shell grid gap-14 lg:grid-cols-3">
          <div>
            <p className="eyebrow">Display</p>
            <p className="display-title mt-5 text-7xl">{brandTypography.display}</p>
          </div>
          <div>
            <p className="eyebrow">Interface</p>
            <p className="mt-5 text-5xl font-medium">{brandTypography.interface}</p>
          </div>
          <div>
            <p className="eyebrow">References</p>
            <p className="mt-5 font-medium tabular-nums tracking-[.16em]">TQ-S01-CRA<br />NO 000127</p>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">La Marque d&apos;origine</p>
            <h2 className="display-title mt-5 text-6xl sm:text-8xl">Proof is part of the object.</h2>
            <dl className="mt-10 grid gap-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between"><dt>Format</dt><dd>{originPlateSpec.widthMm} × {originPlateSpec.heightMm} mm</dd></div>
              <div className="flex justify-between"><dt>Material</dt><dd>{originPlateSpec.material}</dd></div>
              <div className="flex justify-between"><dt>Finish</dt><dd className="text-right">{originPlateSpec.finish}</dd></div>
              <div className="flex justify-between"><dt>Status</dt><dd>Physical prototype required</dd></div>
            </dl>
          </div>
          <div className="grid place-items-center bg-secondary p-8 sm:p-16">
            <Image
              src="/brand/plate/isandre-origin-plate-proof.svg"
              alt="ISANDRE origin plate prototype"
              width={4207}
              height={2600}
              loading="eager"
              unoptimized
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-cobalt)] py-20 text-white sm:py-28">
        <div className="page-shell grid gap-12 lg:grid-cols-2">
          <h2 className="display-title max-w-3xl text-6xl sm:text-8xl">The room continues.</h2>
          <div className="grid content-end gap-5 text-sm leading-7 text-white/75">
            <p>No invented origin, workshop, owner, press, popularity or scarcity.</p>
            <p>No geometry drift, decorative arch, fake alphabet or repeated Entaille.</p>
            <p>Generated images create desire. Real images create proof. Their status stays explicit.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
