# Plan A7 — Vidéos V01/V02

Date : 28 juillet 2026  
Statut : préproduction terminée ; tournage physique à planifier

## Règle

La vidéo prouve le volume par le mouvement et installe la vie par le temps.
Elle ne cache jamais la géométrie avec une transition, une personne ou un
accessoire. Les produits filmés sont des prototypes ou unités finales réels.

## Livrables de lancement

| ID | Produit | Finition | Durée | Formats | Usage |
|---|---|---|---:|---|---|
| `V01-S` | SEUIL | quatre finitions | 10 s | 16:9, 4:5, 9:16 | PDP, social |
| `V01-P` | PORTÉE | quatre finitions | 10 s | 16:9, 4:5, 9:16 | PDP, social |
| `V01-V` | VEILLE | quatre finitions après H-005 | 8 s | 16:9, 4:5, 9:16 | PDP, social |
| `V02-S` | SEUIL | Craie + Argile rose | 12–15 s | 16:9, 9:16 | hero, acquisition |
| `V02-P` | PORTÉE | Sauge + Beurre | 12–15 s | 16:9, 9:16 | hero, acquisition |
| `V02-V` | VEILLE | Craie + Argile rose après H-005 | 10–12 s | 16:9, 9:16 | acquisition |

## V01 — Volume continu

1. `0–1,5 s` : face entière, caméra immobile ;
2. `1,5–7,5 s` : déplacement latéral régulier équivalent à `25–30°`, sans
   rotation artificielle de l'objet ;
3. `7,5–10 s` : arrêt trois-quarts, profondeur et dos ouvert lisibles.

Paramètres :

- focale 50–70 mm plein format ;
- caméra à hauteur du centre produit, slider motorisé ;
- produit occupant `65–75 %` du cadre ;
- source large latérale et ombre de contact continue ;
- 25 fps, obturateur 1/50, 4K 10 bits Log ;
- aucun speed-ramp, zoom numérique, texte ou morphing.

Critères de rejet :

- une ouverture disparaît par parallaxe ;
- le socle sort du cadre ;
- les verticales convergent excessivement ;
- le mouvement produit une impression de rendu 3D ;
- la finition change de teinte au cours du plan.

## V02 — Scène vécue

### SEUIL

- ouverture sur une circulation calme ;
- une personne réelle traverse en arrière-plan sans toucher ni masquer le
  produit ;
- rack focus bref du passage vers l'arche ;
- fin sur la lumière qui traverse les ouvertures.

### PORTÉE

- plan large salon–repas ;
- main réelle déposant un livre léger ou un verre, charge validée au préalable ;
- travelling très lent révélant la fonction de séparation ;
- fin sur une ouverture alignée avec la pièce arrière.

### VEILLE

- plan de début de soirée près du lit ;
- main allumant une lampe puis retirant un livre ;
- produit complet dans le premier et le dernier plan ;
- aucun tournage avant géométrie H-005.

## Son et montage

- son direct discret : pas, page, verre, interrupteur ;
- musique originale ou licenciée, aucun son tendance non cleared ;
- aucun dialogue nécessaire ;
- coupe toutes les `2,5–4 s` maximum, jamais au détriment de la lecture produit ;
- master ProRes 422 HQ, archive avec LUT et fichiers audio séparés ;
- sous-titres uniquement si une version parlée est produite.

## Exports

- 16:9 `3840 × 2160` ;
- 4:5 `2160 × 2700` ;
- 9:16 `2160 × 3840` ;
- H.265/AV1 web, MP4 H.264 de secours ;
- poster WebP/AVIF issu d'une frame validée ;
- débit adaptatif et `preload=metadata` sur le site ;
- réduction du mouvement : poster fixe, aucune lecture automatique obligatoire.

## Droits et preuve

- releases signées pour toute personne identifiable ;
- musique, lieu, œuvres et objets tiers cleared ;
- prototype, lieu et date consignés ;
- aucune vidéo d'atelier simulée ;
- checksum, crédit, droits, marchés et date d'expiration dans le registre.

La vidéo n'entre dans le manifeste public qu'après contrôle géométrique,
colorimétrique, droits et performance.
