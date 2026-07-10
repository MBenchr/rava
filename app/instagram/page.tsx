import Link from "next/link";

export default function InstagramPage() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] px-6 py-24 text-[var(--color-ink)]">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Retour au site
        </Link>
        <h1 className="font-[var(--font-display)] text-5xl leading-none md:text-7xl">
          Instagram
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
          Placeholder visible volontaire. Le compte officiel RAVA Éditions sera branché ici dès
          qu’il sera publié.
        </p>
      </div>
    </main>
  );
}
