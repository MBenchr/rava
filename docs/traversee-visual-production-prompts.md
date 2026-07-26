# TRAVERSÉE — Cahier de production visuelle

Version de travail alignée sur la home et les fiches produit actuelles.

## 1. Objectif

Ce document définit les visuels à produire pour TRAVERSÉE, leur emplacement exact dans le site, leur cadrage, leur résolution, la référence V2040 à joindre et le prompt à utiliser.

Le principe non négociable est le suivant : **aucune image produit n'est générée depuis le texte seul**. Chaque génération commence par l'ajout d'une image officielle V2040 du produit. La géométrie de cette référence est traitée comme un modèle 3D immuable. Le décor, la lumière, le point de vue et la finition peuvent changer. La forme ne change jamais.

Les prompts sont rédigés en anglais, car ils servent directement aux outils de génération. Les consignes de production et de validation restent en français.

## 2. Ce qu'il faut produire en priorité

| Priorité | Série | Quantité finale | Usage |
|---|---:|---:|---|
| P0 | Packshots e-commerce frontaux | 12 | Merchant Center, panier, checkout, swatches |
| P0 | Heroes storefront desktop | 12 | Home et fiche produit, 3 produits × 4 finitions |
| P0 | Heroes storefront mobile | 12 | Même scène adaptée au téléphone |
| P0 | Vues traversantes validées | 3 | Fiche produit, preuve de construction ouverte |
| P0 | Macros de finition | 4 | Matière, swatches, détails PDP |
| P1 | Scènes d'usage éditoriales | 6 | Bande d'usage, campagne, réseaux sociaux |
| P1 | Hero campagne Londres | 2 | Landing/campagne `THE FRENCH EDITION` |
| P1 | Démonstrations projection | 3 paires | Avant/après de la fonction de simulation |
| P2 | Vues de fabrication | Photos réelles | Provenance, gestes, atelier |

Le premier lot à produire est donc : **12 packshots, 3 heroes maîtres en Chalk, 9 variations de finition, puis 12 adaptations mobiles**.

## 3. Références officielles à joindre

Les chemins ci-dessous sont les sources haute définition du projet. Même si leur nom interne contient encore `mura`, elles représentent les trois produits TRAVERSÉE actuels.

### SEUIL 01

Référence géométrique principale :

`assets/rava-v2040-source/mura-01/packshots/mura-01-cabinet-vertical-ivory-packshot-front.png`

Références de finition :

| Finition | Image à joindre |
|---|---|
| Chalk / Craie | `assets/rava-v2040-source/mura-01/packshots/mura-01-cabinet-vertical-ivory-packshot-front.png` |
| Butter / Beurre | `assets/rava-v2040-source/mura-01/packshots/mura-01-cabinet-vertical-butter-packshot-front.png` |
| Sage / Sauge | `assets/rava-v2040-source/mura-01/packshots/mura-01-cabinet-vertical-sage-packshot-front.png` |
| Plaster Rose / Rose plâtre | `assets/rava-v2040-source/mura-01/packshots/mura-01-cabinet-vertical-rose-plaster-packshot-front.png` |

Verrou géométrique : 102 × 184 × 42 cm, silhouette verticale monolithique, 8 ouvertures exactement, 4 niches verticales à gauche, 1 grande arche supérieure à droite, 2 niches horizontales médianes à droite, 1 grande niche horizontale basse à droite, socle continu en retrait, dos ouvert.

### HORIZON 02

Référence géométrique principale :

`assets/rava-v2040-source/mura-02/packshots/mura-02-cabinet-horizontal-ivory-packshot-front.png`

Références de finition :

| Finition | Image à joindre |
|---|---|
| Chalk / Craie | `assets/rava-v2040-source/mura-02/packshots/mura-02-cabinet-horizontal-ivory-packshot-front.png` |
| Butter / Beurre | `assets/rava-v2040-source/mura-02/packshots/mura-02-cabinet-horizontal-butter-packshot-front.png` |
| Sage / Sauge | `assets/rava-v2040-source/mura-02/packshots/mura-02-cabinet-horizontal-sage-packshot-front.png` |
| Plaster Rose / Rose plâtre | `assets/rava-v2040-source/mura-02/packshots/mura-02-cabinet-horizontal-rose-plaster-packshot-front.png` |

Verrou géométrique : 184 × 102 × 42 cm, silhouette horizontale monolithique, 8 ouvertures exactement, 3 petites niches verticales à gauche, 1 grande arche centrale, 1 niche horizontale basse centrale, 2 niches horizontales superposées à droite et 1 grande niche horizontale basse à droite, socle continu en retrait, dos ouvert. Toutes les marges, montants et jonctions visibles conservent l'épaisseur de 80 mm du modèle vertical.

### AUBE 04

Référence géométrique principale :

`assets/rava-v2040-source/mura-04/packshots/mura-04-nightstand-rose-plaster-packshot-front.png`

Références de finition :

| Finition | Image à joindre |
|---|---|
| Chalk / Craie | `assets/rava-v2040-source/mura-04/packshots/mura-04-nightstand-ivory-packshot-bedroom.png` |
| Butter / Beurre | `assets/rava-v2040-source/mura-04/packshots/mura-04-nightstand-butter-packshot-front.png` |
| Sage / Sauge | `assets/rava-v2040-source/mura-04/packshots/mura-04-nightstand-sage-packshot-front.png` |
| Plaster Rose / Rose plâtre | `assets/rava-v2040-source/mura-04/packshots/mura-04-nightstand-rose-plaster-packshot-front.png` |

