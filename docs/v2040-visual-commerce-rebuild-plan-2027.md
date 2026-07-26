# V2040 — Plan directeur 2027 pour la marque, les images, la boutique et le simulateur

## 0. Statut du document

Ce document est le plan de décision avant exécution. Il ne valide encore ni un nom
de marque, ni une image générée, ni une promesse d'origine. Il remplace la méthode
consistant à demander à un générateur d'images de « conserver exactement » un
meuble à partir d'une seule photographie.

La règle fondatrice est désormais :

> **Le produit est une donnée 3D contrôlée. La photographie raconte sa vie. L'IA
> harmonise la scène, mais ne redessine jamais le meuble.**

Les 49 images de `assets/rava-v2040-source/` restent des références d'intention et
de silhouette. Elles ne sont plus considérées comme des masters suffisamment
fiables pour produire toutes les campagnes.

---

## 1. Diagnostic

### Ce qui existe et reste utile

- Deux géométries métriques approuvées :
  - produit vertical : `1020 × 1840 × 420 mm`, 8 ouvertures ;
  - produit horizontal : `1840 × 1020 × 420 mm`, 8 ouvertures.
- Les prix, finitions, panier, Stripe, variantes, version anglaise/française et
  logique de projection déjà présents dans l'application.
- Quarante-neuf visuels V2040 uniques qui documentent l'intention formelle.
- Des manifests de projection et des silhouettes vectorielles.

### Ce qui ne peut pas être conservé comme méthode

- Une image V2040 unique utilisée comme « géométrie immuable » dans un prompt.
- Des objets décoratifs ajoutés après coup dans les niches.
- Des changements de couleur générés indépendamment les uns des autres.
- Des scènes répétées dans la même gamme beige, avec la même lumière et le même
  sentiment de rendu 3D.
- Des portraits d'artisans, ateliers, clients ou presse fabriqués par IA.
- Une image de désir utilisée aussi comme packshot, preuve d'échelle et vue
  technique.

### Blocage critique

Le petit meuble de chevet ne possède pas encore de dimensions et d'implantation
d'ouvertures validées. Aucun master final, packshot Merchant Center, rendu AR ou
projection « exacte » ne doit être produit pour lui avant validation de son
manifeste fabricant.

---

## 2. Synthèse du benchmark

| Référence | Ce qu'il faut reprendre | Ce qu'il faut éviter |
|---|---|---|
| Apple | Choix de finition immédiatement visible, prix et achat dans le premier écran | Copier son minimalisme au point de rendre le meuble abstrait |
| Dyson | Démonstration fonctionnelle et bénéfice concret à proximité du CTA | Accumuler des arguments techniques |
| Sonos | Produit, ambiance et contrôle de variante dans une même séquence | Une page sombre par défaut sans lien avec l'objet |
| RIMOWA | Silhouette iconique, provenance, détail matière, prix assumé | Inventer un héritage |
| Herman Miller | Histoire courte, dimensions, authenticité, ressources 3D | Transformer la page en musée |
| DWR | Variantes, délai, quantité, retours et assistance près de l'achat | Surcharger le premier écran |
| USM | Vues de tous les côtés, usages de séparation, configurateur | Faire paraître le produit modulaire s'il ne l'est pas |
| Muuto | Téléchargements 2D/3D, AR, famille produit, matière concise | Multiplier les textes de collection |
| Audo | Une phrase de concept, galerie forte, fiche technique directe | Rendre le prix secondaire |
| Minotti | Mise en scène architecturale, lumière et profondeur de champ crédibles | Images sans échelle humaine |
| Vitra | Configuration, designer, CAD et images de communauté | Afficher une communauté inexistante |
| Cassina | Origine du dessin et continuité culturelle | Créer une fausse histoire ancienne |
| IKEA Kreativ | Scan de pièce, placement à l'échelle, achat après visualisation | Laisser l'IA choisir seule l'échelle |
| Threekit | Modèles, matériaux et règles séparés, AR configurable | Recalculer les variantes dans l'interface |
| Cylindo | Un master visuel réutilisé sur tous les canaux | Générer chaque canal depuis zéro |
| Roomvo | Upload simple, pièce dans la photo, passage rapide au produit | Montrer un résultat imprécis comme une preuve |
| Google Shopping | Packshot fidèle + lifestyle séparé + variante adressable | Utiliser une scène lifestyle comme seule image produit |
| TikTok | Vertical, humain, émotion rapide, avant/après et tests de hooks | Publicité trop polie ou manifestement générée |
| Baymard | Images à l'échelle, coût total, retours et choix visibles | Cacher les options dans des menus |
| OpenAI Image | Références multiples indexées, edits, haute fidélité, itérations courtes | Promettre une cohérence ou un placement parfait par prompt |

