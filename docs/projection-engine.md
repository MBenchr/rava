# Moteur de projection VIAIRE

## Principe

Le simulateur privilégie un parcours court et une image photographique cohérente.
Il ne colle aucun rendu 3D sur la photo du client et ne lance aucun second modèle
pour noter ou rejeter le résultat.

```text
photo client + point de placement + photo officielle du produit
                       -> une édition OpenAI -> résultat
```

## Sources de vérité

- La photo `packshot` de la finition sélectionnée est l’unique référence visuelle
  envoyée à OpenAI.
- SEUIL conserve `102 × 184 × 42 cm`.
- PORTÉE conserve `184 × 102 × 42 cm`.
- VEILLE conserve exactement les deux ouvertures et l’échelle visible sur sa
  photographie officielle; aucune dimension numérique n’est inventée.
- Le point posé par le client reste l’ancrage au sol.
- La boîte de placement est automatiquement ajustée au ratio du produit, sans
  poignée de redimensionnement.

## Contrat d’exécution

1. La photo est orientée, réduite si nécessaire et conservée sans crop.
2. L’utilisateur choisit le produit, la finition et `mur` ou `séparation`.
3. Un clic place la silhouette au sol.
4. Le serveur prépare un masque local autour de cette zone.
5. OpenAI reçoit deux images: la pièce du client puis la photographie officielle
   du produit dans la finition choisie.
6. `gpt-image-2` reconstruit la zone masquée en une seule photographie avec la
   perspective, la lumière, les ombres et les occultations de la pièce.
7. Le résultat est remis exactement au cadrage de la photo d’origine.

Le prompt interdit explicitement toute autre silhouette, toute ouverture ajoutée
ou supprimée et toute modification de la pièce hors masque.

## API locale

`POST /api/projection/jobs` reçoit en `multipart/form-data`:

- `image`
- `productId`
- `finishId`
- `placementMode`
- `placementBox`
- `message` optionnel

`GET /api/projection/jobs/:id` retourne uniquement:

- `queued`
- `preparing`
- `generating`
- `completed`
- `failed`

Le développement conserve au maximum 40 jobs en mémoire pendant 24 heures. Les
photos et clés API ne sont jamais écrites dans les logs.

## Validation

```bash
npm run projection:contract:verify
npm run projection:errors:verify
npm run projection:openai:verify
```

Ces contrôles valident le cadrage sans crop, l’ancrage au sol, le ratio produit,
les erreurs publiques et l’accès à `gpt-image-2`.
