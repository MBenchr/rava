# ISANDRE / ṬĀQA — Cahier de production des six images atelier

Version : `2026.08.02-production-2`  
Statut : protocole interne de génération et de contrôle

## 1. Décision de production

Les variantes atelier récemment agrandies sont abandonnées. Les images de base
sont conservées sur le site jusqu'à ce que les six nouveaux masters aient passé
le contrôle géométrique et photographique défini ici.

Les six images sont créées **de zéro**. Aucune image atelier générée auparavant
ne doit être utilisée comme référence de forme, comme calque produit ou comme
base à retoucher. Elle peut uniquement servir à comprendre un cadrage.

La hiérarchie des références est non négociable :

1. le packshot canonique fixe la silhouette et les ouvertures ;
2. la planche cotée fixe la taille et la profondeur ;
3. la vue arrière ou trois-quarts prouve la structure traversante ;
4. la photographie d'atelier fixe uniquement le réalisme documentaire ;
5. le texte du prompt ne peut jamais contredire les trois premières entrées.

Si le générateur ne respecte pas cette hiérarchie, l'image est rejetée. Elle
n'est ni corrigée par déformation locale, ni publiée comme approximation.

## 2. Géométrie immuable

Source métrique : `docs/industrial/taqa-canonical-geometry.md`.

| Pièce | Dimensions finies | Rapport frontal | Ouvertures | Organisation frontale |
|---|---:|---:|---:|---|
| SEUIL 01 | `1020 L × 1840 H × 420 P mm` | `0,55435` | 8 | quatre verticales à gauche ; une grande arche puis trois horizontales à droite |
| PORTÉE 02 | `1840 L × 1020 H × 420 P mm` | `1,80392` | 8 | trois petites à gauche ; arche centrale ; deux horizontales à droite ; deux horizontales basses |
| VEILLE 03 | `383 L × 620 H × 420 P mm` | `0,61774` | 2 | arche supérieure centrée ; niche horizontale inférieure centrée |

Règles communes :

- coque monobloc creuse, sans panneau arrière ;
- profondeur finie constante de `420 mm` ;
- rayon extérieur nominal `52 mm` ;
- paroi visuelle de référence `80 mm` ;
- rayons intérieurs continus `55–70 mm`, sauf arche cotée ;
- socle continu en retrait ;
- aucune tablette, jambe, panneau, niche ou ouverture rapportée ;
- la vue arrière est le miroir logique de la vue avant, jamais une autre pièce ;
- la finition change la couleur et le rendu optique, jamais la géométrie.

### Échelle humaine obligatoire

| Pièce | Repère humain sur le même plan | Relation visible correcte |
|---|---|---|
| SEUIL 01 | adulte mesuré `1800 mm` | le corps du meuble dépasse la tête de `40 mm` ; sur un chariot de `100 mm`, son sommet est `140 mm` plus haut |
| PORTÉE 02 | adulte mesuré `1800 mm` | le dessus à `1020 mm` arrive autour de la taille ou du bas du thorax |
| VEILLE 03 | adulte mesuré `1800 mm` | le dessus à `620 mm` arrive sous la hanche ; sur un établi de `850 mm`, le sommet atteint `1470 mm` |

La perspective ne doit jamais servir à simuler une taille plus grande. Le
produit, les pieds de l'opérateur et le repère métrique doivent appartenir au
même plan de sol. Un produit vu au premier plan devant un opérateur éloigné ne
constitue pas une preuve d'échelle.

## 3. Références à joindre à chaque génération

### Références produit

| Pièce | Image 1 — identité prioritaire | Image 2 — profondeur / arrière | Image 3 — planche cotée |
|---|---|---|---|
| SEUIL 01 | `media/a7-sources/seuil-01/p01/chalk.png` | `media/a7-sources/seuil-01/p02/chalk.png` | `media/a7-sources/seuil-01/p03/chalk.png` |
| PORTÉE 02 | `media/a7-sources/portee-02/p01/chalk.png` | `media/a7-sources/portee-02/p02/chalk.png` | `media/a7-sources/portee-02/p03/chalk.png` |
| VEILLE 03 | `media/a7-sources/veille-03/p01/chalk.png` | `media/a7-sources/veille-03/p02/chalk.png` | `media/a7-sources/veille-03/p03/chalk.png` |