Baymard rapporte que 42 % des utilisateurs de ses tests essaient d'estimer la
taille depuis les images : une vue à l'échelle est donc obligatoire. Google
recommande de regrouper les variantes avec `ProductGroup`, des URLs distinctes,
et des images/prix/disponibilités propres. TikTok recommande un contenu vertical,
mobile-first, humain, qui montre rapidement un moment réel, le produit, puis la
transformation.

---

## 3. Décision de marque

### Recommandation créative

Le nom de travail recommandé est **VIAIRE**.

- Il évoque les voies, les passages et la circulation dans l'architecture.
- Il est français sans être une expression longue.
- Sa prononciation internationale peut être stabilisée comme `vee-air`.
- Il permet de parler d'espace sans appeler le meuble une sculpture.
- Il ne doit être implémenté qu'après recherche formelle EUIPO, INPI, UKIPO,
  USPTO, domaines et réseaux sociaux en classes 20 et 35.

`TRAVERSÉE` n'est pas retenu comme recommandation finale : le terme est déjà très
présent dans l'univers décoration, textile et accessoires. `FORME OUVERTE` reste
un bon concept éditorial, mais un nom trop descriptif pour constituer seul un
actif distinctif.

### Architecture de gamme

| Niveau | Nom recommandé | Usage |
|---|---|---|
| Maison | `VIAIRE` | Marque |
| Collection | `OUVERTURES 01` | Première famille |
| Vertical | `SEUIL` | `Open Tall Cabinet` |
| Horizontal | `PORTÉE` | `Open Low Cabinet` |
| Chevet | `VEILLE` | `Open Bedside Table` |
| SKU interne | `VIA-S01`, `VIA-P02`, `VIA-V04` | Logistique, invisible dans le récit |

Les numéros ne figurent pas dans le nom affiché. Ils restent dans les SKU et les
documents techniques.

### Finitions de lancement

| Anglais principal | Français | Rôle émotionnel |
|---|---|---|
| `Chalk` | `Craie` | calme, lumière, architecture |
| `Butter` | `Beurre` | énergie, jeunesse, matin |
| `Sage` | `Sauge` | nature, profondeur, équilibre |
| `Rose Clay` | `Argile rose` | intimité, culture, soir |

`Limestone` est abandonné comme nom commercial si la matière n'est pas réellement
de la pierre. Une cinquième couleur forte ne sera ajoutée qu'après création d'un
échantillon physique et test de désir ; recommandation exploratoire : `Cobalt`.

### Signature

Anglais :

```text
Nothing closes the room.
Open furniture, made to order in France.
```

Français :

```text
Rien ne ferme la pièce.
Des meubles ouverts, fabriqués sur commande en France.
```

Campagne internationale honnête :

```text
Born in France. Now opening London.
```

Le site ne dira jamais « a French success », « sold out », « waiting list »,
« press favourite » ou « best seller » avant de disposer de preuves réelles.

---

## 4. Histoire de marque

Le récit ne parle pas d'abord de rangement. Il part d'une tension familière :
meubler une pièce signifie souvent couper la lumière, la vue et la circulation.

### Structure narrative

1. **The room continues.**  
   Le premier contact montre une pièce complète traversée par la lumière.
2. **Made to hold, designed to let go.**  
   Le meuble accueille livres et objets sans devenir un mur.
3. **Four moods, one exact form.**  
   Chaque finition change la vie autour du meuble, jamais sa géométrie.
