# ISANDRE / ṬĀQA — Audit d'écart vers le standard du benchmark 60

Date : 30 juillet 2026  
Base auditée : application locale `http://127.0.0.1:3014`  
Routes vérifiées : `/`, `/?product=seuil-01&finish=chalk`, `/products/seuil-01?finish=chalk`, `/making`  
Viewports vérifiés : desktop `1280 × 720`, mobile `390 × 844`

---

## 1. Diagnostic exécutif

Le site possède déjà un **bon premier écran commerce** :

- produit entier et reconnaissable ;
- sélection des trois pièces visible ;
- quatre finitions ;
- prix ;
- pays ;
- quantité ;
- `Buy now`, `Add to bag`, projection et fiche technique ;
- panier persistant ;
- expérience mobile sans débordement horizontal.

Le problème principal commence après ce premier écran. Le site répète alors la promesse sous plusieurs formes, éloigne certaines preuves du CTA et donne à une fabrication encore conceptuelle un poids documentaire trop fort.

Mesures observées :

| Route | Hauteur rendue | Lecture |
|---|---:|---|
| Home desktop | `6 754 px` | Trop longue pour un storefront de trois produits |
| Home mobile | `6 908 px` | Environ huit écrans avant la fin |
| PDP SEUIL desktop | `3 595 px` | Longueur acceptable, mais ordre perfectible |
| Making desktop | `8 254 px` | Page éditoriale excessive avant preuve réelle |

Décision :

> **Conserver le fold commerce. Réduire la home. Rendre la preuve plus factuelle. Déplacer l'émotion dans les images plutôt que dans la répétition des sections.**

---

## 2. Ce qui doit absolument rester

| Élément actuel | Pourquoi il fonctionne | Règle de conservation |
|---|---|---|
| Hero commerce divisé image / achat | Le désir et la décision coexistent | Ne pas séparer à nouveau landing et boutique |
| Sélecteur trois produits | La famille est compréhensible avant navigation | Conserver les miniatures et rôles distincts |
| Swatches avec prix synchronisé | Réduit l'effort de configuration | Même logique sur home, PDP, panier et projection |
| Choix pays | Rend livraison/devise concrètes | Détection automatique + changement manuel |
| Buy now + Add to bag | Couvre achat direct et panier | Garder la hiérarchie visuelle actuelle |
| Fiche technique en modal | La preuve ne casse pas la navigation | Compléter, ne pas renvoyer vers une longue page |
| Projection minimisable | Permet de continuer la visite | Garder le calcul en arrière-plan et le dock résultat |
| Barre d'achat mobile | Prix et CTA restent disponibles | Conserver avec miniature, finition et quantité |
| PDP dédiée | Utile au SEO, au partage et à la vérification | La raccourcir, ne pas la supprimer |

---

## 3. Matrice d'écarts priorisée

### P0 — À corriger avant toute nouvelle campagne

| Écart | Preuve actuelle | Risque | Pratique benchmark | Correction | Preuve d'acceptation |
|---|---|---|---|---|---|
| La fabrication conceptuelle est présentée comme une preuve majeure | Home : bloc `preproduction-process`; making : 7 séquences; texte `visualisationDisclosure` encore rendu | Confusion entre projet et réalité, perte de confiance | CH24, Hermès, Togo : le geste d'atelier est documentaire | Retirer le processus de la home. Sur `/making`, distinguer explicitement `Process design` et `Documented production`; ne publier l'atelier comme preuve qu'après shooting réel | Aucun contenu généré n'est formulé comme un fait observé ; une mention non intrusive décrit la nature des images |
| Mention client indésirable toujours visible | `visualisationDisclosure` est rendu en bas de la home et de `/making` | Le client voit une note de production interne | Les marques premium ne font pas porter leur roadmap au client | Supprimer cette phrase de l'interface commerciale ; conserver l'information dans les métadonnées internes/IA et le dossier presse | Recherche DOM : aucun texte « pre-production », « planned protocol » ou équivalent |
| Origine et fabrication ne sont pas stabilisées | UI : `Designed in France`, `Made to order in Italy`, alors que plusieurs briefs précédents parlaient de France | Risque légal, éditorial et checkout | RIMOWA, Hermès, Omega : origine documentée et stable | Verrouiller l'origine réelle dans une fiche de vérité ; une seule formulation dans catalogue, PDP, checkout, emails et schema | Test de contenu : aucune origine divergente |
| Le produit doit rester géométriquement identique dans tous les médias | Les visuels générés historiques ont varié en épaisseur et proportions | Le client ne sait plus quel objet il achète | Panton, Togo, Lady Dior : silhouette invariant | Adopter une planche de référence canonique par produit et une validation humaine avant publication | Nombre d'ouvertures, ratio et profondeur conformes sur 100 % des médias commerce |
| VEILLE manque de données métriques définitivement validées | Le projet a déjà signalé l'absence de dimensions canoniques | Faux niveau de preuve ou projection incorrecte | Toutes les PDP premium publient des dimensions vérifiées | Ne pas inventer. Bloquer projection exacte et fiche finale jusqu'au dessin validé | Le champ est explicitement `pending` en interne, jamais remplacé par une valeur arbitraire |