Pour SEUIL et PORTÉE, la planche d'identité du kit de projection peut remplacer
les Images 2 et 3 :

- `public/projection-kits/seuil-01/2026.07.27-1/identity-board.png` ;
- `public/projection-kits/portee-02/2026.07.27-1/identity-board.png`.

### Références atelier réelles

Ces captures déterminent seulement l'ambiance documentaire, l'usure des
machines, la position des opérateurs, les gestes et la lumière. Elles ne
déterminent jamais la pièce ni le moule.

| Usage | Référence locale |
|---|---|
| cabine et opérateur secondaire | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.27.03.png` |
| moule industriel usé, gestes non posés | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.28.14.png` |
| chargement manuel du moule | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.28.50.png` et `00.28.58.png` |
| levage et ouverture du moule | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.29.21.png` et `00.30.37.png` |
| séparation réelle des deux demi-moules | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.30.24.png` |
| finition manuelle rapprochée | `/Users/mohyi/Desktop/Capture d’écran 2026-07-30 à 00.32.02.png` et `00.32.30.png` |

Ne pas copier les personnes, logos, uniformes ou machines reconnaissables. Les
opérateurs générés sont fictifs et les marques restent absentes.

## 4. Contrat photographique commun

### Atelier

- véritable atelier européen de rotomoulage utilisé, entretenu mais non décoré ;
- châssis acier rayés, moules aluminium ternis, brides, boulons, palan, tuyaux,
  traces de poudre et marques de chaussures cohérentes ;
- aucune fausse menuiserie, forge, sellerie ou cabine de peinture automobile ;
- salissures localisées et fonctionnelles, jamais un décor de ruine ;
- gestes pris sur le vif, aucun opérateur regardant la caméra ;
- visages petits, partiellement tournés ou hors champ ; anatomie exacte ;
- EPI cohérents : gants de manutention, chaussures de sécurité, lunettes ou
  protection respiratoire seulement lorsque l'étape le justifie.

### Lumière et appareil

- lumière mixte crédible : fenêtres industrielles + tubes neutres `4000–5000 K` ;
- hautes lumières légèrement imparfaites, ombres ouvertes, contraste modéré ;
- photographie plein format documentaire, couleur naturelle, grain fin ;
- pas de lumière publicitaire, rim light, brouillard, flare ou profondeur de
  champ artificiellement extrême ;
- plans larges : équivalent `50–70 mm`, appareil éloigné pour limiter la fuite ;
- preuve d'échelle : équivalent `70–85 mm`, axe quasi frontal, lacet `8–15°` ;
- détails : équivalent `85–105 mm`, profondeur de champ suffisante pour lire le
  geste et la surface ;
- verticales parallèles, horizon de niveau, aucune optique ultra grand-angle.

### Matière produit

- LLDPE teinté dans la masse, presque lisse ;
- satin bas peau d'œuf, cible visuelle `8–15 GU à 60°` ;
- microstructure extrêmement fine `30–50 µm`, visible seulement en lumière
  rasante ;
- longs reflets doux sur les rayons, aucune arête brillante ;
- ni béton poreux, ni pierre, ni terrazzo, ni mousse, ni fibre, ni plastique
  brillant, ni image de synthèse parfaitement lisse.

### Moule négatif

Le moule ne ressemble pas à une copie pleine du meuble. Quand une demi-coquille
est ouverte, elle montre :

- une cavité correspondant exactement au périmètre extérieur ;
- des **noyaux pleins en relief** à l'emplacement exact de chaque ouverture du
  produit fini ;
- le retour de profondeur et le négatif du socle ;
- une seconde demi-coquille complémentaire, brides et châssis réalistes ;
- aucun trou générique circulaire ou rectangulaire sans lien avec la pièce.

## 5. Matrice des six images

| ID | Pièce | Scène | Finition | Format master | Usage principal |
|---|---|---|---|---|---|
| W01 | SEUIL 01 | préparation du moule négatif | Chalk | `3:2` paysage | page Making, chapitre forme |
| W02 | PORTÉE 02 | démoulage | Chalk | `3:2` paysage | hero Making |
| W03 | SEUIL 01 | contrôle géométrique | Rose Clay | `4:5` portrait | preuve d'échelle et finition |
| W05 | VEILLE 03 | sortie du moule | Chalk | `3:2` paysage | preuve de fabrication compacte |
| W06 | VEILLE 03 | finition manuelle | Butter | `4:5` portrait | détail geste / matière |
| W07 | PORTÉE 02 | reprise des ouvertures | Sage | `3:2` paysage | détail géométrie / matière |

## 6. Prompts définitifs

Chaque prompt est lancé séparément. Les images doivent être jointes dans
l'ordre indiqué. Ne jamais joindre une précédente génération atelier comme
Image 1, 2 ou 3.

### W01 — SEUIL 01, préparation du moule négatif

Entrées : Images 1–3 SEUIL du tableau produit, puis la capture `00.28.14` comme
Image 4 de style documentaire.

```text
Use case: photorealistic-natural.
Asset: documentary manufacturing photograph, W01, 3:2 landscape.