4. **See the real scale.**  
   Vues frontale, latérale, arrière, dimensions et présence humaine.
5. **Bring it into your room.**  
   AR ou projection exacte, puis achat direct.
6. **Made for your order.**  
   Délai, livraison, retours, paiement et contact clairement expliqués.

### Ton

- Phrases courtes, concrètes, sensorielles.
- Aucun paragraphe visible de plus de 45 mots.
- Aucun texte décrivant l'interface.
- Aucun vocabulaire de chantier, de béton ou de « luxe » autoproclamé.
- La valeur est montrée par l'échelle, la lumière, la matière et le service.

---

## 5. Les 22 leviers d'influence autorisés

1. **Primauté visuelle** : le meuble est compris avant que le texte soit lu.
2. **Fluidité cognitive** : un seul produit et une seule décision à la fois.
3. **Distinctivité** : l'arche et les ouvertures deviennent des codes récurrents.
4. **Simulation mentale** : scènes de seuil, séparation, salon et chevet.
5. **Effet de possession** : configuration sauvegardable sans compte.
6. **Échelle perceptible** : humain ou objet étalon dans une photo dédiée.
7. **Réduction du choix** : quatre finitions, sans catalogue infini.
8. **Bon défaut** : `Chalk` présélectionné, modifiable immédiatement.
9. **Transparence du prix** : prix complet et évolution selon finition.
10. **Réduction de l'incertitude** : dimensions, profondeur et vue arrière.
11. **Réversibilité** : retours et annulation expliqués près du CTA.
12. **Provenance** : France uniquement avec preuve réelle.
13. **Matérialité** : macro, toucher visuel, lumière rasante.
14. **Cohérence répétée** : mêmes cadrages canoniques sur site, Google et social.
15. **Contraste** : forme ouverte comparée visuellement à une masse fermée, sans
    dénigrer un concurrent.
16. **Ancrage d'usage** : chaque produit associé à un moment de vie précis.
17. **Preuve sociale réelle** : installations clients vérifiées, jamais générées.
18. **Autorité réelle** : presse, architectes et designers seulement après accord.
19. **Engagement progressif** : voir, choisir, sauvegarder, projeter, acheter.
20. **Proximité du service** : livraison, délai et contact dans le buy panel.
21. **Pic émotionnel** : reveal pleine page au changement de finition.
22. **Fin rassurante** : récapitulatif exact et paiement hébergé Stripe.

Les dark patterns, la rareté artificielle, les faux compteurs, faux avis, faux
ateliers et faux clients sont interdits.

---

## 6. Vérité produit et chaîne de production

### 6.1 Product Reference Kit

Chaque produit reçoit un kit versionné :

```text
product.json
geometry.json
master.glb
master.usdz
front-orthographic.png
front-right-30.png
rear-left-30.png
silhouette-mask.png
depth.exr
identity-board.png
materials/chalk/
materials/butter/
materials/sage/
materials/rose-clay/
checksums.json
approval.json
```

### 6.2 Géométries verrouillées

**SEUIL**

- 1020 mm de large, 1840 mm de haut, 420 mm de profondeur.
- 8 ouvertures.
- Colonne gauche : 4 ouvertures arrondies identiques.
- Zone droite : 1 grande arche haute, 2 niches horizontales, 1 grande niche basse.
- Socle en retrait, dos entièrement ouvert, épaisseur constante.

**PORTÉE**

- 1840 mm de large, 1020 mm de haut, 420 mm de profondeur.
- 8 ouvertures.
- Colonne gauche : 3 ouvertures arrondies.
- Centre : 1 arche et 1 grande ouverture basse.
- Droite : 2 niches horizontales et 1 grande niche basse.
- Socle en retrait, dos entièrement ouvert, épaisseur constante.

**VEILLE**

- Production bloquée jusqu'à validation de largeur, hauteur, profondeur, rayon,
  socle et coordonnées des deux ouvertures.

Les coordonnées millimétriques détaillées déjà présentes dans le manifeste
restent la vérité du renderer. Le texte du prompt n'est jamais la vérité.

### 6.3 Méthode de création

