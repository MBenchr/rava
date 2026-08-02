# Runbook — Commandes et service client

## Source de vérité

Stripe prouve le paiement. `isandre_orders` conserve la projection de commande.
`isandre_order_events` conserve l'idempotence et l'audit des webhooks. Un email
n'est jamais une preuve de paiement ou une base de commande.

## Mise en service

1. Appliquer `supabase/migrations/202607280001_isandre_orders.sql`.
2. Configurer `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` côté serveur.
3. Configurer le webhook Stripe sur `/api/stripe/webhook`.
4. Écouter au minimum :
   - `checkout.session.completed` ;
   - `checkout.session.async_payment_succeeded`.
5. Configurer `RESEND_API_KEY`, `RESEND_FROM` et
   `ORDER_NOTIFICATION_EMAIL`.
6. Envoyer une commande test et vérifier :
   - une ligne dans `isandre_orders` ;
   - un événement `completed` ;
   - les IDs produit/finition dans `lines` ;
   - l'email client ;
   - l'email studio.
7. Rejouer le même événement Stripe : aucun second email ne doit partir.

## États

| État | Déclencheur | Communication |
|---|---|---|
| `paid` | Webhook Stripe payé | Confirmation |
| `preparing` | Ordre de fabrication accepté | Mise en préparation |
| `ready_to_ship` | Contrôle final et emballage validés | Interne |
| `shipped` | Prise en charge transporteur | Email avec suivi |
| `delivered` | Preuve transporteur | Confirmation d'arrivée |
| `cancelled` | Annulation autorisée | Confirmation et motif |
| `refunded` | Remboursement Stripe confirmé | Confirmation financière |

Les transitions manuelles doivent conserver l'opérateur, le motif, l'heure et
la preuve dans un événement d'audit avant ouverture au public.

## Incident webhook

1. Lire le statut HTTP Stripe et l'ID d'événement.
2. Chercher `stripe_event_id` dans `isandre_order_events`.
3. Si `failed`, corriger la cause puis utiliser le bouton Stripe « Resend ».
4. Ne jamais modifier l'ID d'événement.
5. Si l'ordre existe mais l'email est `pending`, corriger Resend et relancer
   uniquement la communication avec sa clé idempotente.
6. Ne jamais créer une commande à la main avant d'avoir confirmé la session
   Stripe.

## Service client

Toujours demander la référence courte et retrouver la session Stripe. Ne jamais
demander un numéro de carte. Pour une avarie, conserver photos de l'emballage,
du produit, de l'étiquette et heure de réception.

## Panier abandonné

Désactivé par défaut. Il ne peut être activé qu'après consentement marketing
explicite, preuve du consentement, lien de désinscription et politique de
rétention. L'email connu uniquement par Stripe Checkout ne constitue pas
automatiquement un consentement marketing.

