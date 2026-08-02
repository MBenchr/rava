# ṬĀQA — Géométrie canonique de design

Version : `2026.08.01-design-1`

Ce document est la vérité géométrique utilisée pour les reconstructions 3D,
les visualisations d’atelier et le contrôle des images. Il ne remplace pas les
plans d’exécution, les calculs de retrait du LLDPE, le prototype ni la signature
du fabricant.

## Règles communes

- coque monobloc creuse, traversante et sans panneau arrière ;
- profondeur nominale commune : `420 mm` ;
- rayon extérieur nominal : `52 mm` ;
- paroi visuelle de référence : `80 mm` ;
- rayon intérieur courant : `55–70 mm`, sauf arche explicitement cotée ;
- socle continu en retrait ;
- aucune ouverture ne peut être ajoutée, supprimée, fusionnée, déplacée ou
  redessinée selon la vue ou la finition ;
- les quatre finitions modifient uniquement la matière et la couleur.

## Dimensions extérieures

| Pièce | Largeur | Hauteur | Profondeur | Rapport L/H | Ouvertures |
|---|---:|---:|---:|---:|---:|
| SEUIL 01 | 1020 mm | 1840 mm | 420 mm | 0,55435 | 8 |
| PORTÉE 02 | 1840 mm | 1020 mm | 420 mm | 1,80392 | 8 |
| VEILLE 03 | 383 mm | 620 mm | 420 mm | 0,61774 | 2 |

Le rapport théorique au nombre d’or de VEILLE vaut `1 / φ = 0,618034`.
L’arrondi industriel à `383 mm` produit un écart de `0,047 %` seulement.

## VEILLE 03

Repère frontal : origine `(0, 0)` en haut à gauche, dimensions en millimètres.
La hauteur extérieure inclut le socle.

| Élément | X | Y | L | H | Rayon / naissance |
|---|---:|---:|---:|---:|---:|
| Corps | 0 | 0 | 383 | 570 | R52 |
| Arche supérieure | 80 | 60 | 223 | 270 | R112, naissance Y172 |
| Niche inférieure | 80 | 400 | 223 | 120 | R55 |
| Socle | 20 | 570 | 343 | 50 | R20 |

La largeur et l’axe des deux ouvertures sont identiques. Cette répétition fixe
le langage de construction et empêche une interprétation différente entre les
vues frontale, trois-quarts, arrière, lifestyle et atelier.

## Règles de moule et d’image

- Le moule doit être le négatif exact de la coque et reproduire le périmètre,
  les deux noyaux d’ouverture, le socle et la profondeur de la pièce concernée.
- Un moule générique rectangulaire, circulaire ou sans noyaux correspondants est
  rejeté.
- L’échelle d’une scène d’atelier est établie par un repère métrique sur le même
  plan que le produit. Un humain sert uniquement de contrôle secondaire.
- SEUIL placé verticalement doit mesurer environ `1840 mm` depuis le sol : face
  à une personne mesurée à `1800 mm`, son sommet se situe `40 mm` plus haut si
  leurs pieds sont sur le même plan.
- PORTÉE mesure `1020 mm` de haut ; son sommet arrive approximativement entre
  la taille et le bas du thorax d’un adulte de `1800 mm`, selon sa morphologie.
- VEILLE mesure `620 mm` de haut, cohérent avec un chevet placé près d’un lit bas.
- La perspective est calculée avant génération. L’IA ne choisit ni les
  dimensions, ni le nombre d’ouvertures, ni la forme du moule.

## Porte de validation

Une image n’est publiable que si :

1. le rapport frontal reste dans une tolérance de `±1 %` ;
2. le nombre et l’ordre des ouvertures sont exacts ;
3. le produit et le repère métrique touchent le même plan de sol ;
4. la profondeur apparente correspond à `420 mm` sous la caméra reconstruite ;
5. le moule visible correspond au négatif de la pièce ;
6. aucune partie du produit n’a été inventée par la génération.

