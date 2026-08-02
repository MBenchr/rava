# Protocole A7 — Photographie matière M01–M03

Date : 28 juillet 2026  
Statut : prêt à produire ; publication bloquée par H-009 et H-010

## Finalité

Les macros répondent à une seule question : « La qualité physique
justifie-t-elle le prix ? ». Elles sont réalisées à partir du golden sample
réel. Aucun crop génératif, rendu 3D ou texture procédurale ne peut porter ce
rôle.

## Entrées obligatoires

- golden sample signé, code matière et lot enregistrés ;
- quatre coupons physiques approuvés ;
- rapport de brillance et mesures colorimétriques ;
- charte de gris, ColorChecker et règle millimétrique hors cadre final ;
- profil appareil, objectif, éclairage et opérateur consignés ;
- autorisation H-010 pour chaque finition.

## Matrice

| Rôle | Sujet | Finitions | Cadrage | Question résolue |
|---|---|---|---|---|
| `M01` | surface plane extérieure | les quatre | `1:1` | grain, matité, homogénéité |
| `M02` | rayon et intérieur d'ouverture | Craie + finition forte | `1:1` | continuité et qualité des transitions |
| `M03` | socle et contact au sol | Craie | `1:1` | finition basse, stabilité visuelle, nettoyage |

## Recette de capture

- boîtier plein format ou moyen format, capture RAW 14 bits minimum ;
- objectif macro 90–120 mm, aucune correction beauté automatique ;
- trépied, ISO natif, ouverture `f/8–f/11`, déclenchement distant ;
- deux sources CRI `≥95`, l'une rasante à `15–25°`, l'autre en remplissage
  diffus deux diaphragmes sous la source principale ;
- balance des blancs mesurée, lumière ambiante neutralisée ;
- plan de netteté sur la surface, focus stacking limité si nécessaire ;
- aucune accentuation, clarté ou réduction de bruit destructive ;
- export maître TIFF 16 bits, profil documenté ; export web sRGB.

## Composition

### M01 — Surface

- environ `70 %` de surface plane et `30 %` de courbure ou d'ombre douce ;
- champ photographié de `80 à 140 mm` ;
- lumière rasante assez forte pour lire la microvariation, jamais pour créer un
  relief absent ;
- aucune poussière retouchée si elle révèle un défaut industriel récurrent.

### M02 — Ouverture

- jonction face, rayon, joue intérieure et contre-jour dans la même image ;
- rayon complet, pas de crop ambigu ;
- netteté du premier plan vers l'intérieur de la niche ;
- aucune cassure, joint ou différence de teinte masquée.

### M03 — Base

- socle complet sur `25–40 cm`, sol réel neutre et ombre de contact ;
- angle de caméra à `8–15 cm` du sol ;
- jeu, planéité, rayon bas et facilité de nettoyage lisibles ;
- aucun accessoire ni texte.

## Contrôles de libération

- ΔE mesuré et documenté selon le protocole H-010 ;
- rendu de brillance cohérent avec la mesure physique ;
- aucune répétition de texture, halo de détourage ou sur-accentuation ;
- comparaison plein écran par deux personnes, écran calibré ;
- checksum, droits, lot matière, opérateur et date enregistrés ;
- métadonnées `real-photograph` et aucun tag d'origine algorithmique ;
- validation explicite dans le manifeste avant passage à
  `real-proof-approved`.

## Nommage attendu

```text
media/a7-real-proof/<product>/<role>/<finish>/<lot>-<date>-master.tif
```

Les dérivés web ne sont produits qu'après validation. En l'absence de golden
sample, l'interface masque le média au lieu d'afficher un substitut.