IMAGE 1 is the immutable front identity of SEUIL 01. IMAGE 2 is its immutable
rear/depth identity. IMAGE 3 is the dimensional authority. IMAGE 4 provides
only the candid workshop atmosphere and worn industrial realism. Never borrow
product geometry from IMAGE 4.

Create a completely new photograph inside a real, used but maintained European
rotational-moulding workshop. Show the preparation of the open negative mould
for SEUIL 01. The finished object represented by this mould is exactly 1020 mm
wide, 1840 mm high and 420 mm deep. It has exactly eight through-openings in
this front order: four vertically stacked rounded openings on the left; on the
right, one large upper arch and three rounded horizontal openings below it.
The shell has 80 mm visual members, 52 mm outer radii and a continuous recessed
base. No back panel.

The mould must be the engineering inverse, not a duplicate of the finished
object: one open aluminium half contains a recessed outer cavity and eight
solid raised core islands at the exact opening positions; the complementary
half, steel carrier, clamps and lifting points are visible. Its overall scale
must correspond to a 1840 mm finished product. Place a calibrated 2 m workshop
rule upright on the same floor plane. One fictional technician about 1800 mm
tall, seen mostly from the back and not enlarged by foreground perspective,
cleans one mould core using compressed air and a lint-free cloth. The top of
the finished-product cavity aligns only 40 mm above the technician's head when
both are referenced to the same floor.

Use a full-frame documentary camera, 65 mm equivalent lens, camera height
1350 mm, level horizon, nearly frontal view with 10 degrees of yaw. Keep the
entire mould, base, technician's shoes and scale reference visible. Mixed cool
fluorescent and window daylight, restrained colour, ordinary industrial wear,
powder residue, scratched steel and dull aluminium. Nothing staged or glossy.

Reject: product-shaped holes in the mould instead of raised negative cores,
closed openings, extra or missing opening, wrong order, warped ratio, exaggerated
depth, wide-angle distortion, clean showroom factory, cinematic light, CGI,
plastic shine, readable branding, text, watermark, fake certificate, deformed
hands or impossible machinery.
```

### W02 — PORTÉE 02, démoulage réel

Entrées : Images 1–3 PORTÉE, puis les captures `00.30.24` et `00.30.37` comme
Images 4–5 de procédé et de lumière.

```text
Use case: photorealistic-natural.
Asset: documentary manufacturing photograph, W02, 3:2 landscape.

IMAGE 1 is the immutable front identity of PORTÉE 02. IMAGE 2 proves its exact
420 mm depth and open back. IMAGE 3 fixes 1840 mm width and 1020 mm height.
IMAGES 4 and 5 define only the candid demoulding action, worn machinery and
unpolished documentary tone.

Create a new, single coherent photograph of PORTÉE 02 being released from its
two-part aluminium rotational mould in a real working factory. Preserve the
complete finished object exactly: 1840 W × 1020 H × 420 D mm, monobloc hollow
shell, continuous recessed base and exactly eight through-openings. Front view:
three small rounded openings stacked on the left; one large central arch; two
rounded horizontal openings on the upper and middle right; one low horizontal
opening below the arch and one at the lower right. Preserve substantial 80 mm
members. Do not mirror the front-facing product and do not invent a back.

