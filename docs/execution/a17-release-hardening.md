# A17 — Durcissement, recette et état de livraison locale

Date : 29 juillet 2026  
Statut : `LOCAL READY / PUBLICATION BLOCKED`  
Bundle validé : `.next-qa`  
URL de recette locale : `http://127.0.0.1:3012`

## 1. Périmètre réalisé

- suppression des façades runtime `rava-experience`, `rava-product-page` et
  `lib/rava-content.ts` ;
- consolidation des routes home et PDP sur le catalogue ISANDRE canonique ;
- suppression des anciens médias VIAIRE et des masques RAVA/MURA ;
- correction du comparateur, du panier, de la barre d'achat mobile et de la
  modal de projection ;
- responsive vérifié à `1440`, `1280`, `834`, `390` et `360px` ;
- racine anglaise stable, version française explicite ;
- suppression des préchargements spéculatifs de variantes ;
- portes de publication, d'Offer, de feed et d'indexation vérifiées fermées.

## 2. Preuves de domaine

| Contrôle | Résultat |
|---|---|
| Identité | 22 assets, géométrie L'ENTAILLE et guide A4 validés |
| Contenu | 2 langues, 3 produits, 4 finitions, 249 champs par contrat |
| Industrie | 3 produits, 4 finitions, 11 artefacts |
| Pilotes image | 3 produits, 9 directions |
| Registre média | 71 masters canoniques |
| Projection | géométrie canonique, 5 formats, placement déterministe, une référence |
| Marchés | 30 marchés et paliers de livraison |
| Checkout | prix serveur, entrée stricte et retours sûrs |
| Commandes | projection durable et idempotence webhook |
| Passeports | unicité des séries et checksum |
| SEO | offres, feed et checkout conditionnés par release |
| Lancement | 10 artefacts, 4 PDF de travail, profondeur bilingue |

Toutes les commandes `*:verify` correspondantes se terminent avec le code `0`.

## 3. Recette technique

| Gate | Résultat |
|---|---|
| `npm run typecheck` | réussi |
| `npm run lint` | réussi |
| `npm run build:qa` | réussi, table de routes incluant `/api/health` |
| `npm run test:e2e -- --workers=1` | 18/18 réussis en 11,3 s |
| `npm run accessibility:verify` | 7 paires de contraste et focus validés |
| `npm run performance:verify` | 5/5 profils sous les seuils |
| `git diff --check` | réussi |
| Console Chrome | aucune erreur |
| Débordement horizontal | `0px` sur les viewports testés |

La matrice Playwright couvre :

- racine anglaise avec navigateur préférant le français ;
- décodage sans flash lors d'un changement de finition ;
- sélection des trois produits et synchronisation URL/média ;
- 3 PDP EN et 3 PDP FR ;
- prix par marché, panier et quantités ;
- images différées sous la ligne de flottaison ;
- barre d'achat mobile sans iframe Stripe superposée ;
- projection réussie avec before/after et téléchargement ;
- échec de crédit OpenAI explicite et relançable ;
- VEILLE bloquée proprement faute de géométrie validée ;
- redirections historiques ;
- landmarks, lien d'évitement et navigation clavier ;
- santé publique sans secret et portes commerce fermées ;
- cinq largeurs de référence.

## 4. Audit des routes avant publication

| Route | Attendu | Observé |
|---|---|---|
| `/` avec `Accept-Language: fr` | anglais, pas de redirect | `200`, `en-GB` |
| `/fr` | français | `200`, `fr-FR` |
| `/robots.txt` | indexation fermée | `200`, `Disallow: /` |
| `/sitemap.xml` | aucun produit publié | XML valide vide, 110 octets |
| `/merchant-feed.xml` | indisponible | `404` |
| `/mura-01?finish=sage` | migration | `301` vers SEUIL, finition conservée |
| `/products/elan-o1?finish=sage` | migration | `301` vers SEUIL, finition conservée |
| PDP EN/FR | ProductGroup sans Offer | `200`, 4 variantes, 0 Offer |

## 5. Images et performance

Le hero est le LCP sur les cinq profils de recette :

| Profil local | LCP | CLS | INP |
|---|---:|---:|---:|
| `1440 × 1000` | 120 ms | 0,014 | 56 ms |
| `1280 × 900` | 48 ms | 0,015 | 56 ms |
| `834 × 1112` | 40 ms | 0 | 48 ms |
| `390 × 844` | 40 ms | 0 | 48 ms |
| `360 × 800` | 40 ms | 0 | 48 ms |

Ces temps locaux ne constituent pas une mesure de terrain. Ils prouvent le bon
élément LCP, le respect des seuils automatiques et le bon format responsive.
Les seuils réels devront être suivis au 75e percentile après publication.

Les variantes ne sont plus téléchargées en masse au démarrage. Elles sont
préchargées en AVIF uniquement après une intention du visiteur. Les médias
différés décodent lorsqu'ils entrent dans le viewport.

Le rapport machine est conservé dans `output/qa/performance.json`.

## 6. Contrôle visuel

Captures pleine page conservées dans `output/qa/` :

- `storefront-desktop-1440.png`
- `storefront-tablet-834.png`
- `storefront-mobile-390.png`

La capture QA parcourt la page avant de photographier afin de déclencher les
médias différés. Le lien d'évitement est hors écran au repos et visible au
focus. Les trois captures montrent les scènes, preuves techniques, footer et
contrôles sans débordement.

## 7. Scans de retrait

Le runtime canonique ne contient plus :

- token ou classe `brown`, `chocolate`, `claymorphism`,
  `store-card-dark`, `rava-module` ou thème sombre hérité ;
- ancien nom RAVA, MURA, VIAIRE, FORME OUVERTE, ÉLAN O1, PORTÉE O2 ou
  VEILLE O4 ;
- image publique supérieure à 2 Mo.

Les anciens slugs peuvent subsister uniquement dans les normalisateurs et
redirects de compatibilité. Les documents de baseline et rollback conservent
les anciens noms à titre de traçabilité.

## 8. État de publication

Le code et les artefacts automatisables sont prêts localement. La publication
reste volontairement bloquée par `docs/execution/blockers.md`, notamment :

- clearance de la maison, de la collection et des produits ;
- substantiation de la chaîne dessin France / fabrication Italie ;
- géométrie VEILLE ;
- golden sample et libération couleur/matière ;
- photos réelles d'atelier, d'emballage et d'installation ;
- transport, taxes et paiements live ;
- Supabase et email de domaine ;
- consentement, politiques et recette projection payante ;
- validation Search Console et Merchant Center.

Aucune de ces preuves ne doit être simulée ou contournée par du code.

Le Blueprint Render est prêt localement avec `autoDeploy: false` et
`CATALOG_RELEASED=false`. Aucun push, déploiement ou secret distant n'a été
modifié pendant cette recette.
