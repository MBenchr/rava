import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteShell from "@/components/site-shell";
import { getFinishLabel, getProductCopy } from "@/lib/isandre/catalog";
import { getPublicPassport } from "@/lib/passports";

type Props = {
  params: Promise<{ serial: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serial } = await params;
  const passport = await getPublicPassport(serial);

  return {
    title: passport ? `Product passport ${passport.serial}` : "Product passport",
    robots: { index: false, follow: false },
  };
}

export default async function PassportPage({ params }: Props) {
  const { serial } = await params;
  const passport = await getPublicPassport(serial);
  if (!passport) notFound();

  const product = getProductCopy(passport.productId, "en");

  return (
    <SiteShell locale="en">
      <main className="min-h-dvh bg-background px-5 pb-24 pt-32 sm:px-8">
        <article className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="eyebrow">ISANDRE product passport</p>
            <h1 className="display-title mt-5 text-6xl sm:text-8xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {product.descriptor} · {getFinishLabel(passport.finishId, "en")}
            </p>
            <dl className="mt-12 grid gap-5 border-t border-border pt-7 sm:grid-cols-2">
              <div>
                <dt className="eyebrow">Serial</dt>
                <dd className="mt-2 font-medium">{passport.serial}</dd>
              </div>
              <div>
                <dt className="eyebrow">Status</dt>
                <dd className="mt-2 font-medium">{passport.status}</dd>
              </div>
              <div>
                <dt className="eyebrow">Edition</dt>
                <dd className="mt-2 font-medium">{passport.edition ?? "—"}</dd>
              </div>
              <div>
                <dt className="eyebrow">Material batch</dt>
                <dd className="mt-2 font-medium">{passport.materialBatch ?? "—"}</dd>
              </div>
            </dl>

            <section className="mt-16">
              <p className="eyebrow">Service history</p>
              {passport.repairs.length ? (
                <div className="mt-6 grid gap-4">
                  {passport.repairs.map((repair) => (
                    <article
                      key={`${repair.completedAt}-${repair.kind}`}
                      className="surface-subtle p-5"
                    >
                      <p className="text-sm font-medium">{repair.kind}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {repair.summary}
                      </p>
                      <time className="mt-4 block text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "long",
                        }).format(new Date(repair.completedAt))}
                      </time>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-muted-foreground">
                  No public service event has been recorded.
                </p>
              )}
            </section>
          </div>

          <aside className="surface h-fit p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Owner service</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Secure owner access, care documents, repair requests and voluntary
              transfer are activated after delivery.
            </p>
            <Link
              href={`mailto:studio@isandre.com?subject=${encodeURIComponent(`Passport ${passport.serial}`)}`}
              className="mt-7 inline-flex min-h-12 items-center underline underline-offset-4"
            >
              Contact client service
            </Link>
          </aside>
        </article>
      </main>
    </SiteShell>
  );
}
