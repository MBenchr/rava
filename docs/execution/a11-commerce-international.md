# A11 — Commerce international

Statut : **implémenté et validé localement**, activation live conditionnée aux
portes humaines listées dans `blockers.md`.

## Vérité canonique

- Catalogue et prix EUR : `lib/isandre/catalog.ts`.
- Marchés, devises, arrondis et livraison : `lib/markets.ts`.
- Contrat d'entrée strict : `lib/checkout-contract.ts`.
- Projection Stripe : `lib/checkout-session.ts`.
- Paiement : Stripe Checkout hébergé ou Express Checkout Elements.
- Confirmation de paiement : webhook Stripe signé, jamais le retour navigateur.

Le navigateur transmet uniquement le produit, la finition, la quantité, la
langue et le marché. Tout champ supplémentaire, notamment un montant, est
rejeté. Le serveur relit le prix canonique puis applique la grille du marché.

## Configuration des marchés

Trente marchés sont catalogués. Cette liste est une capacité technique, pas une
promesse de lancement simultané. Chaque activation commerciale exige un tarif
transporteur réel, une politique fiscale et une décision de service.

- Ancre commerciale CHF : CHF 3 000 pour une variante canonique à EUR 3 000.
- Livraison canonique : EUR 60 à EUR 90 selon la zone.
- Prix et livraison sont arrondis selon la devise.
- Taxes incluses pour l'UE ; calcul séparé pour les marchés d'importation.
- Le pays est détecté côté serveur, mémorisé après choix manuel et toujours
  modifiable.

## Paiement

- `Add to bag` conserve le panier dans le navigateur.
- Le panier n'est vidé qu'après récupération serveur d'une session payée.
- Une annulation Stripe conserve le panier.
- Chaque intention de checkout porte un UUID ; les retries Stripe partagent une
  clé d'idempotence sans fusionner deux clients.
- Apple Pay, Google Pay, PayPal, Klarna, Amazon Pay et Link sont demandés en
  mode `auto`. Stripe ne rend que les méthodes réellement éligibles au client,
  au navigateur, au marché et au compte.
- Une configuration Stripe Payment Method Configuration peut contrôler les
  méthodes sans changement de code.
- Stripe Tax et la création de facture sont préparés.

## Preuves automatiques

```text
npm run markets:verify
npm run checkout:verify
npm run typecheck
npm run lint
```

Les vérificateurs prouvent :

- exactement 30 marchés uniques ;
- frais canoniques compris entre EUR 60 et EUR 90 ;
- arrondis par devise ;
- ancre CHF exacte ;
- contrat strict ;
- refus d'un montant navigateur ;
- recalcul du prix depuis le catalogue ;
- HTTPS forcé sur les domaines publics ;
- pays de livraison limité au marché sélectionné ;
- Stripe Tax activé dans les paramètres de session.

## Portes de production

Le code ne prétend pas que ces portes sont déjà franchies :

- siège validé dans Stripe Tax ;
- immatriculations fiscales et Stripe Tax registrations ;
- grille transporteur par produit, poids, dimensions et destination ;
- décision DDP/DAP et retours pour le Royaume-Uni et l'international ;
- moyens de paiement activés et testés dans le compte Stripe live ;
- domaine final et domaine de paiement vérifiés ;
- clés webhook live et endpoint public ;
- domaine email Resend vérifié.

