# Audit de clôture A0–A18

Date : 29 juillet 2026  
Statut : audit actif, publication interdite

Ce registre relie chaque vague du plan maître à une preuve locale. Une vague
n'est `CLOSED-AUTOMATABLE` que lorsque ses actions automatisables sont
produites et vérifiées. Une porte physique, juridique ou fournisseur reste
`HUMAN-GATED` et renvoie au registre `blockers.md`.

## Légende

- `PROVED` : preuve locale reproductible.
- `GAP` : exigence automatisable encore incomplète.
- `HUMAN-GATED` : la préparation locale est terminée, mais la preuve exige un
  tiers, un fournisseur, un compte ou un objet physique.

## Matrice

| Vague | État | Preuves existantes | Écart ou porte |
|---|---|---|---|
| A0 | PROVED | baseline canonique, branche dédiée, journal de décision, bloqueurs, rollback, captures et rapport performance | aucun écart automatisable |
| A1 | HUMAN-GATED | briefs clearance/linguistique, classes, registres, domaines/handles, protocole de test et `brandCleared=false` codé | clearance H-001–H-003 |
| A2 | PROVED | catalogue typé, IDs canoniques, mapping legacy, schémas Zod, redirects, prix serveur, `content:verify`, `checkout:verify`, `seo:verify` | clearance et libération produit restent humaines |
| A3 | HUMAN-GATED | registre géométrique, kits versionnés SEUIL/PORTÉE, GLB/USDZ, trois vues, identity boards, manifestes, fiches canoniques, formulaire d'import signé et six fiches techniques bilingues | dimensions VEILLE H-005 |
| A4 | HUMAN-GATED | 22 assets vérifiés, masters, variantes, favicon, plaque, gabarit 1:1, templates, chartes web/PDF | impression, bronze, abrasion, fixation et NFC H-008 |
| A5 | HUMAN-GATED | vérité industrielle, RFQ, coûts 10/50/100/250/500, coupons/tests, scorecard, golden sample, QC, NCR, emballage, marge | devis, coupons, laboratoire, prototype et golden sample H-009 |
| A6 | HUMAN-GATED | trois directions par produit, sélection, recettes, focales/hauteurs, ratios et archive hors public | revue indépendante plein écran et couleur physique H-010 |
| A7 | HUMAN-GATED | 71 masters, 1 562 dérivés, sélection 20/20/19, rôles C/D/P, art direction mobile, QA boards, alt EN/FR, droits, ICC sRGB, métadonnées IA et JPEG aux six largeurs | masters physiques 16 bits et libération H-006/H-009/H-010 |
| A8 | HUMAN-GATED | deck EN/FR paritaire, 279 champs, home/PDP/panier/projection/service/email/presse/trade/FAQ/glossaire et interdits | revue native H-021 |
| A9 | PROVED | home quatre séquences, URL state, buy panel, sticky mobile, préchargement à l'intention, SSR critique et tests responsive | validation commerciale finale H-010 |
| A10 | PROVED | template partagé, trois PDP EN/FR, dimensions conditionnelles, vues preuve, fiche technique, liés, projet et ProductGroup | preuves physiques et VEILLE H-005/H-010 |
| A11 | HUMAN-GATED | 30 marchés, prix et livraison serveur, checkout strict, Stripe Tax préparé, méthodes dynamiques, webhook signé, idempotence, annulation/succès et commande | siège fiscal, taxes, DDP, transport, Stripe live H-011–H-013 |
| A12 | HUMAN-GATED | photo entière, placement au clic, ratio verrouillé, référence unique, consigne, erreurs, comparateur tactile, panier, rétention 24 h et suppression | recette payante 12 pièces × finitions H-015 |
| A13 | HUMAN-GATED | commande canonique, demandes projet/trade/presse, retry idempotent, Supabase, journaux d'audit, confirmations, emails de cycle et export CRM sûr | recette Resend/Supabase et politique H-014/H-016/H-017 |
| A14 | HUMAN-GATED | série avec checksum, passeports/réparations/transferts, lecture publique, route NFC, activation HMAC, récupération, export owner et audits sous RLS | identité/NFC/politique H-008/H-016/H-018 |
| A15 | HUMAN-GATED | Organization/WebSite/Collection/ItemList, ProductGroup/variants, release gates, canonicals/hreflang, sitemap/feed, registre de 24 événements, bus first-party filtré, consentement deny-by-default, destinations tierces fermées, dashboard et agenda d'expérimentation | activation CMP/Search H-019/H-020 |
| A16 | HUMAN-GATED | communiqués EN/FR, presse, trade, images/crédits, B-roll, FAQ, sample request, lookbook, catalogue, films, calendrier, briefs et quatre PDF | faits, droits, presse, atelier et contacts réels H-001–H-020 selon l'asset |
| A17 | PROVED | lint, typecheck, build, 18 E2E, cinq viewports, clavier, contrastes, performance, 11 contrats unitaires catalogue/commerce/service/passeport/consentement, vérificateur des secrets/prix/webhook/uploads/routes/release et matrice locale 26/26 | aucune porte automatisable |
| A18 | HUMAN-GATED | health route, Blueprint fermé, inventaire env, runbooks monitoring/recovery/rollback et vérificateur de readiness | domaine, secrets, migrations, alertes, backups, smoke et ouverture progressive H-007/H-011–H-020 |

## Lot de clôture automatisable

1. Canoniser A0 et ajouter le contrat de clearance A1.
2. Ajouter l'import contrôlé VEILLE et les exports techniques A3.
3. Étendre le registre et le pipeline média A7 sans fabriquer de preuve
   physique.
4. Construire le domaine des demandes de service A13 et son export CRM.
5. Préparer les contrats owner/passeport A14 sans simuler une identité.
6. Compléter le registre d'événements, le consentement et le dashboard A15.
7. Ajouter les tests unitaires et la preuve sécurité A17.
8. Rejouer tous les contrats, le build, Playwright, les cinq viewports et les
   audits de release.

## Règle de fin

La clôture locale exige :

- zéro `GAP` dans cette matrice ;
- chaque impossibilité restante reliée à un identifiant `H-*` ;
- toutes les commandes de recette au code `0` ;
- `CATALOG_RELEASED=false` et `brandCleared=false` ;
- aucune mutation distante, indexation ou promesse commerciale non validée.