1. Construire ou corriger le modèle CAD/3D.
2. Valider le modèle face aux plans fabricant et V2040.
3. Créer les quatre matériaux PBR depuis échantillons physiques.
4. Construire chaque scène dans Blender/Cinema 4D avec le master lié, non copié.
5. Placer les objets dans les niches avant le rendu.
6. Rendre le meuble exact, son masque, sa profondeur et ses ombres.
7. Utiliser l'IA uniquement pour la plaque d'ambiance ou l'intégration
   photographique.
8. Réappliquer le rendu produit canonique après l'édition IA.
9. Contrôler automatiquement silhouette, ouvertures, position et couleur.
10. Faire approuver chaque master par un humain avant export.

---

## 7. Direction artistique photographique

### Langage commun

- Photographie éditoriale résidentielle, jamais catalogue 3D aseptisé.
- Objectif visuel 35–50 mm, verticales corrigées sans perfection géométrique
  irréelle.
- Lumière disponible, hautes lumières contrôlées, ombres de contact visibles.
- Microtexture mate, légères irrégularités de surface, grain photographique fin.
- Pièces habitées mais non surchargées.
- Le meuble est complet dans tous les heroes commerce.
- Les humains sont réels dans les images de preuve. Pour les images génératives
  transitoires, éviter les visages proches et ne jamais les présenter comme
  clients ou artisans.

### Monde par finition

| Finition | Moment | Architecture | Objets | Émotion |
|---|---|---|---|---|
| Chalk | matin calme | townhouse londonienne, plâtre, chêne pâle | livres crème, verre fumé, céramique craie | respiration |
| Butter | midi vivant | appartement créatif, acier et bois clair | livres cobalt, verre orange, inox, citron réel | énergie |
| Sage | après-midi jardin | seuil intérieur/extérieur, noyer | céramique olive, branche, livres verts/noirs | équilibre |
| Rose Clay | début de soirée | salon culturel, enduit chaud | vinyle, verre ambré, céramique noire, textile bordeaux | intimité |

Les objets changent avec la finition, mais respectent quatre règles :

- aucun objet ne cache le contour d'une ouverture ;
- aucune niche ne contient plus de deux familles d'objets ;
- le poids visuel reste compatible avec un meuble réel ;
- aucun objet ne traverse, flotte ou fusionne avec la matière.

---

## 8. Matrice complète des visuels

### Lot A — Référentiel exact : 9 images

- 3 produits × vue frontale orthographique.
- 3 produits × vue avant droite à 30°.
- 3 produits × vue arrière gauche à 30°.

VEILLE reste hors lot tant que son manifeste n'est pas approuvé.

### Lot B — Commerce canonique : 12 images

- 3 produits × 4 finitions.
- Fond chaud neutre, sans objets.
- Produit occupant 78–86 % du cadre.
- Export 2048 × 2048 WebP/JPEG + master TIFF/PNG.
- Utilisation : Google Merchant, variantes, panier, checkout, email.

### Lot C — Heroes par finition : 12 scènes, 36 exports

Chaque scène produit :

- desktop `16:10`, 2560 × 1600 ;
- mobile `4:5`, 1600 × 2000 ;
- social `9:16`, 1440 × 2560.

| Produit | Chalk | Butter | Sage | Rose Clay |
|---|---|---|---|---|
| SEUIL | seuil lumineux | déjeuner créatif | passage vers jardin | salon d'écoute |
| PORTÉE | séparation calme | loft vivant | dedans/dehors | soirée galerie |
| VEILLE | premier matin | chambre jeune | lecture végétale | nuit intime |

### Lot D — Preuves produit : 12 images

- 3 vues arrière traversantes.
- 3 vues latérales montrant les 420 mm de profondeur.
- 3 vues à l'échelle avec une personne réelle ou un étalon crédible.
- 3 vues d'usage chargées raisonnablement.

### Lot E — Matière : 8 images

- 4 macros de finition.
- 1 arche en lumière rasante.
- 1 angle extérieur.
- 1 socle en retrait.
- 1 bord intérieur avec ombre et texture.

### Lot F — Preuves documentaires réelles : minimum 8 images