Verrou géométrique : silhouette monolithique arrondie, 2 ouvertures exactement, 1 grande arche supérieure, 1 niche horizontale basse, plateau supérieur continu, socle continu en retrait, aucun tiroir, aucune porte, aucun troisième compartiment, dos ouvert. Aucune dimension numérique n'est inventée tant que la fiche fabricant n'est pas validée. Dans une chambre, le plateau arrive approximativement à hauteur du dessus du matelas.

## 4. Workflow obligatoire pour chaque image

1. Ajouter d'abord la référence officielle du produit dans la conversation ou dans le champ d'image de référence.
2. Pour une finition précise, ajouter ensuite la référence de cette finition si elle est différente de la référence géométrique.
3. Identifier les images dans le prompt comme `REFERENCE A — geometry` et `REFERENCE B — finish`.
4. Générer d'abord la version Chalk de la scène.
5. Valider la géométrie avant de demander les autres couleurs.
6. Produire Butter, Sage et Plaster Rose par **édition de la version Chalk acceptée**, pas par trois nouvelles générations.
7. Produire la version mobile par édition/recomposition de la version desktop acceptée.
8. Ne jamais demander simultanément un nouveau décor, une nouvelle caméra et une nouvelle couleur lors d'une correction. Une correction = une variable.

Si l'outil permet l'édition d'image, utiliser explicitement le mode `edit`. La documentation OpenAI actuelle recommande l'Image API pour une génération ou une édition unique et la Responses API pour les itérations multi-tours; les entrées image de `gpt-image-2` sont traitées automatiquement en haute fidélité. La documentation précise aussi que la cohérence et le placement très exact peuvent encore échouer : le contrôle humain reste obligatoire.

## 5. Réglages de production

| Usage | Ratio | Master demandé | Cadrage |
|---|---:|---:|---|
| Packshot principal | 1:1 | 2048 × 2048 | Produit à 78–85 % du cadre |
| Hero home desktop actuel | 6:5 | 2400 × 2000 | Produit à droite, texte libre en haut à gauche |
| Hero home mobile | 4:5 | 1600 × 2000 | Produit dans les 62 % inférieurs |
| Stage collection desktop | 16:10 | 2560 × 1600 | Produit complet, bas gauche calme |
| PDP desktop | 4:3 | 2048 × 1536 | Produit centré, complet |
| PDP mobile | 4:5 | 1600 × 2000 | Produit centré, marge haute |
| Carte d'usage | 4:5 | 1600 × 2000 | Produit complet ou quasi complet |
| Vue traversante | 3:4 | 1536 × 2048 | Produit à 75–82 % du cadre |
| Macro matière | 1:1 | 2048 × 2048 | Arche + surface + profondeur |
| Campagne large | 7:3 | 3360 × 1440 | Texte libre à gauche |
| Source Open Graph | ≈1.91:1 | 1920 × 1008 | Recadrage final 1200 × 630 |

Les tailles proposées respectent les contraintes actuelles de `gpt-image-2` : côtés multiples de 16, bord maximal de 3840 px et ratio inférieur à 3:1. Pour les premiers tests, utiliser une qualité basse ou moyenne. Pour le visuel retenu, relancer ou éditer en qualité haute.

## 6. Direction photographique commune

Caméra intérieure : plein format, objectif 35 à 50 mm, hauteur de caméra entre 1,25 m et 1,45 m, verticales architecturales redressées, perspective naturelle, aucune déformation ultra grand-angle.

Caméra packshot : objectif 70 à 85 mm, appareil parfaitement horizontal, hauteur alignée sur le centre visuel du meuble, légère vue trois-quarts de 5 à 8 degrés maximum uniquement si la profondeur doit être visible.

Lumière : lumière du jour réaliste provenant d'une direction identifiable, ombre de contact sous le socle, occlusion douce dans les niches, contraste modéré, blancs non brûlés, noirs non bouchés.

Matière : surface mate, minérale, légèrement irrégulière, micro-texture sobre, arêtes continues et douces. Le meuble ne doit jamais paraître en plastique, en mousse, gonflable, brillant ou recouvert de velours.

Décor : architecture contemporaine ou maison londonienne raffinée, objets du quotidien rares et crédibles, palette calme mais pas monochrome. Éviter l'intérieur « tout beige IA », les accessoires en surnombre, les plantes improbables, les livres illisibles en premier plan et les clichés londoniens.

Réalisme : conserver de petites irrégularités naturelles dans les murs, textiles et ombres. Pas de lumière impossible, pas d'objets flottants, pas de pieds qui traversent le sol, pas de symétrie artificielle, pas de bokeh excessif.

## 7. Bloc universel à placer au début de chaque prompt

```text
REFERENCE A is the official TRAVERSÉE V2040 product geometry.
Treat REFERENCE A as an immutable CAD model, not as loose inspiration.
Preserve the exact outer silhouette, width-to-height ratio, depth, opening
count, opening positions, arch shape, wall thickness, corner radii, recessed
base and open-back construction. Do not redesign, simplify, improve or invent
any structural element. The product geometry has priority over the room,
styling and composition. If a requested composition conflicts with the exact
geometry, simplify the room and keep the product unchanged.

REFERENCE B, when supplied, defines the exact finish colour and matte mineral
surface. Change only what the prompt explicitly requests. Do not copy props,
background or camera perspective from the references unless requested.
```

## 8. Bloc négatif à placer à la fin de chaque prompt

```text
No added or removed niche. No changed arch. No changed proportions. No warped
verticals. No back panel. No doors. No drawers. No handles. No legs. No castors.
No glossy plastic. No inflated or upholstered appearance. No floating product.
No impossible shadow. No excessive HDR. No artificial blur. No fisheye or
ultra-wide distortion. No text, logo, watermark, border, label or promotional
graphic. The entire product must remain visible and must not touch the frame.
```

## 9. Prompts P0 — Packshots e-commerce

