import type { Metadata } from "next";

import MakingPage from "@/components/making-page";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://taqa.isandre.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "La fabrication de ṬĀQA",
  description:
    "De la préparation du moule à la finition manuelle, découvrez le processus derrière les trois formes ouvertes de la collection ṬĀQA.",
  alternates: {
    canonical: `${siteUrl}/fr/fabrication`,
    languages: {
      "en-GB": `${siteUrl}/making`,
      "fr-FR": `${siteUrl}/fr/fabrication`,
      "x-default": `${siteUrl}/making`,
    },
  },
};

export default function Page() {
  return <MakingPage locale="fr" />;
}
