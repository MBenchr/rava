# Baseline d'exécution — 2026-07-27

## Périmètre

Cette baseline précède la migration du storefront VIAIRE vers la plateforme
canonique ISANDRE / ṬĀQA. Elle sert de preuve de non-régression pour les vagues
A0 à A3.

## État du dépôt

| Élément | État |
|---|---|
| Branche de départ | `main` |
| Branche d'exécution | `codex/isandre-taqa-master-plan` |
| Commit de départ | `c5d0757` |
| Runtime | Next.js 16, React 19, TypeScript 6, Tailwind 4 |
| Paiement | Stripe Checkout, webhook et marchés localisés présents |
| Marchés | 30 marchés vérifiés |
| Projection | Upload, placement, OpenAI, contrôle d'erreurs et comparateur présents |
| Catalogue | Une vérité centrale dans `lib/rava-content.ts`, encore nommée VIAIRE |
| Médias live | `public/viaire/` |
| Kits géométriques | SEUIL et PORTÉE approuvés sous les anciens IDs ; VEILLE bloquée |
| Hébergement Sites | Aucun `.openai/hosting.json` |

Les seuls fichiers non suivis au départ sont les documents de recherche sous
`docs/research/`. Aucun fichier runtime modifié par un tiers n'a été détecté.

## Preuves techniques avant migration

Toutes les commandes suivantes passent sur le commit de départ :

| Commande | Résultat |
|---|---|
| `npm run lint` | succès |
| `npm run typecheck` | succès |
| `npm run build` | succès, 29 routes générées |
| `npm run projection:contract:verify` | 5 formats et placement déterministe vérifiés |
| `npm run projection:verify` | géométrie vérifiée |
| `npm run projection:errors:verify` | 5 classes d'erreurs vérifiées |
| `npm run markets:verify` | 30 marchés, prix et livraisons vérifiés |
| `npm run test:e2e` | 3 scénarios mobile Chromium réussis |

## Ce qui existe déjà

- Panier global persistant et checkout Stripe.
- Détection et sélection de marché.
- Prix locaux et paliers de livraison.
- Storefront anglais et français.
- Trois produits et quatre finitions.
- Projection avec gestion explicite des erreurs de facturation.
- Tests Playwright du changement de variante, du panier et de la projection.
- Référentiel géométrique exact pour les deux grands meubles.

## Écarts avec le plan maître

| Domaine | Existant | Cible |
|---|---|---|
| Maison | VIAIRE | ISANDRE |
| Collection | OPENINGS 01 | ṬĀQA / TAQA |
| Produits | `elan-o1`, `portee-o2`, `veille-o4` | `seuil-01`, `portee-02`, `veille-03` |
| Rose | `plaster-rose` | `rose-clay` |
| Routes EN | `/products/seuil` | `/products/seuil-01` |
| Routes FR | `/fr/products/seuil` | `/fr/produits/seuil-01` |
| Typographie | Bodoni Moda + Manrope | système ISANDRE à implémenter dans une vague visuelle |
| Média | manifeste implicite | manifeste versionné avec rôle, source et validation |
| Matière | formulation minérale générique | LLDPE rotomoulé, formulation conditionnée à validation |
| Passeport | absent | route et module dédiés |
| Presse / trade | absents | espaces contrôlés |

## Règle de non-régression

Après chaque vague :

1. le catalogue serveur reste la seule vérité des prix ;
2. la compatibilité des anciens IDs et URLs est testée ;
3. le panier et Stripe ne consomment jamais un prix fourni par le navigateur ;
4. SEUIL et PORTÉE conservent leurs géométries validées ;
5. VEILLE ne reçoit aucune cote ou projection métrique inventée ;
6. les huit commandes de validation de cette baseline doivent repasser.