Produire les quatre finitions de chaque produit. Le premier résultat est Chalk. Les trois autres sont obtenus avec le prompt de changement de finition de la section 13.

### 9.1 SEUIL 01 — Packshot frontal propre

Référence à joindre : `SEUIL 01 — référence géométrique principale`.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a premium ecommerce packshot of the exact SEUIL 01 shown in REFERENCE A.
SEUIL 01 is 102 cm wide, 184 cm high and 42 cm deep. It has exactly eight
openings: four vertical niches in a single left column; on the right, one large
upper arch, two horizontal middle niches and one large lower horizontal niche.

Remove every prop from the product. Show the cabinet empty, freestanding and
open-backed. Use a warm light-grey seamless studio background, not pure white,
with a matching matte floor. Front view with only a 5-degree three-quarter turn
to reveal the right depth. Camera centred on the cabinet, 80 mm lens, corrected
verticals. Soft large source from upper left, subtle fill from front, realistic
contact shadow under the recessed base and gentle ambient occlusion inside the
niches.

Finish: Chalk, a warm off-white matte mineral surface matching REFERENCE A,
approximately #F1EBE0, with fine irregular hand-finished texture. Keep the
product between 78 and 84 percent of the square canvas. Leave equal breathing
room above and on both sides. Entire product visible from top to base.

Output: photoreal product photography, 2048 x 2048, square, high quality,
colour-managed neutral light, no props.

[PASTE THE NEGATIVE BLOCK]
```

### 9.2 HORIZON 02 — Packshot frontal propre

Référence à joindre : `HORIZON 02 — référence géométrique principale`.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a premium ecommerce packshot of the exact HORIZON 02 shown in REFERENCE A.
PORTÉE is 184 cm wide, 102 cm high and 42 cm deep. It has exactly eight
openings: three small vertical niches on the left; one dominant central arch
above one long lower niche; and on the right, two stacked horizontal niches
above one large lower horizontal niche. Preserve the continuous recessed base
and open back.

Remove every prop. Show the cabinet empty and freestanding on a warm light-grey
seamless studio floor. Front view with a 5-degree three-quarter turn to reveal
the right depth. Camera centred on the product at mid-height, 80 mm lens,
perfectly corrected architectural verticals. Soft upper-left key light, broad
front fill, realistic contact shadow and controlled occlusion in every opening.

Finish: Chalk, warm off-white matte mineral surface matching REFERENCE A,
approximately #F1EBE0. Product width occupies 84 to 88 percent of the square
canvas while the complete silhouette remains visible with clean margins.

Output: photoreal product photography, 2048 x 2048, square, high quality,
no props, no staging.

[PASTE THE NEGATIVE BLOCK]
```

### 9.3 AUBE 04 — Packshot frontal propre

Références à joindre : `AUBE 04 — référence géométrique principale` puis la référence Chalk.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a premium ecommerce packshot of the exact AUBE 04 shown in REFERENCE A.
It is a compact monolithic bedside table with exactly two openings: one large
upper arch and one lower horizontal niche. Preserve the continuous top, soft
rounded silhouette, exact depth and recessed base. Do not infer a new numeric
size and do not change its proportions.

Remove the book, glass, bowl, lamp and every other prop. Show the bedside table
empty, freestanding and open-backed. Warm light-grey seamless studio background
and floor. Front view with a 5-degree turn to reveal depth, camera centred at
mid-height, 80 mm lens. Soft upper-left key light, very gentle fill, realistic
contact shadow and subtle occlusion in both openings.

Finish: Chalk, matching REFERENCE B, warm off-white matte mineral surface,
approximately #F1EBE0. Product occupies 72 to 78 percent of the square canvas.
Leave generous negative space and show the complete top and base.

Output: photoreal product photography, 2048 x 2048, square, high quality,
no props, no bed, no room staging.

[PASTE THE NEGATIVE BLOCK]
```

## 10. Prompts P0 — Heroes storefront maîtres

Le hero actuel affiche le texte en haut à gauche de l'image. Le produit doit donc rester dans la partie droite et basse du cadre. La zone supérieure gauche doit être calme, sombre ou uniforme, sans objet important.

### 10.1 SEUIL 01 — Londres, seuil lumineux

Référence à joindre : SEUIL 01 Chalk frontal.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create the master storefront hero for TRAVERSÉE SEUIL 01 inside a refined
contemporary London townhouse. The room should feel genuinely London through
proportions and materials, not through clichés: tall sash-window rhythm,
restrained Georgian moulding, warm limestone, pale oak and one quiet modern
artwork. No landmark, Union Jack or decorative stereotype.

Place the complete SEUIL 01 in the right-hand 48 percent of the frame, centred
around x=67 percent. Its top must remain below y=12 percent and its recessed
base above y=91 percent. Keep at least 7 percent clear margin on the right. The
cabinet is fully visible from floor to top and reads immediately at thumbnail
size. Daylight passes physically through every opening. Leave the upper-left
38 percent visually calm for white editorial typography; use a quiet plaster
wall and soft shadow only in that zone.

Show the cabinet at a threshold between a salon and a garden-facing room. Use
only five restrained props in total: a low stone bowl, two books, one small
ceramic vessel and one branch arrangement. Props may occupy niches but must not
hide their contours. No person in this hero.

Camera: full-frame architectural photograph, 40 mm lens, camera height 1.35 m,
three-quarter frontal view, corrected verticals, natural perspective. Light:
soft London daylight from left, realistic contact shadow, restrained dynamic
range, visible but delicate mineral texture.

Finish: Chalk #F1EBE0, matte, warm and clearly separated from the wall by light
and shadow. Output: 2400 x 2000, 6:5, high quality, photoreal premium furniture
campaign. Entire product visible.

[PASTE THE NEGATIVE BLOCK]
```

### 10.2 HORIZON 02 — Londres, séparation ouverte

