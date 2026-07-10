import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] px-6 py-24 text-[var(--color-ink)]">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Retour au site
        </Link>
        <h1 className="font-[var(--font-display)] text-5xl leading-none md:text-7xl">
          Mentions légales
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
          Version provisoire. Cette page existe pour éviter un lien cassé dès la V1 et sera
          complétée avec les informations légales définitives de RAVA Éditions.
        </p>
        <div className="grid gap-6 rounded-[2rem] border border-black/8 bg-white/55 p-8">
          <p>
            <strong>Éditeur :</strong> RAVA Éditions
          </p>
          <p>
            <strong>Contact :</strong> bonjour@rava-editions.com
          </p>
          <p>
            <strong>Statut :</strong> informations légales détaillées à confirmer avant mise en
            ligne publique.
          </p>
        </div>
      </div>
    </main>
  );
}
