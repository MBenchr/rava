# Monitoring, alertes et sauvegardes

État : configuration préparée ; activation distante bloquée.

## Disponibilité

Render interroge `GET /api/health`. La réponse ne contient ni secret, ni état
détaillé des fournisseurs. Elle confirme uniquement que le processus Next.js
répond et si le catalogue est `gated` ou `released`.

Alertes à configurer avant preview :

| Signal | Alerte | Escalade |
|---|---|---|
| disponibilité | 2 échecs consécutifs / 2 min | vérifier Render puis rollback |
| taux `5xx` | > 1 % sur 5 min | geler checkout et projection |
| checkout | 3 échecs consécutifs | vérifier Stripe et configuration marché |
| webhook | retard > 5 min ou signature invalide répétée | isoler endpoint et vérifier secret |
| email | 5 échecs sur 15 min | conserver commande, relancer l'envoi |
| projection | taux d'échec > 20 % sur 30 min | désactiver le CTA, ne pas bloquer l'achat |
| LCP terrain | p75 > 2,5 s pendant 24 h | auditer hero, cache et origine média |

Les alertes ne doivent jamais inclure une photo client, une adresse complète,
un token, une clé ou le corps brut d'un webhook.

## Journalisation

- utiliser un identifiant de requête et l'identifiant Stripe ;
- journaliser les transitions, pas les données sensibles ;
- conserver l'idempotence dans `isandre_order_events` ;
- masquer emails et adresses dans les outils d'observabilité ;
- séparer erreurs projection, paiement, email et stockage.

## Sauvegardes

Avant ouverture publique :

1. activer les sauvegardes Supabase adaptées au plan retenu ;
2. exporter quotidiennement les tables commandes, événements et passeports ;
3. conserver une copie chiffrée dans un compte distinct ;
4. tester une restauration dans un projet isolé ;
5. documenter RPO, RTO, propriétaire et date du dernier test.

Cibles initiales :

- RPO commandes : 24 h maximum, à réduire après montée en charge ;
- RTO storefront : 60 min ;
- RTO commandes et webhooks : 4 h ;
- test de restauration : mensuel pendant le lancement.

## Exercices avant release

- coupure Stripe ;
- webhook dupliqué et désordonné ;
- panne Resend ;
- Supabase indisponible ;
- quota OpenAI épuisé ;
- rollback Render ;
- restauration d'une commande et de son journal ;
- vérification que l'achat reste possible quand la projection est coupée.

L'activation des fournisseurs, alertes et sauvegardes constitue une mutation
distante et n'est pas effectuée dans la phase locale.
