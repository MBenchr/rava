import RavaExperience from "@/components/rava-experience";
import { buildStructuredData } from "@/lib/rava-schema";

export default function Page() {
  const structuredData = buildStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RavaExperience />
    </>
  );
}

