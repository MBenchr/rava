import Link from "next/link";

import { productVariants, siteMeta } from "@/lib/rava-content";

export default function FicheTechniquePage() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] px-6 py-24 text-[var(--color-ink)]">
      <div className="mx-auto max-w-4xl space-y-10">
        <Link href="/" className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Retour au site
        </Link>
        <header className="space-y-4">
          <p className="eyebrow">Document provisoire</p>
          <h1 className="font-[var(--font-display)] text-5xl leading-none md:text-7xl">
            Fiche technique
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            Les spécifications détaillées, tolérances et instructions d’installation seront
            consolidées dans la version finale. Cette V1 expose déjà les données commerciales
            cohérentes du site.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {productVariants.map((variant) => (
            <article
              key={variant.id}
              className="rounded-[2rem] border border-black/8 bg-white/55 p-8"
            >
              <p className="eyebrow">{variant.piece}</p>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl leading-none">
                {variant.title}
              </h2>
              <dl className="mt-6 space-y-4 text-[var(--color-muted)]">
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">Dimensions</dt>
                  <dd>{variant.dimensions}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">Usage</dt>
                  <dd>{variant.usage}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">Prix indicatif</dt>
                  <dd>{siteMeta.priceFrom}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
