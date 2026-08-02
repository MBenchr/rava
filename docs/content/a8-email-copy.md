# A8 — Emails de service

## Séquence transactionnelle

| Moment | Objet anglais | Objet français |
|---|---|---|
| Paiement confirmé | Your ISANDRE order is confirmed | Votre commande ISANDRE est confirmée |
| Fabrication | An update on your ISANDRE piece | Des nouvelles de votre pièce ISANDRE |
| Expédition | Your ISANDRE piece is on its way | Votre pièce ISANDRE est en chemin |
| Projection | Your ISANDRE room view | Votre vue ISANDRE dans votre intérieur |
| Panier consenti | Your selected piece is still in your bag | Votre pièce est toujours dans votre panier |

## Structure obligatoire

1. objet et préheader explicites ;
2. nom de la pièce, finition, quantité et total issus de la commande canonique ;
3. adresse et marché confirmés ;
4. état réel, jamais une étape anticipée ;
5. prochain événement attendu ;
6. lien de service signé ou adresse de contact ;
7. mentions légales et désinscription pour tout message marketing.

## Règles

- la confirmation part uniquement après webhook Stripe signé ;
- l'identifiant Stripe sert de clé d'idempotence ;
- le panier abandonné exige un consentement approprié ;
- aucune date ferme n'est promise sans donnée de production ;
- chaque email est envoyé dans la langue de la commande ;
- montants et taxes viennent de Stripe, jamais du navigateur.
