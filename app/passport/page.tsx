import SiteShell from "@/components/site-shell";

export const metadata = {
  title: "Product passport",
  robots: { index: false, follow: false },
};

export default function PassportIndexPage() {
  return (
    <SiteShell locale="en">
      <main className="grid min-h-dvh place-items-center bg-background px-5 py-32 text-center">
        <div className="max-w-xl">
          <p className="eyebrow">ISANDRE product passport</p>
          <h1 className="display-title mt-5 text-6xl sm:text-8xl">
            A piece with a record.
          </h1>
          <p className="mx-auto mt-7 max-w-md leading-7 text-muted-foreground">
            Scan the NFC mark or use the exact address supplied with the piece.
            No owner or production record is published before activation.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
