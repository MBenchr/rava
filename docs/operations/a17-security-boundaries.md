# Frontières sécurité A17

## Vérités et chemins d'écriture

| Domaine | Vérité | Écriture | Preuve |
|---|---|---|---|
| catalogue/prix | `lib/isandre/catalog.ts` | code versionné uniquement | checkout strict, prix recalculé serveur |
| paiement | Stripe + commande Supabase | webhook Stripe signé | idempotence événement et commande |
| demande service | Supabase service role | `POST /api/service-requests` | Zod strict, consentement, honeypot |
| projection | kit produit + photo temporaire | job projection | type, taille, signature, produit libéré |
| passeport | Supabase service role | contrats owner fermés | HMAC, RLS, release false |
| mesure | bus local | aucune destination active | consentement deny-by-default |

## Règles

- aucun secret fournisseur dans un composant client ;
- aucun montant navigateur accepté comme prix ;
- aucun webhook traité sans signature ;
- aucun upload projection traité avant contrôle du type, de la signature et de
  la taille ;
- aucune seconde route de contact ne contourne le domaine canonique ;
- aucune activation live tant que les portes marque, catalogue, CMP et
  passeport restent fermées ;
- aucune photo, consigne libre ou clé ne doit apparaître dans les logs.

La protection volumétrique, le WAF et les alertes fournisseur relèvent du
déploiement H-007/H-019. Le code conserve néanmoins des limites strictes à
l'entrée.