Référence à joindre : HORIZON 02 Chalk frontal.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create the master storefront hero for TRAVERSÉE HORIZON 02 in a generous
London living space. Place the complete low cabinet as a freestanding open room
divider between a seating area and a dining or reading area. The architecture
is contemporary but grounded: pale limestone floor, soft chalk walls, one tall
sash window, walnut or smoked-oak accent, one restrained artwork. No London
cliché.

Place HORIZON 02 across the lower-right portion of the frame. Its centre is at
x=62 percent and y=64 percent. The product occupies 72 to 80 percent of the
image width, with the entire top, both side edges and recessed base visible.
Keep the upper-left 40 percent calm for typography. The view through the central
arch must reveal the second zone of the room, proving the open-back concept.

Use six restrained props maximum: one large bowl in the central arch, three
books, one small ceramic object and one low tray. Props must not alter the
perceived niche count. Camera: 40 mm architectural lens, height 1.30 m,
slightly elevated but natural, corrected verticals. Soft overcast daylight
from left, realistic floor contact, no dramatic spotlight.

Finish: Chalk #F1EBE0, matte mineral texture. Output: 2400 x 2000, 6:5, high
quality, photoreal premium campaign. Complete product visible and dominant.

[PASTE THE NEGATIVE BLOCK]
```

### 10.3 AUBE 04 — Londres, chambre intime

Références à joindre : AUBE 04 geometry puis AUBE 04 Chalk.

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create the master storefront hero for TRAVERSÉE AUBE 04 in a calm London
bedroom. Use a low upholstered bed, natural linen, a warm plaster wall, pale oak
floor and the subtle proportion of a townhouse window. The room is intimate,
architectural and lived-in without decorative excess.

Place one complete AUBE 04 in the lower-right half of the image, centred near
x=64 percent and y=67 percent. Its top should align naturally with the top of
the mattress. Keep the entire top, both side edges, both openings and recessed
base visible. Leave the upper-left 42 percent quiet for editorial typography.
The edge of the bed may enter from the far right but must never cover the table.

Use only three props: one closed book and one smoke-grey glass on top, one small
stone bowl inside the upper arch. Keep the lower niche empty. Camera: 50 mm
lens, height 1.15 m, straight architectural perspective. Morning daylight from
the left, soft fabric shadows, accurate contact shadow under the base.

Finish: Chalk #F1EBE0, matte mineral texture, visually distinct from the wall.
Output: 2400 x 2000, 6:5, high quality, photoreal premium campaign.

[PASTE THE NEGATIVE BLOCK]
```

## 11. Prompt P0 — Adaptation mobile d'un hero accepté

Joindre le hero desktop accepté comme `REFERENCE C — approved master`. Joindre aussi la référence géométrique comme `REFERENCE A`.

```text
REFERENCE C is the approved desktop campaign image. Adapt that exact scene to a
4:5 mobile composition without redesigning the product or restyling the room.
Preserve the exact product geometry from REFERENCE A and preserve the same
finish, objects, light direction, architecture and photographic realism from
REFERENCE C.

Recompose rather than simply crop. Keep the complete product in the lower
62 percent of the frame. Leave the upper 30 percent calm and readable for a
short white headline. Keep at least 5 percent clear space around every product
edge. Preserve natural perspective and realistic floor contact. Do not enlarge
the product beyond its believable scale in the room.

Output: 1600 x 2000, 4:5, high quality. No text or logo in the image.

[PASTE THE NEGATIVE BLOCK]
```

## 12. Prompt P0 — Stage collection 16:10

Ce visuel reçoit une légende en bas à gauche. Le meuble doit rester légèrement à droite.

```text
Using the approved storefront scene as the source, create a wider collection
stage for the same product and finish. Preserve the exact product, room,
lighting and props. Expand the architecture naturally to the left and right.
Place the complete product slightly right of centre, with its centre near
x=58 percent. Keep the lower-left 30 percent visually quiet for a short white
caption. Show all product edges and the complete recessed base. No new major
furniture item may overlap the product.

Output: 2560 x 1600, 16:10, high quality, photoreal. No text or logo.

[PASTE THE NEGATIVE BLOCK]
```

## 13. Prompt P0 — Variations de finition verrouillées

Ce prompt s'applique au packshot, au hero desktop et au hero mobile déjà validés. Joindre l'image acceptée comme référence principale et la photo officielle de la finition cible comme seconde référence.

| Finition | Description stricte |
|---|---|
| Chalk | warm chalk off-white, `#F1EBE0`, matte mineral |
| Butter | pale softened butter yellow, `#E8CF7A`, matte mineral, never saturated lemon |
| Sage | greyed architectural sage, `#7A8A77`, matte mineral, never mint or olive brown |
| Plaster Rose | muted dusty plaster rose, `#D8AB9E`, matte mineral, never candy pink |

```text
Edit the approved source image. Change only the product finish to [TARGET
FINISH], matching REFERENCE B. Preserve the product geometry pixel-for-pixel:
same silhouette, exact opening count, arch, thickness, depth, base and position.
Preserve the camera, crop, room, props, reflections, light direction, shadow
shape and every background element. Recalculate only the physically correct
light response on the new matte mineral colour. Keep texture density identical.

Target finish: [INSERT THE STRICT FINISH DESCRIPTION FROM THE TABLE].

This is a controlled colourway edit, not a new composition and not a redesign.
Output at the exact same dimensions as the source. No text or logo.
```

## 14. Prompts P0 — Vues traversantes

### Alerte de preuve

Une vue arrière générative peut expliquer le principe traversant, mais elle ne constitue pas une preuve de fabrication. Tant qu'une vue arrière réelle ou un rendu 3D validé par le fabricant n'existe pas, utiliser la mention interne `visualisation de construction` et ne pas l'envoyer comme image principale Merchant Center.

