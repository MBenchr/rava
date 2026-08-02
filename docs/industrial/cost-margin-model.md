# Modèle de coûts et marge A5

Fichier canonique : `isandre-industrial-cost-model.xlsx`

## Usage

Le classeur sépare :

- prix publics ;
- hypothèses commerciales ;
- budget de conception ;
- devis fournisseur ;
- landed cost ;
- marge contributive ;
- score fournisseur ;
- contrôles et sources.

Les cellules jaunes sont des entrées. Les valeurs de budget sont identifiées
`PLANNING`, jamais `QUOTE`. Les cellules de VEILLE restent bloquées tant que sa
géométrie n’est pas validée.

## Volumes

Les mêmes paliers sont imposés à tous les fournisseurs :

`10`, `50`, `100`, `250`, `500` unités par produit.

## Landed cost

```text
coût usine
+ emballage
+ QC
+ fret et assurance
+ droits
+ réception / entrepôt
+ réserve casse
+ retouche / réparation
+ coût financier
+ outillage amorti
```

Le ballast est une ligne séparée. Le modèle distingue son coût de fabrication
et son transport afin d’éviter de déplacer inutilement de l’acier.

## Contribution

```text
prix net de TVA
- frais de paiement
- réserve retours
- réserve garantie
- allocation marketing
- landed cost
= contribution
```

Les taux par défaut sont des hypothèses de travail visibles, modifiables et non
des faits comptables. Une version marché doit remplacer TVA, droits, paiement,
fret et retours par des données réelles avant ouverture commerciale.

## Portes

Le modèle doit afficher `BLOCKED` lorsque :

- le devis n’est pas complet ;
- une composante est négative ;
- VEILLE est sélectionnée ;
- la contribution est sous la cible ;
- le landed cost dépasse le plafond de conception ;
- le score fournisseur est incomplet ou un gate est `NO-GO`.

Le lancement exige un coût rendu confirmé pour chaque marché, pas une simple
conversion de devise.
