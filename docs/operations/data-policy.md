# Politique de données opérationnelle

Ce document définit la minimisation technique. La notice légale publique reste
à valider par le conseil compétent.

## Données collectées

- Commande : identité, email, téléphone, adresse, marché, lignes, montants et
  identifiants Stripe.
- Projection : photo source, placement, référence produit, résultat et
  métadonnées techniques.
- Projet : coordonnées, lieu, sélection, message et pièces jointes volontaires.
- Mesure : événements commerce sans donnée de carte.

Le site ne reçoit ni ne stocke les données de carte.

## Rétention

- Projection locale : 24 heures maximum, suppression anticipée possible.
- Commande : durée légale et comptable applicable.
- Journal webhook : durée d'audit liée à la commande.
- Demande projet/trade/presse : durée de traitement puis politique CRM validée.
- Panier navigateur : jusqu'à suppression par l'utilisateur ou politique
  publique finalisée.

## Accès

- Tables Supabase : RLS active, accès service-role uniquement.
- Clés Stripe, Supabase, Resend et OpenAI : serveur uniquement.
- Aucune photo, clé ou adresse dans les logs applicatifs.
- Export et suppression traités à partir d'une identité vérifiée.

## Sous-traitants à déclarer

Stripe, Supabase, Resend, OpenAI, l'hébergeur et les outils de mesure réellement
activés. Une intégration non activée n'est pas présentée comme sous-traitant
effectif.