### 14.1 SEUIL 01 — Trois-quarts arrière

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a precise three-quarter rear studio view of the exact SEUIL 01 in
REFERENCE A. Rotate the camera around the real product by approximately 135
degrees relative to the approved front view; do not mirror the front geometry.
Prove that all eight openings pass completely through the 42 cm depth. Preserve
the four left openings, the right arch, the three right horizontal openings,
continuous body thickness and recessed base exactly.

Neutral warm off-white studio cyclorama, empty product, no props. Camera 80 mm,
height aligned with the visual centre, corrected verticals. Soft left key light
and rear rim light reveal wall thickness without making the surface glossy.
Chalk finish. Product occupies 78 percent of the frame and is fully visible.

Output: 1536 x 2048, 3:4, high quality, photoreal technical-editorial render.

[PASTE THE NEGATIVE BLOCK]
```

### 14.2 HORIZON 02 — Trois-quarts arrière

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a precise three-quarter rear studio view of the exact HORIZON 02 in
REFERENCE A. Rotate the camera approximately 135 degrees relative to the front
view. Prove that all eight openings pass completely through the 42 cm depth.
Preserve the exact three left niches, central arch, lower central opening, two
stacked right openings, large lower-right opening, continuous thickness and
recessed base.

Neutral warm off-white studio cyclorama, no props. Camera 80 mm at mid-height,
corrected verticals, soft key light plus a restrained rear rim light. Chalk
matte mineral finish. Entire product visible, occupying about 82 percent of the
frame width.

Output: 1536 x 2048, 3:4, high quality, photoreal technical-editorial render.

[PASTE THE NEGATIVE BLOCK]
```

### 14.3 AUBE 04 — Trois-quarts arrière

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a precise three-quarter rear studio view of the exact AUBE 04 in
REFERENCE A. Rotate the camera approximately 135 degrees. Preserve exactly two
openings and prove that both pass through the full depth. Keep the upper arch,
lower horizontal niche, rounded outer body, continuous top and recessed base
unchanged. No numeric dimensions should be inferred or displayed.

Neutral warm off-white studio cyclorama, empty product, no props. Camera 85 mm
at mid-height, corrected verticals. Soft key light and restrained rear rim
light reveal depth and wall thickness. Chalk matte mineral finish. Complete
product visible, occupying 72 to 78 percent of the frame.

Output: 1536 x 2048, 3:4, high quality, photoreal technical-editorial render.

[PASTE THE NEGATIVE BLOCK]
```

## 15. Prompt P0 — Macros matière par finition

Joindre le détail officiel existant :

`assets/rava-v2040-source/details/mura-v2040-material-arch-macro.png`

Puis joindre la référence de finition cible.

```text
REFERENCE A defines the exact rounded arch geometry and surface texture.
REFERENCE B defines the target finish colour. Create a square editorial macro
of one arch junction, showing the outer face, inner curve, opening depth and a
small part of the top edge. Preserve the exact thickness and radius. Do not
invent cracks, veins, terrazzo chips or a new material.

Finish: [TARGET FINISH DESCRIPTION]. The surface is matte and mineral with a
fine hand-finished irregularity visible only at close range. Use grazing natural
light from the upper left to reveal texture, with a smooth shadow gradient into
the opening. 100 mm macro lens, f/8 look, sharp texture across the key plane,
no excessive depth-of-field blur.

The arch enters from the lower right, leaving approximately 25 percent quiet
negative space in the upper left. Output: 2048 x 2048, square, high quality,
photoreal material study. No props, text, logo or watermark.
```

Une macro doit être produite pour Chalk, Butter, Sage et Plaster Rose en éditant la même composition.

## 16. Prompts P1 — Scènes d'usage éditoriales

### 16.1 ÉLAN — Passage habité

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Place the complete SEUIL 01 as a freestanding threshold between a London living
room and a quieter reading space. Chalk finish. Show real daily life without a
posed model: one adult crossing in the deep background, softly motion-blurred,
never overlapping the cabinet. A folded newspaper, four books and two ceramic
objects may occupy the niches. Daylight passes through all eight openings.

Product centred slightly right, fully visible, occupying 55 percent of frame
height. 50 mm lens, camera height 1.35 m, corrected verticals, natural afternoon
light. The result must feel like a lived-in editorial photograph rather than a
catalogue render. Output: 1600 x 2000, 4:5, high quality.

[PASTE THE NEGATIVE BLOCK]
```

### 16.2 ÉLAN — Ombres du matin

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a quiet morning study of the complete SEUIL 01 in Chalk against a warm
plaster wall near a tall window. The cabinet is empty except for three books and
one small dark ceramic vessel. Window-frame shadows cross the wall and only the
outer edges of the cabinet; they must not hide the niche geometry. Keep the full
product visible from top to base with 8 percent margin.

Camera 50 mm, straight frontal three-quarter view, natural soft sun filtered by
linen, realistic dynamic range. Output: 1600 x 2000, 4:5, high quality.

[PASTE THE NEGATIVE BLOCK]
```

### 16.3 PORTÉE — Ligne derrière le canapé

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Place the complete HORIZON 02 behind a low modular sofa in a refined London open
plan. The sofa back remains below the product's lower third and must not hide
the central arch or recessed base. The cabinet creates a visual boundary toward
a dining area while keeping the view open. Sage finish #7A8A77.

Use six restrained objects maximum and leave the central arch mostly empty.
Overcast daylight, pale limestone, dark oak accent and one textile introduce
contrast. Camera 40 mm, height 1.40 m, corrected verticals. Product occupies
70 percent of frame width and remains fully visible. Output: 1600 x 2000, 4:5.

[PASTE THE NEGATIVE BLOCK]
```

