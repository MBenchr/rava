# Contrat de mesure et de consentement

Version : `2026-07-29`  
État fournisseur : **désactivé**

## Règle

Le bus `isandre:commerce` est la seule source événementielle du storefront. Il
fonctionne localement, ne persiste rien et retire les champs susceptibles de
contenir une identité, un message ou une image.

Trois niveaux sont séparés :

1. stockage nécessaire : panier, marché, langue ;
2. préférence de mesure d'audience : enregistrée localement ;
3. destination tierce : interdite tant que `cmpValidated` et la porte de la
   destination ne sont pas toutes deux vraies.

Le consentement utilisateur ne vaut donc jamais activation fournisseur. La
position par défaut est `analytics=false`, `marketing=false`.

## Registre

| Étape | Événements |
|---|---|
| découverte | `hero_view`, `view_item_list`, `view_item` |
| décision | `select_item`, `select_finish`, `gallery_image_view`, `zoom_open`, `dimensions_open`, `technical_sheet_download` |
| achat | `view_cart`, `add_to_cart`, `begin_checkout`, `purchase` |
| projection | `projection_open`, `projection_upload`, `projection_placement`, `projection_completed`, `projection_failed`, `projection_download`, `projection_share`, `add_to_cart_from_projection` |
| service | `project_request`, `trade_request`, `press_request` |

## Données interdites

Le bus supprime notamment `name`, `email`, `phone`, `address`, `message` et
`room_image`. Les événements ne portent que des identifiants catalogue, une
finition, une quantité, un montant, une locale, un marché, une étape ou un
identifiant transactionnel fournisseur.

## Activation future

H-019 doit apporter :

- choix et validation juridique du CMP par marché ;
- inventaire final des fournisseurs et finalités ;
- preuve réseau : zéro appel tiers avant accord ;
- retrait et mise à jour du consentement ;
- politique de conservation ;
- activation séparée audience / marketing ;
- recette navigateur et mobile.

