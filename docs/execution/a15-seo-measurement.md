# A15 — SEO commerce et mesure

Statut : **contrats implémentés ; indexation, Merchant Center et analytics
tiers bloqués par les portes de publication**.

## Données structurées

- home : `Organization`, `WebSite`, `CollectionPage`, `ItemList` ;
- PDP : un `ProductGroup` et quatre variantes `Product` ;
- variantes : URL, SKU, finition, image et canonical propres ;
- langues : `en-GB`, `fr-FR`, `x-default` ;
- prix : toujours relu depuis le catalogue canonique ;
- offre : absente tant que la pièce n’est pas juridiquement, industriellement
  et visuellement libérée.

## Publication

`CATALOG_RELEASED=false` est la position par défaut. Dans cet état :

- les pages portent `noindex, nofollow` ;
- `robots.txt` bloque l’exploration ;
- le sitemap est vide ;
- le feed Merchant Center répond `404` ;
- un identifiant Stripe live ne peut pas ouvrir un checkout pour une pièce non
  libérée ;
- Stripe test reste utilisable pour la recette locale.

Le passage à `true` ne suffit pas : chaque produit doit également être
`cleared`, `geometryStatus=approved` et `digital-approved`.

## Mesure

Le registre canonique contient 24 événements couvrant découverte, décision,
panier, paiement, projection et demandes de service. Le bus first-party
`isandre:commerce` reste local, sans persistance et retire les champs
identifiants ou libres.

Le consentement est versionné et refusé par défaut. Une préférence audience ne
peut pas activer une destination : `cmpValidated`, la porte analytics et la
porte marketing restent statiquement fausses jusqu'à H-019. Il n'existe donc
aucun appel GA, pixel ou audience caché.

Les spécifications d'exploitation sont dans :

- `docs/operations/measurement-and-consent.md` ;
- `docs/operations/a15-measurement-dashboard.md` ;
- `docs/operations/a15-experiment-agenda.md`.

`purchase` reste émis une fois, après vérification serveur de la session
Stripe.

## Preuves

```text
npm run seo:verify
npm run measurement:verify
npm run checkout:verify
npm run typecheck
npm run lint
```