- atelier réel ;
- matière réelle ;
- geste de finition réel ;
- contrôle dimensionnel réel ;
- emballage réel ;
- chargement/livraison réel ;
- installation réelle ;
- intérieur client réel avec autorisation.

Ce lot ne peut pas être généré.

### Lot G — Vidéo : 12 masters

- 4 hooks × 3 produits, 9:16, 10–20 secondes.
- Hooks : `the room continues`, `one form/four lives`, `front to open back`,
  `place it in your room`.
- Son réel de pièce, pas uniquement une musique publicitaire.
- Captions natives et première compréhension sans son.

---

## 9. Contrat universel de prompt

### Entrées obligatoires, dans cet ordre

1. `IMAGE 1` — photographie complète de la pièce du client.
2. `IMAGE 2` — photographie officielle du produit dans la finition choisie.
3. `IMAGE 3` — vue frontale métrique approuvée.
4. `IMAGE 4` — vue à 30° approuvée, utilisée uniquement pour la profondeur.
5. `IMAGE 5` — moodboard d'objets, si nécessaire.

La documentation OpenAI précise que `gpt-image-2` traite automatiquement toutes
les images d'entrée en haute fidélité, mais elle signale encore des limites de
cohérence et de placement précis. Le pipeline ne dépend donc jamais du prompt
pour reconstruire la forme.

### Bloc invariant

```text
IMAGE 1 is the original room and primary composition.
IMAGE 2 is the immutable product identity and selected finish reference.
IMAGE 3 proves the exact front proportions, opening count and opening positions.
IMAGE 4 proves the exact 420 mm depth and side proportions.

Regenerate the editable zone as one coherent photograph. Reproduce the product
from IMAGE 2 exactly: silhouette, width-to-height ratio, opening count, opening
positions, arch geometry, 80 mm wall thickness, recessed base and open back.
Never add or remove a shelf, niche, panel, back, leg or decorative moulding.

Match room perspective, ambient light, colour spill, contact shadow, reflected
light, edge softness, depth of field and foreground occlusion. Preserve the room
outside the integration mask. The result must read as one real architectural
photograph, never as a cutout, overlay, pasted render or collage.
```

### Bloc négatif

```text
No geometry drift. No extra opening. No missing opening. No closed back.
No floating base. No distorted perspective. No oversized product. No shallow
fake depth. No melted object. No duplicated prop. No synthetic glossy plaster.
No perfect showroom symmetry. No plastic surface. No watermark, logo or text.
```

---

## 10. Prompts de scène

Chaque prompt ci-dessous est ajouté après le bloc invariant.

### SEUIL — Chalk

```text
Create a lived-in morning photograph in a refined London townhouse. SEUIL stands
between a quiet salon and a garden threshold, fully visible from base to top and
slightly right of centre. Soft north-east daylight passes through every opening.
Warm chalk plaster walls, pale oak floor, one low linen chair and a distant
garden. Style the niches with cream art books, one smoke-glass vessel and one
small chalk ceramic bowl. Leave 32 percent calm negative space on the left.
Natural 40 mm architectural photography, restrained contrast, realistic surface
variation and contact shadows. Finish: approved Chalk.
```

### SEUIL — Butter

```text
Create a bright, young but timeless midday interior in a creative London flat.
SEUIL is fully visible beside a dining area after friends have arrived, without
showing staged smiling faces. Pale timber, brushed stainless steel and one cobalt
textile accent. Style the niches with two cobalt-spined books, one translucent
orange glass object, a small stainless tray and a single real lemon. Sunlight is
lively but not yellow-filtered. Finish: approved Butter. The result must feel
photographed during real life, not designed by an AI styling model.
```

### SEUIL — Sage

```text
Create an afternoon indoor-outdoor photograph in a calm European home. SEUIL
marks the passage toward a planted courtyard while keeping the full sightline
open. Walnut, pale stone, olive leaves moving slightly outside. Style the niches
with one dark wood object, olive ceramic, two green-grey books and one branch in
a small vessel. Full product visible, correct 1840 mm human scale, soft overcast
daylight and subtle green reflected light. Finish: approved Sage.
```