### 16.4 PORTÉE — Dialogue intérieur-jardin

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Place the complete HORIZON 02 in Sage near a large garden opening, parallel to
the camera and used as a low open divider. The garden is visible through the
central arch and lower openings. Keep the product inside the interior; no rain,
soil or outdoor placement. Use a calm limestone floor, pale plaster wall and
one dark sculptural chair in the distant background.

Soft cloudy daylight, 45 mm lens, camera height 1.25 m, corrected perspective.
Show every product edge and the complete base. Output: 1600 x 2000, 4:5.

[PASTE THE NEGATIVE BLOCK]
```

### 16.5 VEILLE — Un seul chevet

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Place one complete AUBE 04 beside a low upholstered bed in a small but refined
London bedroom. Plaster Rose finish #D8AB9E. The product top aligns with the top
of the mattress. Show the full bedside table, both openings and base. Use one
book and a small opaline lamp on top, one stone bowl inside the arch, lower niche
empty. The bed enters only from the right edge and does not cover the product.

Soft morning light through linen, 50 mm lens, camera height 1.10 m, realistic
contact shadow and restrained colour. Output: 1600 x 2000, 4:5, high quality.

[PASTE THE NEGATIVE BLOCK]
```

### 16.6 VEILLE — Paire autour du lit

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a symmetrical but natural bedroom composition with two identical VEILLE
O4 bedside tables, both using the exact geometry from REFERENCE A. Use Chalk on
the left and Plaster Rose on the right only if the commercial page explicitly
states that the products are sold separately; otherwise use the same selected
finish on both sides. Keep both products complete and unobstructed.

Low upholstered bed, natural linen, warm plaster wall, one small artwork and
two restrained lamps. Wide but natural 45 mm lens, corrected verticals, soft
morning light. Output: 2560 x 1600, 16:10, high quality. No text or logo.

[PASTE THE NEGATIVE BLOCK]
```

## 17. Prompts P1 — Campagne `THE FRENCH EDITION`

### 17.1 Hero large ÉLAN

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a cinematic wide campaign image for the arrival of TRAVERSÉE in
London. Show the complete SEUIL 01 in Chalk as the unmistakable subject inside a
refined townhouse threshold. Place the product in the right third, centred near
x=72 percent. Reserve the entire left 45 percent as calm architectural negative
space for campaign typography added later by the website. Use tall windows,
quiet Georgian proportions, limestone, pale oak and one dark bronze accent.

The cabinet is fully visible from top to base, light passes through all eight
openings, and no foreground object overlaps it. Camera 40 mm, height 1.35 m,
corrected verticals. Soft late-morning London daylight, realistic texture and
contact shadows. Editorial but not theatrical.

Output: 3360 x 1440, 7:3, high quality. Do not render the words THE FRENCH
EDITION or any logo inside the image.

[PASTE THE NEGATIVE BLOCK]
```

### 17.2 Hero large PORTÉE

```text
[PASTE THE UNIVERSAL REFERENCE BLOCK]

Create a cinematic wide campaign image of the complete HORIZON 02 in Sage as a
freestanding room divider in a London residence. Place the product across the
right 52 percent and keep the left 42 percent calm for typography. The central
arch frames a distant chair and window, proving the open view without clutter.
Use limestone, chalk plaster, dark oak and one muted textile.

Camera 40 mm, height 1.30 m, corrected verticals, soft overcast daylight. Keep
the complete product visible, including both outer edges and base. Output:
3360 x 1440, 7:3, high quality. No text, logo or watermark.

[PASTE THE NEGATIVE BLOCK]
```

## 18. Prompt P1 — Démonstration projection avant/après

Le `before` doit être une vraie photo de pièce fournie par le propriétaire ou une photo produite spécifiquement pour cette démonstration. Ne pas inventer un faux avant à partir du résultat. Le prompt ci-dessous sert uniquement à éditer cette photo réelle.

Joindre la photo réelle comme `REFERENCE ROOM` et la référence produit comme `REFERENCE PRODUCT`.

```text
Edit REFERENCE ROOM without changing its architecture, camera, crop, furniture,
objects, windows, floor, walls or lighting. Insert the exact product from
REFERENCE PRODUCT inside the user-marked placement area. Treat the product as
immutable geometry. Preserve its exact opening count, silhouette, proportions,
depth, recessed base and open-back construction.

Infer perspective and scale from the room. Align the product base precisely to
the floor plane. Respect the room's vanishing points. Match the existing light
direction, colour temperature, shadow softness and exposure. Add physically
plausible contact shadow and occlusion, but do not darken or restyle the room.
The selected finish is [TARGET FINISH]. Keep the product fully visible whenever
the marked area allows it.

This is a photoreal product placement, not an interior redesign. Output at the
same aspect ratio and crop as REFERENCE ROOM. No text, logo or watermark.

[PASTE THE NEGATIVE BLOCK]
```

## 19. Prompts de correction

### Géométrie fausse

```text
Correct only the product geometry. Restore it exactly from REFERENCE A. Count
and place every opening before rendering. Keep the accepted room, camera, crop,
light, props and finish unchanged. Do not regenerate the scene. The corrected
product must match the reference silhouette, opening count, arch, thickness,
depth and base exactly.
```

### Produit trop grand ou trop petit

```text
Keep the product geometry, room, camera, finish and lighting unchanged. Scale
the complete product uniformly to [TARGET PERCENT] of its current size, anchored
to the exact same floor contact point. Do not stretch width or height. Rebuild
only the physically necessary contact shadow.
```

### Produit coupé

```text
Outpaint the image without changing the product or room. Reveal the complete
product from top to recessed base with at least 6 percent clear margin around
every outer edge. Preserve the current scale and perspective; extend the room
naturally instead of shrinking or redesigning the product.
```