The lower mould half carries the negative cavity and matching solid cores. The
upper half is lifted by a chain hoist. The fully formed Chalk piece is separated
from the cavity on padded slings, still close enough to explain the process.
Two fictional technicians stand on the same floor plane as the piece. Their
bodies and the 1020 mm product height must agree: the top reaches approximately
the waist or lower torso of an 1800 mm adult, never the chest or shoulder. Sling
tension, hand positions, gloves and contact points must be physically credible.

Use a full-frame 60 mm equivalent lens, camera 1250 mm high, at least 6 m from
the object, horizon level, 12-degree front-right angle. The complete 1840 mm
width, 420 mm return, base, technicians' feet and both mould halves remain in
frame. Use existing fluorescent light mixed with pale daylight, slightly worn
paint, oxidised fixture edges and practical factory clutter. Surface is low-
sheen mass-coloured LLDPE with soft long highlights, not a render.

Reject: generic circular mould, sofa-like mould, solid back, nine openings,
thin members, changed arch, product taller than a person, product only 10 cm
deep, forced perspective, floating slings, clean staged studio, cinematic haze,
CGI, readable logo, text, watermark, malformed anatomy.
```

### W03 — SEUIL 01, contrôle à l'échelle

Entrées : Images 1–3 SEUIL, puis la capture `00.27.03` comme Image 4 de lumière
industrielle. La composition actuelle de W03 peut être observée mais ne doit pas
être jointe comme référence produit.

```text
Use case: photorealistic-natural.
Asset: documentary quality-control photograph, W03, portrait master with safe
4:5 crop.

IMAGE 1 fixes the exact front of SEUIL 01. IMAGE 2 fixes its open back and
420 mm depth. IMAGE 3 is the metric authority. IMAGE 4 contributes only the
ordinary industrial lighting and candid operator treatment.

Create a completely new photograph in a used inspection bay after demoulding.
SEUIL 01 must remain exactly 1020 W × 1840 H × 420 D mm and show all eight
through-openings in the approved front order: four vertical openings on the
left; large upper arch and three horizontal openings on the right. Preserve
80 mm members, continuous radii and the recessed base. Use the Rose Clay finish,
mass-coloured low-sheen LLDPE with an almost smooth eggshell surface.

Place the complete product upright on a low industrial dolly exactly 100 mm
high. A fictional technician exactly 1800 mm tall stands immediately beside it
on the same floor plane, slightly behind the front face by no more than 100 mm.
The product body is 40 mm taller than the technician; because of the dolly, the
visible top is exactly 140 mm above the technician's head. Do not change the
person's size. Show both shoes, all dolly wheels and the product base so the
comparison cannot be faked. The technician uses a contour gauge and a narrow
raking inspection lamp on one inner radius; face turned away and secondary.

Use an 85 mm equivalent lens from a long working distance, camera height
1350 mm, level verticals, only 8 degrees of front-right yaw. This restrained
angle must reveal the real 420 mm right return without making the near side
thicker than the far side. Keep the complete product inside the 4:5 crop with
8 percent breathing room above and below. Workshop background is imperfect and
credible: worn concrete, scuffed trolley, practical shelving, soft daylight and
neutral fluorescent light. Natural skin, hands and workwear.

Reject: arbitrary 10–30 percent enlargement, smaller person, unequal side
thickness, trapezoidal body, missing opening, wrong arch, closed back, excessive
depth, glossy surface, concrete texture, showroom styling, CGI, composite edge,
text, logo, watermark or false inspection mark.
```

### W05 — VEILLE 03, sortie du moule

Entrées : Images 1–3 VEILLE, puis les captures `00.28.50` et `00.30.24` comme
Images 4–5 de procédé.

```text
Use case: photorealistic-natural.
Asset: documentary manufacturing photograph, W05, 3:2 landscape.

IMAGE 1 defines the immutable front of VEILLE 03. IMAGE 2 defines its exact
depth and open back. IMAGE 3 fixes the exterior proportions. IMAGES 4 and 5
provide only the real mould-handling action, workshop wear and lighting.

Create a new photograph of VEILLE 03 immediately after opening its dedicated
rotational mould. The finished product is exactly 383 mm wide, 620 mm high and
420 mm deep. It is a compact hollow monobloc with exactly two through-openings:
one centred upper arch 223 × 270 mm and one centred lower rounded horizontal
opening 223 × 120 mm. Preserve the 80 mm side members, 52 mm outside radius,
continuous recessed base and open back. No third niche and no shelf insert.