### SEUIL — Rose Clay

```text
Create an early-evening listening room in a cultured London apartment. SEUIL is
fully visible and catches the last warm daylight, with practical lamps beginning
to glow. Include a low oxblood chair in the background, not touching the product.
Style the niches with one vinyl sleeve, one amber glass vessel, two burgundy art
books and one black ceramic object. Quiet, intimate and contemporary, never
feminine cliché. Finish: approved Rose Clay.
```

### PORTÉE — Chalk

```text
Create a generous open-plan London living room in soft morning light. PORTÉE is
the complete low room divider between living and dining zones, seen at a slight
three-quarter angle so the 420 mm depth and open back are credible. Warm stone
floor, pale oak and linen. Style sparingly with cream books, smoke glass and one
wide chalk bowl. Keep the horizon low and the furniture fully visible. Finish:
approved Chalk.
```

### PORTÉE — Butter

```text
Create a lively weekend interior where PORTÉE connects a lounge and a creative
worktable. The complete cabinet is visible and correctly scaled. Use pale wood,
one cobalt chair and brushed metal details. Style the niches with cobalt books,
one orange glass object, a stainless tray and a folded newspaper. Suggest people
just outside the frame through imperfect daily traces, not fake models. Clear
midday light, energetic composition, approved Butter finish.
```

### PORTÉE — Sage

```text
Create a calm architectural scene opening onto a garden. PORTÉE runs across the
room without becoming a wall; daylight and the garden remain visible through all
eight exact openings. Walnut, pale limestone and restrained planting. Style with
olive ceramic, black art books, one dark wood bowl and a small branch. Soft
cloudy daylight, real reflections and believable floor contact. Finish: approved
Sage.
```

### PORTÉE — Rose Clay

```text
Create a late-afternoon gallery-like home before a small dinner. PORTÉE is fully
visible as a low spatial landmark. Warm white walls, one large abstract artwork,
an oxblood textile and amber practical light. Style the openings with burgundy
books, black ceramic, amber glass and one brushed brass bowl. Keep the scene
human, slightly imperfect and usable. Finish: approved Rose Clay.
```

### VEILLE — four scenes

Do not execute these prompts until the exact VEILLE kit is approved.

```text
CHALK: quiet first light, low upholstered bed, one book, clear water glass,
creased linen, complete product and true relationship to mattress height.

BUTTER: young morning room, cobalt book, stainless bedside lamp, warm daylight
without a yellow cast, complete product and uncluttered floor.

SAGE: afternoon reading bedroom, walnut detail, olive ceramic, dark green book,
garden-reflected light, complete product.

ROSE CLAY: intimate early night, oxblood book, amber glass, soft practical lamp,
no pink-room cliché, complete product.
```

### Packshot

```text
Use the canonical 3D master, not a generated reconstruction. Render a complete
front three-quarter product view on a warm neutral seamless background. Product
occupies 82 percent of the frame. Camera height at product midline, 70 mm lens
equivalent, corrected verticals, soft large key light from upper left, subtle
fill, realistic floor contact and a faint shadow revealing depth. No props.
Approved [FINISH] PBR material. 2048 x 2048.
```

### Vue d'échelle

```text
Photograph the complete product in a real room next to an adult whose measured
height is documented. The person is naturally passing beside the furniture, not
posing or touching it. Preserve the exact product dimensions and camera
perspective. Show the full floor contact and top edge. This image exists to prove
scale, not to create a fashion portrait.
```

### Macro

```text
Create a real macro-style photograph from the approved PBR material and product
mesh. Show the rounded inner edge of one opening under grazing daylight. Preserve
the exact radius and thickness. Reveal matte mineral microtexture, slight hand-
finished variation and soft accumulated shadow. No cracks, concrete aggregate,
plastic gloss or invented pattern. 2048 x 2048.
```

---

## 11. Architecture du nouveau site

### Home anglaise

1. **Full-screen Commerce Hero**  
   Vidéo ou image plein écran, produit complet, nom, finition, prix, `Buy now`,
   `Add to bag`, `View in your room`.