### P1 — Conversion et désir

| Écart | Preuve actuelle | Risque | Pratique benchmark | Correction | Preuve d'acceptation |
|---|---|---|---|---|---|
| Home trop longue | `6 754 px` desktop, `6 908 px` mobile | Fatigue, répétition, CTA dilué | Apple, iMac, Beosound A9 : décision précoce, histoire comprimée | Home en 4 actes : acheter, choisir, vivre, vérifier | Mobile ≤ `4 800 px` à contenu équivalent ; aucun bloc répétitif |
| La promesse est répétée | H1, collection, story, proof et making reformulent l'ouverture | Effet « marque qui s'explique » | Aesop, Loewe : une idée, plusieurs preuves | Une seule phrase de marque, puis des légendes factuelles | Aucun concept répété plus de deux fois par route |
| Les dimensions arrivent tard | PDP : dimensions dans la troisième zone | L'incertitude d'échelle persiste près du prix | RIMOWA, Eames, Gentle Monster : fit/dimensions près du choix | Ajouter un résumé `102 × 184 × 42 cm` sous le descripteur + fiche détaillée en modal | Dimensions accessibles en un clic depuis le fold et présentes en HTML |
| Le service proche du CTA reste trop abstrait | `Made to order`, mais délai/livraison précis plus bas | Prix premium insuffisamment encadré | B&O, RIMOWA : garantie, livraison, support proches du prix | Afficher production, estimation de transit, taxes/duties et politique retour sous le CTA | Le client voit ces quatre informations sans quitter le fold desktop |
| Les quatre finitions ne forment pas encore quatre mondes distincts | Swatches efficaces mais plusieurs contextes restent similaires | Variantes perçues comme simples recolorations | USM, SMEG, Lady Dior : contexte adapté, produit stable | Définir accessoires, lumière et pièce par finition | Changer de finition met à jour packshot + scène + objets, jamais la géométrie |
| Les objets dans les niches ont parfois une densité décorative trop uniforme | Mise en scène très ton sur ton | Impression générative ou showroom sans vie | LEMAIRE, Togo, Aesop : capacité, rituel et objets crédibles | Une hiérarchie 60/30/10 : livres usuels, céramique, trace de vie ; 35–55 % des niches vides | Revue image : pas de set monochrome systématique, objets physiquement plausibles |
| Le comparateur de collection et le storytelling sont séparés | Sélection dans le fold, cartes puis grande bande narrative | Le visiteur revoit trois fois la même famille | Apple et Dyson : variante, média et preuve se répondent | Fusionner collection et premières scènes : une sélection met à jour le stage | Un clic produit met à jour image, copy, prix, URL et preuve d'usage |
| La PDP commence bien mais ajoute une nouvelle hiérarchie éditoriale | Fold commerce puis grand chapitre « A presence... » | Rupture de rythme et duplication | Loewe Puzzle : détail sans réécrire la promesse | PDP en trois zones : commerce, preuves visuelles, service/related | Trois H2 maximum hors FAQ |

### P2 — Finition et exploitation

| Écart | Preuve actuelle | Risque | Correction | Acceptation |
|---|---|---|---|---|
| Express checkout affiche un bloc vide pendant l'initialisation | Iframe Stripe disponible après délai, placeholder clair très léger | Impression de composant cassé | Skeleton explicite `Checking available express methods…`; masquer le label si aucune méthode | Aucun rectangle vide > 500 ms sans statut |
| Les images lazy sous la ligne ne sont pas encore chargées au premier audit | Plusieurs `naturalWidth = 0` avant scroll | Vide ponctuel lors d'un saut d'ancre ou scroll rapide | Précharger la scène suivante, conserver `loading=lazy` pour le reste | Aucun bloc média vide lors d'un scroll rapide standard |
| Full-page screenshot répète les zones sticky | Effet de capture, pas nécessairement visible en navigation | QA visuelle trompeuse | Désactiver les sticky dans un mode capture/e2e | Screenshots de recette stables |
| La navigation n'expose pas directement le service/projet | Header : Pieces, Making, View in your room | Certains prescripteurs cherchent trade/contact | Ajouter un accès discret `Trade` dans footer et PDP, pas dans le hero | Parcours trade ≤ 2 clics |
| Le vocabulaire `Cabinet` peut réduire la nouveauté perçue | `Open Tall Cabinet`, `Open Low Cabinet` | Traduction fonctionnelle mais banale | Tester `Open storage object` vs `Open cabinet`, sans perdre SEO | Test qualitatif et recherche organique avant changement |