Show an exact inverse mould: the open aluminium half has one large solid raised
arch core and one lower solid horizontal core at the approved locations, plus
the negative outer cavity and base return. The complementary half sits beside
it on a worn steel carrier. A fictional operator, cropped from shoulders to
boots, releases the complete Chalk piece using padded gloves and a simple
lifting strap. The operator and product stand on the same floor or platform
plane. The 620 mm product height must read below the operator's hip. If placed
on an 850 mm inspection bench, its top must read at 1470 mm from the floor.

Use a 70 mm equivalent lens, camera height 1050 mm, level horizon and 12-degree
front-left view. Keep the entire product, both openings, 420 mm return, mould
cores, operator contact and support surface visible. Real mixed workshop light,
dull mould metal, powder traces, old bench paint and practical tools. Product
surface remains almost smooth, low sheen and physically grounded.

Reject: bedside table larger than a person, generic box mould, mould with holes
instead of solid inverse cores, wrong golden-ratio silhouette, closed back,
extra niche, narrow depth, distorted arch, floating object, over-clean factory,
glossy toy plastic, CGI, text, brand, watermark or malformed hands.
```

### W06 — VEILLE 03, finition manuelle

Entrées : Images 1–3 VEILLE, puis les captures `00.32.02` et `00.32.30` comme
Images 4–5 de geste et de cadrage.

```text
Use case: photorealistic-natural.
Asset: close documentary finishing photograph, W06, portrait master with safe
4:5 crop.

IMAGE 1 is the immutable front geometry of VEILLE 03. IMAGE 2 fixes the open
back and 420 mm depth. IMAGE 3 fixes 383 × 620 mm frontal proportions. IMAGES 4
and 5 define only the authentic close working gesture and non-staged factory
photography.

Create a completely new photograph of a fictional craftsperson hand-finishing
VEILLE 03 in Butter after demoulding. The complete object remains recognisable
and metrically correct: 383 W × 620 H × 420 D mm, exactly one upper arch and one
lower horizontal through-opening, equal 80 mm side members, continuous radii,
open back and recessed base. Do not turn the object into a stool or solid night
table.

Set VEILLE on an old 850 mm-high steel-and-hardwood inspection bench. Its 620 mm
body therefore reaches 1470 mm from the floor. Frame the operator from upper
torso to hands, with the face mostly outside the image. One gloved hand steadies
the body; the other uses a fine abrasive pad along the inner lower edge of the
upper arch. Show a small vacuum hose, pale LLDPE dust, two used sanding pads and
a caliper lying naturally on the bench. The action must be anatomically and
mechanically plausible. No sparks, paint spray or woodworking shavings.

Use a full-frame 95 mm equivalent lens, camera height 1200 mm, three-quarter
front-right view no greater than 15 degrees. Focus on hand, arch radius and long
soft material reflection while keeping the lower opening and one vertical
product edge visible. Preserve enough depth of field to prove the product is
not a composited insert. Butter is warm pale yellow, restrained and mass-
coloured, with fine eggshell satin rather than lacquer.

Reject: changed opening shape, extra shelf, cropped-away identity, exaggerated
rounding, glossy plastic, foam texture, stone texture, impossible sanding tool,
perfect staged bench, dramatic ad lighting, CGI, pasted edges, readable logo,
text, watermark, extra fingers or distorted hands.
```

### W07 — PORTÉE 02, reprise des ouvertures

Entrées : Images 1–3 PORTÉE, puis la capture `00.32.30` comme Image 4 de geste
rapproché et `00.28.14` comme Image 5 d'atelier.

```text
Use case: photorealistic-natural.
Asset: documentary finishing photograph, W07, 3:2 landscape.

IMAGE 1 fixes the exact front geometry of PORTÉE 02. IMAGE 2 fixes its 420 mm
depth and open back. IMAGE 3 fixes all exterior dimensions. IMAGES 4 and 5
provide only the candid hand-finishing language and real workshop condition.

Create a new photograph of PORTÉE 02 in Sage during final opening refinement.
The complete piece must remain exactly 1840 W × 1020 H × 420 D mm, with exactly
eight through-openings in the approved front order: three stacked small left
openings, one large central arch, two rounded horizontal right openings, one
low opening beneath the arch and one low-right opening. Preserve substantial
80 mm members, continuous base, exact arch and open back. Do not mirror the
front-facing product.

