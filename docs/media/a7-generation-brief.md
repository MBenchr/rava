# Brief de génération A7 — scènes de désir et d’usage

Date : 28 juillet 2026  
Statut : `D02–D04` produits et contrôlés ; familles matière bloquées

## Entrées obligatoires

Chaque image `D02`, `D03` ou `D04` utilise au minimum :

1. le master `C01` de la finition demandée ;
2. le master `C02` du même produit et de la même finition ;
3. pour SEUIL et PORTÉE, le manifeste géométrique approuvé ;
4. pour VEILLE, le statut `concept-blocked` et l’interdiction de publier une
   cote.

La scène est générée comme une photographie complète. Aucun détourage ou
collage 3D n’est accepté.

## Contrat immuable

- conserver exactement la silhouette, le rapport de face, la profondeur
  apparente, le socle, le nombre, l’ordre et la forme des ouvertures ;
- SEUIL : face `1020 × 1840 mm`, profondeur `420 mm`, quatre niches à gauche,
  une arche et trois niches à droite ;
- PORTÉE : face `1840 × 1020 mm`, profondeur `420 mm`, trois niches à gauche,
  une arche et une niche au centre, trois niches à droite ;
- VEILLE : exactement une arche supérieure et une niche horizontale
  inférieure ; aucune troisième ouverture ;
- meuble complet à plus de 90 %, verticales redressées, focale intérieure
  crédible de 35 à 50 mm ;
- surface minérale mate, faible lustre, microtexture continue et non
  répétitive ; aucun plastique, béton brut, joint, collage ou arête vive ;
- dos ouvert, ombre de contact continue, gravité et occultations plausibles ;
- 30 à 50 % des ouvertures restent vides ;
- aucun texte, logo, watermark ou marque tierce lisible.

## Stylisme par finition

| Finition | Lumière | Objets dominants |
|---|---|---|
| Craie | matin diffus | chêne pâle, livres crème, verre fumé, céramique claire |
| Beurre | matin solaire | bois blond, petite touche d’inox, verre ambre, livre cobalt |
| Sauge | après-midi calme | noyer, céramique olive, livres verts/noirs, végétal |
| Argile rose | début de soirée | verre ambré, céramique noire, livre d’art, textile bordeaux éloigné |

Les livres ont des épaisseurs et appuis crédibles. Les objets lourds, les
écrans et les enceintes sont exclus avant validation des charges.

## Matrice des scènes

| Produit | `D02` matin | `D03` soir | `D04` usage fonctionnel |
|---|---|---|---|
| SEUIL | Craie : seuil salon/jardin ; Beurre : appartement créatif au petit-déjeuner | Sauge : passage familial en fin d’après-midi ; Argile rose : salon culturel au crépuscule | séparation ouverte, quatre finitions |
| PORTÉE | Craie : derrière canapé, lecture du matin ; Beurre : salon-repas compact et lumineux | Sauge : musique/lecture face au jardin ; Argile rose : salon du soir | rangement bas traversant, quatre finitions |
| VEILLE | Craie : premier matin ; Beurre : réveil solaire | Sauge : lecture calme ; Argile rose : rituel du soir | livre, verre et lampe près du lit, quatre finitions |

## Rôles et ratios

- `D02` : vie quotidienne du matin, master `3:2`, dérivé mobile `4:5`.
- `D03` : vie quotidienne du soir, master `3:2`, dérivé mobile `4:5`.
- `D04` : usage fonctionnel, master `4:5`.

Le pipeline produit ensuite WebP, AVIF, JPEG, six largeurs utiles, vignette,
checksums et déclaration IPTC/XMP de l’origine algorithmique.

La release `2026.07.28-a7.3` enregistre les `24` masters `D02–D04`. Une
variante PORTÉE Beurre D04 a été rejetée pour fusion des ouvertures ; elle
n’appartient ni au registre ni aux dérivés publics.

## Macros et preuves réelles

`M01–M03` ne sont pas générées avant le golden sample H-009 et la validation
colorimétrique H-010. Atelier, artisan, prototype, emballage, client, presse
et lieu de fabrication restent des photographies réelles exclusivement.
