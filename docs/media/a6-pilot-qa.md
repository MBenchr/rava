# A6 — Rapport de contrôle des pilotes

Date : 27 juillet 2026  
Référentiel : `docs/media/a6-pilot-manifest.json`

## Méthode

Le contrôle combine :

- comparaison plein écran aux références V2040 ;
- comparaison à l’identity board pour SEUIL et PORTÉE ;
- comptage des ouvertures ;
- mesure du rapport de la face frontale, hors profondeur visible ;
- contrôle de la base, du dos ouvert, du contact au sol et de la perspective ;
- contrôle matière, objets, lumière et absence d’effet collage ;
- contrôle de statut : désir génératif ou preuve réelle.

La colorimétrie physique n’est pas mesurable à partir d’un rendu génératif. Elle
reste bloquée jusqu’aux coupons et au golden sample A5.

## Résultats

| Produit | Direction retenue | Ouvertures | Rapport attendu | Rapport observé | Écart | Forme | Matière | Décor | Statut |
|---|---|---:|---:|---:|---:|---|---|---|---|
| SEUIL Craie | A affinée | 8 | 0,554 | 0,559 | +0,9 % | passe | passe numérique | passe | pilote approuvé |
| PORTÉE Sauge | C | 8 | 1,804 | 1,829 | +1,4 % | passe | passe numérique | passe | pilote approuvé |
| VEILLE Argile rose | C affinée | 2 | non validé | non publié | n/a | visuel seulement | passe numérique | passe | concept bloqué |

Les rapports sont mesurés sur la face frontale apparente, pas sur la bounding
box totale incluant la profondeur. La tolérance pilote est `±1,5 %`.

## Score éditorial

Échelle : 1 faible, 5 excellent.

| Produit | Reconnaissance | Produit entier | Réalisme matière | Vie crédible | Désir | Commerce | Score |
|---|---:|---:|---:|---:|---:|---:|---:|
| SEUIL | 5 | 5 | 4 | 4 | 5 | 4 | 27/30 |
| PORTÉE | 5 | 5 | 4 | 5 | 5 | 5 | 29/30 |
| VEILLE | 4 | 5 | 4 | 5 | 5 | 4 | 27/30 |

## Contrôles transversaux

- aucune direction retenue ne montre un collage 3D visible ;
- le meuble est complet et ancré au sol ;
- la perspective reste dans une plage équivalente `35–50 mm` ;
- la caméra reste entre `125 et 145 cm` ;
- les accessoires ne masquent pas la géométrie ;
- les niches ont des charges visuelles légères et plausibles ;
- aucun sujet généré n’est présenté comme preuve ;
- aucune image pilote n’est copiée dans `public/`.

## Portes restantes

1. H-005 : dimensions et ouvertures VEILLE.
2. H-009 : coupons, prototype, laboratoire, emballage et golden sample.
3. H-010 : comparaison finale aux échantillons physiques et validation
   indépendante avant publication.

## Décision

Les recettes SEUIL et PORTÉE passent la porte numérique A6. VEILLE valide une
direction artistique, pas une géométrie commercialisable. A7 peut produire les
lots numériques SEUIL/PORTÉE et préparer VEILLE sous statut bloqué ; aucune
image ne devient preuve ou média public sans les portes physiques.