2. **One form, four lives**  
   Les quatre swatches changent image, objets, lumière, prix et URL dans le même
   stage. Aucun long scroll entre les variantes.
3. **Three ways to open a room**  
   Switcher plein écran entre SEUIL, PORTÉE et VEILLE.
4. **The proof**  
   Front, côté, arrière, profondeur, échelle et dimensions.
5. **Made for your order**  
   Matière, délai, livraison, retours, paiement, fiche technique et contact.

### PDP

- Galerie dominante et configurateur sticky.
- Prix, finition, délai et coût de livraison estimé près du CTA.
- Vues `in scale`, arrière et latérale avant toute longue histoire.
- `Save this configuration` sans compte.
- `View in your room` secondaire mais immédiatement accessible.
- Barre mobile sticky : finition, prix, `Buy now`.

### Pages d'acquisition

- `/campaigns/london/seuil`
- `/campaigns/london/portee`
- `/campaigns/google/[product]/[finish]`
- `/campaigns/tiktok/[hook]`

Chaque page conserve UTM, produit et finition jusqu'au checkout. Une campagne ne
renvoie pas vers une home générique si elle présente déjà un produit précis.

---

## 12. Google, TikTok et contenu

### Google

- Une URL par variante, avec image, prix et disponibilité dans le HTML initial.
- `ProductGroup` + `Product` + `Offer` + livraison + retours.
- Image principale : packshot fidèle, sans texte ni décor.
- `lifestyle_image_link` : scène correspondant exactement à la finition.
- GLB fabricant pour vue 3D/AR lorsque disponible.
- Métadonnées d'origine IA conservées lorsque requises.

### TikTok / Reels / Shorts

Quatre séries :

1. `A wall without a wall` — passage avant/après.
2. `Same form, four lives` — changements de finition et d'objets.
3. `What fits through it` — lumière, vue, personnes et quotidien.
4. `Try it in your room` — placement exact puis ajout au panier.

Chaque vidéo :

- verticale et comprise sans son ;
- produit visible dans les premières secondes ;
- 10–20 secondes comme point de départ, puis test ;
- une seule idée et un seul CTA ;
- versions créateur réelles dès que des produits physiques existent ;
- landing dédiée cohérente avec le produit et la finition montrés.

---

## 13. Simulateur

### Modes

1. **AR live** — modèle GLB exact à l'échelle, recommandé en priorité.
2. **Photo placement** — photo entière, ancrage au sol, rotation, pincement,
   calibration facultative.
3. **Photographic finish** — relighting IA optionnel après placement exact.

### Pipeline

```text
upload
→ normalisation EXIF sans crop
→ placement au ratio métrique verrouillé
→ références photographiques et métriques
→ masque local de génération
→ reconstruction photographique cohérente
→ contrôle silhouette/position
→ résultat ou rejet
```

### UX

- Un écran mobile, quatre états : Photo, Place, Create, Result.
- La photo est toujours entièrement visible avec `contain`.
- Le clic définit le point de contact au sol, pas le centre arbitraire.
- L'utilisateur voit le contour exact et le ratio métrique avant la génération.
- Si l'IA échoue, le placement reste disponible pour être ajusté.
- Résultat : `Before/After`, `Adjust`, `Add to bag`, `Close`.

---

## 14. Technologie

La stack Next.js actuelle reste adaptée. La direction artistique ne justifie pas
une réécriture technologique.

À ajouter :

- registre de médias versionné ;
- stockage objet pour masters et dérivés ;
- rendus métriques de référence produits hors ligne ;
- worker de projection ;
- contrôle de géométrie et provenance ;
- tests de contrat entre catalogue, variantes, panier et checkout.

Le catalogue canonique serveur reste la vérité des prix. Le navigateur ne fournit
jamais un montant de confiance à Stripe.

---

## 15. Plan d'exécution

### Phase 0 — Validation

- Clearance juridique de `VIAIRE`.
- Validation de l'origine française et des promesses.
- Dimensions VEILLE.
- Plans fabricant des trois produits.
- Échantillons physiques des quatre finitions.

### Phase 1 — Masters exacts

