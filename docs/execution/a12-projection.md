# A12 — Projection simplifiée

Statut : **contrat, UX et accès modèle validés**. La recette photographique
finale sur pièces clientes réelles reste une porte de lancement.

## Principe

La projection ne reconstruit plus un moteur 3D dans le navigateur. Elle utilise :

1. la photo complète du client ;
2. un point d'ancrage au sol ;
3. le rapport largeur/hauteur canonique du produit ;
4. une seule photographie officielle de la bonne pièce et de la bonne finition ;
5. un seul edit OpenAI `gpt-image-2`.

Le prompt interdit explicitement le collage, l'overlay 3D, la modification des
ouvertures et toute autre identité produit. Il autorise seulement une
intégration photographique cohérente avec la pièce.

## Contrat de placement

- La photo est normalisée selon EXIF puis redimensionnée `inside`, jamais cropée.
- Les formats portrait, paysage, carré et extrêmes utilisent un canevas contenu.
- Le clic indique le centre du socle.
- La profondeur apparente est déduite de la hauteur du point dans l'image.
- Le rapport du produit est recalculé en pixels de la photo et ne peut pas être
  déformé.
- La boîte doit rester entièrement dans la photo.
- SEUIL utilise `102 × 184 × 42 cm`.
- PORTÉE utilise `184 × 102 × 42 cm`.
- VEILLE reste désactivée tant que ses dimensions ne sont pas approuvées.

## UX

- États : choix photo, placement, création, résultat.
- Commandes produit, finition et placement restent dans le même écran.
- Une consigne libre facultative est limitée à 320 caractères.
- La progression reflète la préparation puis la génération.
- Le comparateur conserve les deux images en `object-contain` et accepte tactile,
  pointeur et clavier via un `input[type=range]`.
- Le résultat permet téléchargement, partage, ajustement, nouvelle génération et
  ajout au panier.
- Ajuster, changer de produit ou de finition supprime explicitement le job.
- Une relance supprime d'abord le résultat précédent afin de ne pas réutiliser
  l'empreinte idempotente.

## Données

- Les jobs locaux expirent après 24 heures.
- Le registre est borné à 40 jobs.
- Les images et résultats ne sont pas écrits dans les logs.
- Les réponses HTTP de job sont `no-store`.
- L'endpoint `DELETE /api/projection/jobs/:id` permet la suppression anticipée.
- Le stockage actuel est volontairement local au processus ; une production
  multi-instance devra fournir un adaptateur persistant avec la même rétention.

## Preuves automatiques

```text
npm run projection:verify
npm run projection:contract:verify
npm run projection:errors:verify
npm run projection:openai:verify
npm run typecheck
npm run lint
```

Résultats :

- géométrie catalogue cohérente ;
- cinq rapports photo validés ;
- ancrage au sol et ratio déterministes ;
- une seule référence officielle dans le prompt ;
- modèle `gpt-image-2` accessible avec la configuration courante ;
- erreurs quota, authentification, configuration, référence et timeout classées.

## Porte de lancement

Avant activation publique, une recette payante doit couvrir au minimum :

- 12 pièces réelles ;
- SEUIL et PORTÉE ;
- quatre finitions ;
- portrait et paysage ;
- mur, séparation, faible lumière et premier plan ;
- contrôle humain de l'identité, du point d'ancrage et du réalisme.

Une projection ratée ne doit jamais servir de preuve produit ou d'image
catalogue.