### Mauvaise couleur

```text
Change only the product finish to [TARGET FINISH], matching REFERENCE B. Keep
geometry, texture scale, room, props, crop, camera, lighting and shadow shape
unchanged. The surface remains matte and mineral, never glossy or plastic.
```

### Rendu trop artificiel

```text
Keep the exact composition and product unchanged. Reduce CGI perfection:
restore natural wall variation, physically plausible contact shadows, subtle
material roughness, realistic daylight falloff and restrained dynamic range.
Remove excessive sharpening, HDR, glow, plastic smoothness and artificial depth
of field. Do not add decorative objects.
```

## 20. Placement exact dans le site

| Emplacement | Image | Règle de composition |
|---|---|---|
| Home premier écran | Hero 6:5 du produit/finition active | Produit à droite, haut gauche libre |
| Home mobile | Hero 4:5 correspondant | Produit bas/centre, haut libre |
| Stage `LA PREMIÈRE ÉDITION` | 16:10 correspondant | Produit légèrement à droite, bas gauche calme |
| Bande `Living With Open Form` | 4:5 usage | Produit complet, aucun texte dans l'image |
| PDP média principal | Packshot 1:1 ou contexte 4:3 | Centré, complet, espace respirant |
| PDP `Open view` | Vue traversante 3:4 | Trois-quarts arrière validé |
| PDP `Material` | Macro 1:1 | Texture et profondeur, pas un crop arbitraire |
| Panier et Stripe | Packshot 1:1 | Fond clair, aucun accessoire |
| Merchant Center | Packshot 1:1 | Variante exacte, produit seul, 75–90 % du cadre |
| Réseaux sociaux | Usage 4:5 | Sujet lisible sans texte incrusté |

## 21. Nommage des fichiers livrés

Utiliser la nouvelle marque dans tous les nouveaux noms :

```text
traversee-seuil-01-limestone-packshot-front-2048.png
traversee-seuil-01-limestone-storefront-desktop-2400x2000.png
traversee-seuil-01-limestone-storefront-mobile-1600x2000.png
traversee-horizon-02-smoked-sage-open-divider-1600x2000.png
traversee-aube-04-clay-rose-bedside-1600x2000.png
traversee-first-edition-limestone-material-macro-2048.png
```

Arborescence de remise recommandée :

```text
assets/traversee-visuals-source/products/
  elan-o1/
    packshots/
    heroes/
    open-back/
    usage/
  portee-o2/
    packshots/
    heroes/
    open-back/
    usage/
  veille-o4/
    packshots/
    heroes/
    open-back/
    usage/
  serie-o/
    material/
    campaign/
    projection-demo/
```

## 22. Export web

Conserver les masters en PNG haute qualité avec leur profil sRGB et leurs métadonnées. Générer ensuite :

| Type | Desktop | Mobile | Cible indicative |
|---|---:|---:|---:|
| Hero | WebP/AVIF 1600–2400 px | WebP/AVIF 960–1600 px | < 350 KB / < 220 KB si la qualité reste intacte |
| Usage | WebP/AVIF 1200–1600 px | WebP/AVIF 800–1200 px | < 260 KB |
| Packshot | WebP 1500–2048 px | WebP 800–1200 px | < 300 KB |
| Miniature | WebP 400–600 px | identique | < 70 KB |

Le hero LCP doit rester présent dans le HTML initial, ne jamais être lazy-loadé et recevoir une priorité haute. Les autres images peuvent être chargées progressivement. Les versions mobile et desktop doivent être de vraies compositions dédiées, pas seulement la même source lourde servie partout.

## 23. Contrôle qualité image par image

Une image est refusée si un seul point géométrique échoue.

| Contrôle | ÉLAN | PORTÉE | VEILLE |
|---|---:|---:|---:|
| Nombre exact d'ouvertures | 8 | 8 | 2 |
| Produit complet | obligatoire | obligatoire | obligatoire |
| Socle en retrait | oui | oui | oui |
| Dos traversant | oui | oui | oui |
| Proportions identiques à la référence | oui | oui | oui |
| Aucun ajout fonctionnel | oui | oui | oui |

Contrôles communs :

- La couleur correspond à une seule finition.
- Le meuble ne fusionne pas avec le mur ou le sol.
- L'échelle est crédible par rapport au lit, aux portes, aux chaises et aux personnes.
- Les ombres indiquent un poids réel et un contact au sol.
- Les verticales sont droites.
- Aucun objet ne masque la lecture d'une ouverture.
- Aucun texte, logo, watermark ou bordure n'est inclus dans le fichier image.
- Le crop final reste exploitable dans le ratio prévu.
- Le visage ou le corps d'une personne, s'il existe, ne devient jamais le sujet principal.

## 24. Règles Merchant Center et transparence IA

Le packshot principal doit montrer clairement le produit exact et sa finition exacte, sans bordure, watermark, texte promotionnel ou mélange de variantes. Google recommande que le produit occupe 75 à 90 % de l'image, avec une image haute résolution; les images principales et additionnelles générées par IA doivent conserver les métadonnées IPTC indiquant une source algorithmique, notamment `DigitalSourceType=TrainedAlgorithmicMedia`.

Une image générée n'est pas utilisée comme preuve d'atelier, preuve artisanale, installation client, avis client ou photo presse. Ces contenus doivent être réels.

## 25. Sources techniques

