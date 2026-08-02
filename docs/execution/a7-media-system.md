# Vague A7 — Système média canonique

Date : 28 juillet 2026  
Statut : périmètre automatisable terminé ; preuves physiques bloquées

## Livré

- registre versionné séparant commerce, désir et preuve ;
- `60` masters `C01/C02/D01–D04`, `11` masters `P01–P04` et `8` cadrages
  mobiles dédiés ;
- pipeline reproductible WebP, AVIF et JPEG ;
- `1 562` dérivés avec checksums, dimensions, poids et métadonnées IA ;
- textes alternatifs EN/FR, statut de droits, profondeur source et contrat
  colorimétrique sRGB explicites dans le manifeste ;
- fallback JPEG aux six largeurs utiles, en plus de WebP et AVIF ;
- runtime `srcset` et art direction mobile ;
- catalogue migré vers `/isandre/media/` ;
- géométries et kits de projection migrés vers les nouveaux masters ;
- suppression des anciens assets, scripts, SVG et kits VIAIRE ;
- vérificateur automatisé interdisant duplication et retour d’un ancien
  namespace ;
- dix planches QA par rôle ;
- protocoles exécutables pour `M01–M03` et `V01–V02`.

## Ce qui reste derrière une porte humaine

- vue arrière VEILLE après résolution de H-005 ;
- macros `M01–M03` après validation de la matière ;
- tournage des plans vidéo `V01–V02` ;
- photographies réelles atelier, fabrication, emballage et première
  installation ;
- validation colorimétrique et seconde revue H-010.

## Principe d’architecture

Le plan source décide. Le manifeste explique. Le storefront rend.

Le catalogue ne fabrique aucun chemin historique et ne transforme jamais une
scène de désir en faux packshot ou faux détail matière. Les familles absentes
restent absentes de l’interface jusqu’à disponibilité d’un master autorisé.

Le manifeste contient `71` masters. La sélection storefront reste limitée à
`20` médias SEUIL, `20` PORTÉE et `19` VEILLE. Les douze médias D04 servent
la preuve d'usage du storefront et portent `launchSelected=true`. Les D02/D03
restent la bibliothèque d'acquisition hors sélection PDP.

Les sources génératives actuelles sont des PNG sRGB 8 bits et sont déclarées
comme telles. Le pipeline ne les suréchantillonne pas artificiellement. Les
futures photographies physiques doivent être livrées en masters 16 bits selon
le protocole A7, derrière H-006/H-009/H-010.

## Preuves

```bash
npm run media:build
npm run media:verify
npm run media:qa:boards
npm run projection:kits
npm run projection:verify
npm run typecheck
npm run lint
```