---

## 4. Audit image par fonction

### 4.1 Image maîtresse

État actuel :

- le hero montre bien SEUIL en entier ;
- la relation avec l'architecture est lisible ;
- les objets restent discrets ;
- le H1 et le buy panel restent visibles.

À améliorer :

- éviter que le titre recouvre les ouvertures importantes ;
- disposer d'un crop mobile réellement composé, pas seulement recadré ;
- stabiliser un hero par produit et par marché, sans changer la forme.

### 4.2 Vue canonique

État actuel :

- miniature frontale présente dans le fold ;
- sélection des trois formes rapidement compréhensible.

À améliorer :

- augmenter légèrement la taille utile dans les miniatures ;
- conserver fond, distance caméra et échelle identiques ;
- produire un vrai triptyque frontal / 30° / arrière pour chaque pièce.

### 4.3 Échelle

État actuel :

- les scènes architecturales donnent une intuition ;
- les dimensions chiffrées existent pour SEUIL et PORTÉE.

À améliorer :

- une scène avec personne réaliste ou repère architectural mesurable ;
- un diagramme dimensionnel clair ;
- ne jamais utiliser une personne générée comme preuve de fabrication.

### 4.4 Matière

État actuel :

- surface mate lisible ;
- palette cohérente.

À améliorer :

- macro réelle à lumière rasante ;
- échantillon expédiable ;
- entretien, résistance, variation et tolérance de finition documentés.

### 4.5 Fabrication

État actuel :

- storytelling visuel fort ;
- forme et moule sont compréhensibles.

Problème :

- l'ensemble a la grammaire visuelle d'un reportage alors qu'il s'agit encore d'une visualisation.

Décision :

- réduire aujourd'hui cette page à `Form / Material / Finish / Inspection` ;
- remplacer chapitre par chapitre avec les photographies de la première production ;
- ne jamais présenter des personnes générées comme les artisans réels.

---

## 5. Architecture cible

### Home

1. **Commerce fold** — image, produit, finition, dimensions résumées, prix, pays, quantité, achat, projection, service.
2. **Three forms** — un stage interactif, trois sélecteurs, une phrase par rôle.
3. **Living proof** — trois grandes scènes maximum : passage, séparation, chevet.
4. **Trust** — matière, production, livraison, fiche, trade, footer.

### PDP

1. **Commerce** — galerie + buy panel + dimensions essentielles.
2. **Proof** — produit entier, vue arrière, profil, macro, scène d'usage.
3. **Service** — matière, production, livraison, retours, entretien, related.

### Making

Avant première production réelle :

1. `The form`
2. `The material`
3. `The finish`
4. `What will be documented`

Après shooting réel :

1. moule ;
2. chargement matière ;
3. rotation/refroidissement ;
4. démoulage ;
5. ébavurage/finition ;
6. contrôle dimensionnel ;
7. emballage et expédition.

---

## 6. Séquence de correction

### Lot 1 — Vérité et confiance

- verrouiller origine, matière, dimensions et statut des images ;
- retirer les formulations de préproduction de l'UI commerciale ;
- ajouter le registre média `documentary | generated-context | technical`;
- empêcher tout média non approuvé d'être un hero ou une preuve.

### Lot 2 — Home courte

- conserver le fold ;
- fusionner collection et story ;
- supprimer le processus de fabrication de la home ;
- réduire le trust à quatre preuves.

### Lot 3 — PDP convergentes

- partager un seul buy panel ;
- rapprocher dimensions et service ;
- limiter les galeries aux médias qui répondent à une question d'achat ;
- garantir la même logique sur les trois produits.

### Lot 4 — Système média

- produire les vues canoniques ;
- définir les quatre mondes de finition ;
- photographier/valider échelle, matière et arrière ;
- remplacer progressivement les visualisations d'atelier.

### Lot 5 — Commerce et mesure

- stabiliser le loader Express Checkout ;
- vérifier Apple Pay/Google Pay/Link/PayPal/Klarna selon éligibilité ;
- instrumenter vue produit, finition, fiche, projection, panier, checkout et achat ;
- suivre erreurs média, délais projection et abandon checkout.

---

## 7. Critères de réussite

La refonte est acceptée seulement si :

- le produit, son rôle, sa finition, son prix et son CTA sont compris en moins de cinq secondes ;
- la home contient quatre actes maximum ;
- aucune preuve générée n'est présentée comme documentaire ;
- les dimensions sont accessibles depuis le fold ;
- les trois formes sont visuellement distinctes ;
- les quatre finitions changent le monde sans changer l'objet ;
- une seule promesse de marque organise toute la page ;
- l'achat reste possible à tout moment sur mobile ;
- le panier, le checkout et la projection conservent produit, finition, marché et quantité ;
- le site passe `lint`, `typecheck`, `build`, Playwright desktop/mobile et audit Core Web Vitals.