- [OpenAI — Image generation](https://developers.openai.com/api/docs/guides/image-generation)
- [Google Merchant Center — Image link requirements](https://support.google.com/merchants/answer/6324350?hl=en)
- [web.dev — Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [web.dev — Responsive images](https://web.dev/articles/responsive-images)

## 26. Ordre concret de génération

1. Générer les trois packshots Chalk.
2. Corriger jusqu'à obtenir une géométrie parfaite.
3. Décliner chaque packshot en Butter, Sage et Plaster Rose par édition.
4. Générer les trois heroes desktop Chalk.
5. Corriger la composition et la géométrie avant toute variation.
6. Décliner les heroes desktop dans les trois autres finitions.
7. Adapter chaque hero accepté au mobile 4:5.
8. Générer les trois vues traversantes et les faire valider techniquement.
9. Générer la macro Chalk, puis les trois variations de couleur.
10. Produire les six scènes d'usage.
11. Produire les deux images de campagne Londres.
12. Construire les trois démonstrations avant/après à partir de vraies photos de pièce.
13. Photographier réellement l'atelier, les gestes et le premier produit fini.

Ce séquencement évite de produire trente images autour d'une géométrie ou d'une direction photographique qui n'aurait pas encore été validée.

## 27. Cahier de prise de vue atelier

Les prototypes génératifs d'atelier sont archivés et ne sont jamais servis par le site. Toute preuve de fabrication publiée doit provenir d'une prise de vue réelle avec les vraies personnes, les vrais outils et les pièces effectivement fabriquées.

| Visuel | Source master | Export web | Usage |
|---|---|---|---|
| SEUIL 01 finalisé à la main | Photographie réelle à produire | Archive documentaire | Preuve de fabrication |
| Geste sur l'arche | Photographie réelle à produire | Archive documentaire | Preuve de finition |
| Contrôle de HORIZON 02 | Photographie réelle à produire | Archive documentaire | Preuve dimensionnelle |
| Archive des quatre finitions | Photographie réelle à produire | Archive documentaire | Référence matière |

### 27.1 SEUIL 01 — atelier large

Référence jointe : packshot officiel SEUIL 01 Chalk.

Calibration finale : meuble de `102 × 184 × 42 cm`, artisan de référence de `180 cm`. Le sommet du meuble dépasse très légèrement la tête et sa profondeur reste lisible en trois-quarts. Le visage est traité en profil naturel, orienté vers le geste et visuellement secondaire.

```text
Use the calibrated SEUIL 01 workshop composition as the edit target and the
official V2040 packshot as immutable geometry. Preserve the complete cabinet,
its 102 × 184 × 42 cm proportions, eight openings, recessed base, open back,
side depth, camera and floor perspective. Keep the 180 cm craftsperson at the
approved scale so the cabinet top remains only slightly above his head. Refine
only the head, profile face, hair, neck and hands to premium documentary
realism: natural asymmetry, pores, beard stubble, individual hair, believable
fingers and contact. The person looks toward the cabinet, never at camera.
Quiet French design studio, Chalk finish, no beauty retouching, no CGI face,
no text, no logo, no scale change and no geometry drift.
```

### 27.2 Geste de finition — macro verticale

Référence jointe : macro officielle d'arche Chalk et packshot SEUIL 01.

```text
Create an ultra-realistic close documentary photograph of a craftsperson's
hands refining the rounded inner edge of the official V2040 open arch. Treat
the product reference as immutable geometry. Preserve the exact wall
thickness, radius, depth and matte mineral surface. One hand steadies the edge,
the other uses a small fine abrasive pad. Natural skin detail, believable
pressure and grip, subtle mineral dust, no manicure styling. Soft side daylight
from a real workshop window, shallow but controlled depth of field with the
edge remaining precise. Chalk warm off-white finish, vertical composition,
premium full-frame photography, no face, no logo, no text, no construction
change, no plastic appearance.
```

### 27.3 HORIZON 02 — contrôle géométrique

Référence jointe : packshot officiel HORIZON 02 Chalk.

Calibration finale : meuble de `184 × 102 × 42 cm`, artisan de référence de `180 cm`. Le meuble conserve une hauteur visuelle proche de `56,67 %` de la personne et une largeur proche de sa hauteur complète. Le visage est traité en trois-quarts naturel, orienté vers l’équerre.

```text
Use the calibrated HORIZON 02 workshop composition as the edit target and the
official V2040 packshot as immutable geometry. Preserve the complete cabinet,
its 184 × 102 × 42 cm proportions, eight openings, 80 mm rails and junctions, recessed base, open back,
side depth, camera and floor perspective. Keep the 180 cm craftsperson at the
approved scale so the product height remains exactly about two thirds of his
full height. Refine only the head, three-quarter face, hair, neck and hands to
premium documentary realism: natural asymmetry, pores, beard stubble,
individual hair and a believable grip on the metal square. The person looks
toward the measurement, never at camera. No beauty retouching, no CGI face,
no text, no logo, no scale change and no geometry drift.
```

### 27.4 Échantillons et stickers d'atelier

Références jointes : les quatre packshots officiels Chalk, Butter, Sage et Plaster Rose.

```text
Create an ultra-realistic overhead atelier photograph of four hand-finished
mineral sample tiles arranged on a warm neutral worktable. The four colours
must match the official references exactly: Chalk, Butter, Sage and Plaster
Rose. Each sample has a small unbranded off-white paper workshop sticker with a
simple coloured dot and blank writing lines; no readable brand name, no fake
certification and no serial claim. Include one natural hand comparing the Sage
sample with a caliper and one restrained pencil. Preserve visible matte
micro-texture, softly rounded sample edges, slight dust and credible shadows.
Soft window daylight, premium material-library photography, landscape format,
no logo, no promotional graphic, no extra colour, no glossy plastic finish.
```

Lorsque la production réelle commence, reproduire ces quatre compositions avec le véritable atelier, les vrais gestes, les vrais outils et les vraies personnes. Les fichiers documentaires remplacent alors les visualisations sans modifier la structure du site.

Les masters `v1` restent archivés à côté des `v2`, mais ne sont plus servis par le site.
