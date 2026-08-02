import type { Metadata } from "next";

import ServiceRequestForm from "@/components/service-request-form";
import SiteShell from "@/components/site-shell";
import { getContent } from "@/content";
import {
  normalizeFinishId,
  normalizeProductId,
} from "@/lib/isandre/catalog";
import type { ServiceRequestKind } from "@/lib/service-requests/types";

export const metadata: Metadata = {
  title: "Demandes au studio — ISANDRE",
  description:
    "Demandes projet, prescription et presse pour la collection ṬĀQA.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function kindFrom(value: string | string[] | undefined): ServiceRequestKind {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "trade" || raw === "press" ? raw : "project";
}

export default async function FrenchContactPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const productValue = Array.isArray(params.product)
    ? params.product[0]
    : params.product;
  const finishValue = Array.isArray(params.finish)
    ? params.finish[0]
    : params.finish;
  const content = getContent("fr").serviceRequests;

  return (
    <SiteShell locale="fr">
      <main className="service-request-page">
        <header>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 className="display-title">{content.title}</h1>
          <p>{content.body}</p>
        </header>
        <ServiceRequestForm
          locale="fr"
          initialKind={kindFrom(params.kind)}
          initialProductId={normalizeProductId(productValue) ?? undefined}
          initialFinishId={normalizeFinishId(finishValue) ?? undefined}
        />
      </main>
    </SiteShell>
  );
}
