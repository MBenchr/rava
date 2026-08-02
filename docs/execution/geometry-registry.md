# Registre géométrique canonique

## Autorité

La vérité métrique est `lib/isandre/geometry.data.json`. Le catalogue, le
moteur de projection et les scripts de génération ne doivent ni recopier ni
recalculer cette vérité.

Le module `lib/isandre/geometry.ts` expose les kits au runtime. Le fichier
`modules/projection/core/reference-kits.ts` est une façade de compatibilité
sans donnée métier.

## Kits

| Produit | Statut | Version | Dimensions | Ouvertures | Checksum SHA-256 |
|---|---|---|---|---:|---|
| SEUIL 01 | `approved` | `2026.07.27-1` | 1020 × 1840 × 420 mm | 8 | `3318d536431af805b6ef013f0e218688015e084c8ee33b739ad25d4ff15325df` |
| PORTÉE 02 | `approved` | `2026.07.27-1` | 1840 × 1020 × 420 mm | 8 | `d61d227b3f37057c9974839e87def52e3cbb31e430ec4c6b8a66be405b2119a9` |
| VEILLE 03 | `blocked` | `unvalidated` | non validées | non validées | aucun |

## Artefacts approuvés

Chaque kit approuvé contient :

- `manifest.json`
- `front-orthographic.png`
- `front-right-30.png`
- `rear-left-30.png`
- `identity-board.png`
- `product.glb`
- `product.usdz`

Les artefacts vivent dans
`public/projection-kits/<product-id>/<kit-version>/`. Ils sont des références
techniques internes. Ils ne remplacent pas les photographies commerciales.

## Contrats

`npm run projection:verify` contrôle :

- la liste des trois identifiants canoniques ;
- le statut catalogue contre le statut du registre ;
- les dimensions catalogue contre les millimètres canoniques ;
- le ratio de projection ;
- la bounding box du mesh avec une tolérance de ±1 mm ;
- les huit ouvertures et leurs identifiants uniques ;
- la densité familiale de 80 mm ;
- les limites du cadre et du socle ;
- la relation transposée entre SEUIL et PORTÉE ;
- le blocage dur de VEILLE.

## Règle de changement

Toute modification d’une dimension, ouverture, épaisseur, rayon ou socle
exige :

1. un nouveau plan fabricant approuvé ;
2. une nouvelle version de kit ;
3. une régénération des sept artefacts ;
4. un nouveau checksum ;
5. le passage du contrat ;
6. une validation visuelle de l’identity board.

## Import VEILLE

Le formulaire contrôlé est versionné dans
`docs/execution/geometry-import/veille-03-input.template.json`. Il accepte un
plan uniquement avec approbateur, date et checksum, puis produit un rapport de
revue sans modifier automatiquement la vérité canonique.

Preuves :

```bash
npm run geometry:import:verify
npm run technical:pdf
```

Les six fiches provisoires EN/FR sont générées dans
`output/pdf/technical/`. VEILLE y reste explicitement sans dimensions.
