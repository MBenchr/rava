# Modèle de remboursement

Statut : cadre opératoire à valider juridiquement avant lancement.

## Principes

- Le statut « préparé sur commande » ne supprime pas à lui seul un droit de
  rétractation. Seule une personnalisation réelle et juridiquement qualifiée
  peut modifier le régime applicable.
- Les conditions présentées avant paiement prévalent ; aucune exception cachée
  n'est ajoutée après la commande.
- Le remboursement financier est exécuté dans Stripe.
- L'état local n'est mis à `refunded` qu'après confirmation Stripe.
- Les frais, délais et responsabilités de retour sont écrits par marché.

## Motifs

| Motif | Preuve | Décision |
|---|---|---|
| Annulation avant lancement production | Heure et état de l'ordre | Remboursement total selon CGV |
| Rétractation standard | Demande datée, marché, état du produit | Selon droit local et CGV |
| Avarie transport | Photos, emballage, étiquette, réserve | Remplacement, réparation ou remboursement |
| Défaut produit | Photos, lot, contrôle qualité | Diagnostic puis solution |
| Erreur de pièce/finition | Commande et produit reçu | Correction prioritaire |
| Personnalisation réelle | Spécification signée | Règle spécifique validée avant paiement |

## Contrôle

Toute décision conserve : opérateur, date, motif, montant, devise, référence
Stripe, preuve, communication client et issue logistique.

