# Registre de production média A7

Date : 28 juillet 2026  
Release : `2026.07.29-a7.4`

## Règle

Le registre machine
[`a7-media-manifest.json`](./a7-media-manifest.json) est la projection
canonique des masters et de leurs dérivés. Le plan source
[`a7-media-source-plan.json`](./a7-media-source-plan.json) porte les règles de
production. Le runtime ne reconstruit aucune convention de fichiers locale.

## Couverture actuelle

| Famille | Code | SEUIL | PORTÉE | VEILLE | Statut |
|---|---|---:|---:|---:|---|
| Commerce | `C01` frontal | 4 | 4 | 4 | disponible ; VEILLE concept |
| Commerce | `C02` trois-quarts | 4 | 4 | 4 | disponible ; VEILLE concept |
| Désir | `D01` scène principale desktop | 4 | 4 | 4 | disponible ; VEILLE concept |
| Désir | `D01-mobile` cadrage dédié | 4 | 4 | source D01 4:5 | disponible ; VEILLE concept |
| Désir | `D02` matin | 2 | 2 | 2 | disponible ; VEILLE concept |
| Désir | `D03` soir | 2 | 2 | 2 | disponible ; VEILLE concept |
| Désir / social | `D04` usage fonctionnel | 4 | 4 | 4 | disponible ; VEILLE concept |
| Preuve produit | `P01` profil / profondeur | 1 | 1 | 1 | disponible ; VEILLE concept |
| Preuve produit | `P02` dos traversant | 1 | 1 | 0 | VEILLE bloquée par H-005 |
| Preuve produit | `P03` dimensions | 1 | 1 | 1 | disponible ; VEILLE sans cote inventée |
| Preuve produit | `P04` échelle | 1 | 1 | 1 | disponible ; VEILLE concept |
| Matière | `M01–M03` | 0 | 0 | 0 | à produire après golden sample |
| Preuve réelle | atelier, artisan, origine, client | 0 | 0 | 0 | H-006 / H-009 |

La release contient `71` masters enregistrés, `8` masters mobiles dédiés et
`1 562` dérivés. Chaque master possède exactement `22` dérivés vérifiés.

La sélection compte `20` masters SEUIL, `20` PORTÉE et `19` VEILLE. Elle
respecte la cible de `18–22` stills par produit sans afficher plus de `10–12`
médias sur une PDP. Les douze D04 portent `launchSelected=true` et alimentent
la preuve d'usage du storefront. D02/D03 restent disponibles pour campagnes,
landing pages et tests sociaux sans entrer automatiquement dans la galerie.

## Dérivés par master

- WebP, AVIF et JPEG : `480`, `768`, `1024`, `1440 px`.
- Mobile WebP, AVIF et JPEG : `720 × 900`, `960 × 1200`.
- Fallbacks index WebP/AVIF/JPEG et vignette `360 × 450`.
- XMP `DigitalSourceType=TrainedAlgorithmicMedia` intégré à chaque dérivé.
- Profil ICC sRGB, checksum SHA-256, dimensions, format et poids enregistrés.
- Alt EN/FR, statut de droits et profondeur source enregistrés par master.

Les sources numériques de cette release sont des PNG sRGB 8 bits. Les masters
photographiques réels devront être capturés et archivés en 16 bits ; ils
restent bloqués par H-006/H-009/H-010. Une conversion 8→16 bits ne serait pas
une amélioration de qualité et n'est donc pas utilisée comme faux correctif.

## Politique de publication

- `digital-approved` valide une direction numérique, jamais la couleur ou la
  matière physique.
- `concept-blocked` interdit d’utiliser VEILLE comme preuve dimensionnelle ou
  industrielle.
- Les images générées ne sont jamais légendées comme atelier, propriétaire,
  presse, prototype, emballage ou origine.
- `P03` est généré déterministement depuis le registre géométrique. VEILLE
  affiche « dimensions en validation » et aucune cote inventée.
- `P04` utilise un repère architectural mesurable. Deux essais SEUIL avec une
  personne ont été rejetés parce que la perspective produisait une échelle
  visuellement fausse.
- `D04` montre un usage fonctionnel crédible dans les quatre finitions, avec
  des objets variés, correctement dimensionnés et sans masquer les ouvertures.
- `D04` est un média de désir et d'acquisition, jamais une preuve de charge,
  de matière ou d'installation réelle.
- Une première variante PORTÉE Beurre `D04` a été rejetée parce que les
  ouvertures de gauche fusionnaient ; seule la seconde version conforme est
  enregistrée.
- `M01–M03` ne sont pas remplacés par des crops d’une scène de désir.
- La vue arrière VEILLE est volontairement absente : deux tentatives ont
  dérivé vers une arche pointue et ont été rejetées. Elle ne sera produite
  qu’après résolution de H-005.
- PORTÉE possède exactement huit ouvertures. Une consigne exploratoire
  mentionnant sept ouvertures a été corrigée et n’appartient pas aux recettes
  canoniques.

## Commandes

```bash
npm run media:build
npm run media:verify
npm run media:qa:boards
```

La génération est destructive uniquement dans `public/isandre/media/`. Les
masters lossless restent dans `media/a7-sources/`.