- Construire les trois jeux de plans métriques approuvés.
- Produire les identity boards.
- Valider dimensions, ouvertures, rayons, épaisseurs et profondeur.
- Refuser toute génération avant approbation.

### Phase 2 — Test artistique

- Produire seulement SEUIL Chalk et SEUIL Butter.
- Valider réalisme, échelle, texture, objets et variation d'ambiance.
- Produire desktop/mobile/social depuis la même photographie source cohérente.
- Corriger la bible avant de multiplier les assets.

### Phase 3 — Production commerce

- 12 packshots.
- 12 heroes.
- 12 preuves.
- 8 macros.
- Exports, métadonnées, manifest et QA.

### Phase 4 — Refonte boutique

- Nouveau système visuel.
- Home, PDP partagée, panier, Stripe et pages campagne.
- EN principal, FR complet.
- Données structurées et Merchant Center.

### Phase 5 — Simulateur

- AR exact.
- Placement photo exact.
- Intégration IA optionnelle.
- Contrôles et refus automatiques.

### Phase 6 — Preuves réelles

- Shooting atelier.
- Shooting échelle humaine.
- Livraison et installation.
- Premiers intérieurs clients autorisés.
- Remplacement progressif des contenus transitoires.

### Phase 7 — Lancement

- Google Shopping par variante.
- TikTok par hook et landing.
- Tests A/B de cadrage, finition par défaut et CTA.
- Déploiement UK, puis UE/US selon fiscalité et logistique validées.

---

## 16. Contrôles d'acceptation

Une image est rejetée si un seul contrôle dur échoue :

- silhouette différente du master ;
- nombre ou position d'ouverture incorrect ;
- profondeur autre que 420 mm pour SEUIL/PORTÉE ;
- socle flottant ;
- perspective incompatible avec la pièce ;
- produit incomplet dans un hero commerce ;
- objet fusionné, flottant ou dupliqué ;
- texture plastique ou trop uniforme ;
- scène manifestement générée ;
- promesse documentaire non réelle.

Seuils :

- silhouette IoU ≥ 0,995 contre le rendu canonique ;
- position et taille à ±2 % du placement ;
- aucune ouverture masquée à plus de 20 % dans un packshot ;
- modification hors masque d'intégration < 1 % ;
- validation humaine à 100 % des masters et heroes ;
- LCP ≤ 2,5 s au 75e percentile ;
- aucun décalage de prix/finition entre page, panier et Stripe.

---

## 17. Sources structurantes

- [Baymard — Product Page UX 2026](https://baymard.com/blog/current-state-ecommerce-product-page-ux)
- [Google — Product variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants?hl=en)
- [Google Merchant Center — Lifestyle images](https://support.google.com/merchants/answer/9103186?hl=en)
- [Google Merchant Center — 3D and AR](https://support.google.com/merchants/answer/13675100?hl=en)
- [TikTok — Creative advertising guide](https://ads.tiktok.com/business/en/guides/what-is-ad-creative-guide)
- [OpenAI — Image generation](https://developers.openai.com/api/docs/guides/image-generation)
- [Threekit — Furniture configurator](https://www.threekit.com/3d-furniture-configurator)
- [Muuto — Configurator](https://www.muuto.com/configurator_new/)
- [USM — Living room](https://us.usm.com/pages/living-room)
- [Herman Miller — Nelson Basic Cabinet](https://www.hermanmiller.com/products/storage/nelson-basic-cabinet-series/)
- [Audo — Curiosity Cabinet](https://us.audocph.com/products/curiosity-cabinet)
- [Minotti — Passarella Vertical Cabinet](https://www.minotti.com/en/passarella_vertical_cabinet)

---

## 18. Décision de départ

La prochaine étape n'est pas de générer 50 images. Elle est de produire et faire
valider :

1. le master exact de SEUIL ;
2. le master exact de PORTÉE ;
3. les dimensions et le master de VEILLE ;
4. deux scènes pilotes SEUIL, Chalk et Butter ;
5. leur test sur une page commerce mobile.

Si ces cinq éléments ne sont pas convaincants, le système est corrigé avant toute
production de volume.