Place the piece upright on a low padded support only 80 mm above the workshop
floor, not on a high table. Two fictional operators share the task: one body is
partially visible behind the open arch using a contour pad; only the second
operator's forearms and gloved hands enter from the right to vacuum the edge.
Both people remain secondary. Include a 1 m folding rule leaning on the same
support plane. The 1020 mm product body must read at adult waist/lower-torso
height, and its full 1840 mm width must be unobstructed.

Use a 75 mm equivalent lens from at least 6 m, camera height 1250 mm, level
horizon and nearly frontal 10-degree angle. Keep the full product, base, both
outer sides and a readable portion of the 420 mm return. Sage is muted grey-
green, low-sheen and almost smooth. Use ordinary mixed daylight and fluorescent
light, scuffed concrete, used steel stands, real dust extraction and restrained
factory clutter. Documentary, not theatrical.

Reject: thin web members, altered niche count, closed openings, shallow object,
oversized right side, compressed far side, fisheye, hidden base, product at
chest height, decorative objects in niches, pristine showroom, cinematic grade,
CGI, collage seam, text, logo, watermark, malformed people or tools.
```

## 7. Sorties techniques

- produire un master par image, sans texte incrusté ;
- format de génération recommandé : `1536 × 1024` pour les paysages et
  `1024 × 1536` pour les portraits ;
- conserver une zone sûre permettant le recadrage final `4:5` des portraits ;
- si une production externe est utilisée, livrer au minimum `3200 px` sur le
  grand côté en PNG ou TIFF sRGB, sans interpolation artificielle ;
- ne jamais agrandir une sortie basse définition pour masquer un défaut ;
- nommer les masters exactement comme les sources du pipeline :
  `w01-seuil-mould-preparation.png`, `w02-portee-demoulding.png`,
  `w03-seuil-quality-control.png`, `w05-veille-demoulding.png`,
  `w06-veille-hand-finishing.png`, `w07-portee-opening-finish.png` ;
- les WebP, AVIF, JPEG mobile et miniatures sont produits ensuite par
  `npm run media:preproduction` ;
- conserver les métadonnées d'origine IA dans les dérivés.

## 8. Contrôle et rejet

| Porte | Mesure | Rejet immédiat |
|---|---|---|
| silhouette | rapport frontal à `±1 %` | corps trop haut, trop large ou trapézoïdal |
| ouvertures | `8 / 8 / 2`, ordre exact | ouverture ajoutée, absente, déplacée ou fermée |
| profondeur | `420 mm`, perspective cohérente | côté droit exagéré, côté opposé aminci, profondeur variable |
| échelle | repère et humain sur le même plan | personne redimensionnée ou produit avancé vers la caméra |
| moule | négatif exact avec noyaux pleins | moule générique ou copie positive du meuble |
| matière | LLDPE satin bas presque lisse | plastique brillant, béton, mousse, pierre ou rendu 3D |
| procédé | outil, EPI et geste plausibles | machine, traction, main ou posture impossible |
| photographie | documentaire naturelle | lumière publicitaire, usine trop parfaite, collage visible |

Chaque image est contrôlée à `100 %` puis en miniature. Une image qui semble
correcte seulement de loin est rejetée. Une image qui respecte l'ambiance mais
pas la géométrie est rejetée. Une image qui respecte la géométrie mais ressemble
à un rendu 3D est rejetée.

## 9. Ordre de production

1. produire W03 pour valider définitivement SEUIL et l'échelle humaine ;
2. produire W02 pour valider PORTÉE et le moule négatif ;
3. produire W05 pour valider VEILLE et ses deux noyaux ;
4. produire W01 après validation du langage de moule ;
5. produire W06 après validation de la matière Butter ;
6. produire W07 après validation de la matière Sage ;
7. intégrer uniquement les six masters acceptés en un seul lot ;
8. reconstruire les dérivés et exécuter le contrôle du registre média.

Ce protocole ne transforme pas une génération probabiliste en plan industriel.
Il garantit en revanche qu'une image géométriquement ou photographiquement
fausse ne remplace pas les images de base sur la boutique.
