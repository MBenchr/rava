import type { Metadata } from "next";

import MakingPage from "@/components/making-page";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://isandre.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "The making of ṬĀQA",
  description:
    "From mould preparation to hand finishing, discover the process behind the three open forms of the ṬĀQA collection.",
  alternates: {
    canonical: `${siteUrl}/making`,
    languages: {
      "en-GB": `${siteUrl}/making`,
      "fr-FR": `${siteUrl}/fr/fabrication`,
      "x-default": `${siteUrl}/making`,
    },
  },
};

export default function Page() {
  return <MakingPage locale="en" />;
}
