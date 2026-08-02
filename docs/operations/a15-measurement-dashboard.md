# Tableau de bord A15

## Vue dirigeante

La lecture hebdomadaire utilise quatre étages, sans métrique de vanité :

| Étape | Indicateur | Calcul |
|---|---|---|
| désir | taux de fiche vue | `view_item / hero_view` |
| décision | interaction produit | utilisateurs avec `select_finish`, `gallery_image_view`, `zoom_open` ou `dimensions_open` / `view_item` |
| panier | taux d'ajout | `add_to_cart / view_item` |
| paiement | initiation et achat | `begin_checkout / view_cart`, puis `purchase / begin_checkout` |

Segments obligatoires : produit, finition, marché, devise, langue, type
d'appareil et source de campagne. Toute cellule sous le seuil de confidentialité
retenu lors de H-019 est masquée.

## Projection

- ouverture → upload ;
- upload → placement ;
- placement → résultat ;
- résultat → ajout panier ;
- échec par code stable, jamais par contenu de photo.

## Service

Les demandes projet, prescripteur et presse sont comptées séparément. Le
contenu des formulaires et les coordonnées ne quittent jamais le domaine CRM.

## Qualité

Le dashboard comporte aussi :

- revenu fournisseur vérifié, pas le montant du navigateur ;
- taux de duplication transactionnelle ;
- taux d'erreur checkout ;
- taux d'échec projection ;
- couverture des événements par version de release.

