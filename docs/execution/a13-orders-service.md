# A13 — Commandes, email et service

Statut : **domaines commande et demandes de service implémentés, recette live
bloquée par H-014, H-016 et H-017**.

## Architecture

```text
Stripe webhook signé
  → claim idempotent de l'événement
  → projection canonique de commande
  → stockage Supabase service-role
  → emails Resend idempotents
  → événement completed
```

Une erreur marque l'événement `failed` et retourne une erreur à Stripe afin
qu'un replay puisse reprendre. Un événement `completed` ne renvoie jamais une
seconde confirmation.

## Livré

- modèle typé de commande et lignes ;
- statuts de service ;
- journal webhook ;
- adaptateur Supabase REST sans logique métier côté client ;
- adaptateur mémoire limité au développement ;
- migration SQL avec unicité et RLS ;
- refus du stockage volatil en production ;
- confirmation client et studio ;
- emails préparation, expédition, arrivée et entretien ;
- runbook support ;
- modèle de remboursement ;
- politique de données ;
- variables d'environnement documentées.
- domaine séparé `project / trade / press`, sans transformer une intention en
  commande payée ;
- clé client UUID et replay idempotent sans second email ;
- validation Zod, honeypot et consentements distincts ;
- stockage service-role et journal d'audit immuable ;
- accusé client et notification studio ;
- formulaire bilingue `/contact` et `/fr/contact`, prérempli depuis une PDP ;
- export CSV CRM protégé contre les formules et journalisé.

## Consentement

Le panier abandonné n'est pas activé. Le déclencher depuis un email de checkout
sans consentement marketing explicite serait contraire à la règle de preuve et
à la confiance recherchée. Le contrat et le runbook décrivent la porte à
franchir avant activation.

## Preuves

```text
npm run orders:verify
npm run service-requests:verify
npm run content:verify
npm run typecheck
npm run lint
```

Le scénario vérifie une commande CHF, les métadonnées SEUIL/Sauge, la livraison,
la projection persistée et l'absence de second email au replay Stripe. Le
second scénario vérifie les trois types de demande, le retry idempotent, les
consentements, le stockage privé et l'export CRM.

L'export opérationnel exige le stockage durable :

```bash
npm run service-requests:export -- --output=output/operations/service-requests.csv
```

Il refuse de s'exécuter sans `SUPABASE_URL` et
`SUPABASE_SERVICE_ROLE_KEY`. Les fichiers exportés sont créés en mode `0600`.
