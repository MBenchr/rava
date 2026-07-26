# Moteur de projection VIAIRE

## Règle d’architecture

La photographie finale est générée comme une image cohérente. Aucun rendu 3D, cutout ou calque produit n’est collé sur la photo du client.

La vérité métrique reste dans `modules/projection/core/reference-kits.data.json`. Elle sert à verrouiller le ratio, l’épaisseur des jonctions, le nombre d’ouvertures et les dimensions transmises au modèle d’image.

```text
photo complète -> placement utilisateur -> références produit approuvées
               -> génération photographique locale -> contrôle -> résultat
```

## Produits

| Produit | Dimensions | État projection |
|---|---:|---|
| SEUIL | 1020 × 1840 × 420 mm | approuvé |
| PORTÉE | 1840 × 1020 × 420 mm | approuvé |
| VEILLE | non validées | bloqué par l’API et l’interface |

SEUIL et PORTÉE partagent une épaisseur de structure de 80 mm. PORTÉE ne peut pas être aminci pour paraître plus léger.

## Contrat d’exécution

1. La photo est orientée et normalisée sans crop.
2. L’utilisateur place un cadre au ratio métrique verrouillé sur la photo entière.
3. Le client transmet la photo, le produit, la finition, l’emplacement et l’angle.
4. Le serveur rejette un produit dont les dimensions ne sont pas approuvées.
5. OpenAI reçoit la photo d’origine en première entrée, puis la photographie officielle de la finition, la vue frontale métrique et la vue à 30°.
6. Le masque ouvre uniquement la zone du produit, de son ombre et de ses interactions locales.
7. Le modèle reconstruit cette zone comme une seule photographie : perspective, lumière, contact au sol et occultations.
8. Aucun calque produit n’est réappliqué après la génération.
9. Le résultat est recadré exactement au format de la photo d’origine.

## API locale

### Créer un job

`POST /api/projection/jobs` en `multipart/form-data` :

- `image`
- `productId`
- `finishId`
- `placementMode`
- `placementBox`
- `yawDeg`
- `message` optionnel

La réponse `202` contient un job et son identifiant.

### Lire un job

`GET /api/projection/jobs/:id` retourne `queued`, `analysing`, `rendering`, `integrating`, `verifying`, `completed`, `rejected` ou `failed`.

Les artefacts terminés portent les versions du kit, du prompt et du pipeline ainsi que les scores qualité disponibles.

## Stockage et production

Le développement utilise un registre mémoire limité à 40 jobs avec une rétention de 24 heures. Il ne journalise ni photo ni clé API.

Avant un déploiement public :

- PostgreSQL pour l’état et l’idempotence des jobs ;
- Cloudflare R2 pour les entrées et artefacts chiffrés ;
- worker persistant pour le traitement ;
- purge vérifiable après 24 heures ;
- URLs signées courtes au lieu de data URLs ;
- évaluation visuelle produit/résultat avant publication ;
- métriques sur rejets, délais et erreurs.

## Validation

```bash
npm run projection:verify
```

Cette commande vérifie :

- dimensions des géométries de référence à ±1 mm ;
- huit ouvertures pour SEUIL et PORTÉE ;
- épaisseur structurelle de 80 mm pour les deux produits ;
- symétrie des dimensions de famille : `1020 × 1840` et `1840 × 1020` ;
- profondeur commune de 420 mm.

La recette visuelle finale couvre 12 pièces tests × 2 produits × 4 finitions avant ouverture publique.
