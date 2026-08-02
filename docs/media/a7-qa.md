# QA visuelle A7

Date : 28 juillet 2026  
Périmètre : `C01`, `C02`, `D01–D04`, `D01-mobile`, `P01–P04`

## Contrôles passés

- les trois silhouettes restent distinctes et stables ;
- SEUIL et PORTÉE conservent huit ouvertures dans le même ordre ;
- les quatre finitions ne modifient pas le volume général ;
- les objets changent avec la finition sans masquer la géométrie ;
- le socle et le contact au sol restent visibles ;
- les masters mobiles montrent le produit entier ;
- aucun master mobile n’utilise le letterboxing initial ;
- aucune ancienne image VIAIRE ou RAVA n’est servie ;
- les médias commerce et désir sont des fichiers différents ;
- les vues C02 rendent la profondeur visible sans modifier la face canonique ;
- les profils P01 montrent le contact au sol et la profondeur ;
- les vues arrière P02 de SEUIL et PORTÉE inversent correctement la lecture
  des colonnes et prouvent la construction traversante ;
- les plaques P03 de SEUIL et PORTÉE reprennent les dimensions du registre
  canonique ; celle de VEILLE ne publie aucune cote non validée ;
- les vues P04 conservent le produit entier et utilisent un mobilier de taille
  standard comme repère d’échelle ;
- D02 distingue un moment matinal réellement habité de D01 sans transformer
  l’image en catalogue d’accessoires ;
- D03 conserve une exposition suffisante à l’heure bleue : silhouette,
  matière, profondeur et contact au sol restent lisibles ;
- D04 montre l’usage concret de chaque produit dans les quatre finitions sans
  modifier la géométrie ni remplir toutes les ouvertures ;
- les scènes VEILLE D04 conservent exactement une arche supérieure et une
  niche horizontale inférieure ;
- la première variante PORTÉE Beurre D04, dont les niches gauches avaient
  fusionné, est rejetée et absente du manifeste ;
- chaque source canonique possède un checksum unique, y compris entre rôles ;
- tous les dérivés portent la déclaration XMP d’origine algorithmique.

## Lecture éditoriale

### SEUIL

Le seuil végétal offre la meilleure lecture de la hauteur, de la profondeur et
du rôle de séparation. Craie porte la lumière, Beurre introduit l’énergie,
Sauge calme l’ensemble et Argile rose installe le soir.

### PORTÉE

La relation salon–repas donne une preuve d’échelle immédiatement lisible. Les
objets sont moins nombreux que les ouvertures, ce qui maintient l’impression
d’espace.

### VEILLE

La relation au lit rend l’usage évident. Ces images restent des concepts :
elles ne valident ni dimensions, ni prix de revient, ni projection exacte.

## Réserves

- la matière visible reste une représentation numérique avant H-009 ;
- la fidélité des quatre couleurs reste bloquée par H-010 ;
- certaines variations numériques montrent une microtexture plus présente
  sous lumière rasante ; elles ne constituent pas un golden sample ;
- la seconde revue plein écran et la comparaison aux coupons restent à faire ;
- aucune macro matière ou scène d’atelier n’est encore libérée ;
- P02 VEILLE reste absent : les deux essais ont introduit une arche pointue
  incompatible avec la référence. Exposer cette image aurait constitué une
  fausse preuve produit.
- deux variantes SEUIL avec personne ont été rejetées : le rapport visuel entre
  la personne et les `1 840 mm` du produit ne résistait pas au contrôle de
  perspective.

## Décision

`C01`, `C02` et `D01–D03` sont admis dans la sélection storefront.
`D04` est admis comme preuve d'usage avec `launchSelected=true`. D02/D03
restent réservés à l'acquisition hors PDP. `P01`, `P03` et `P04` sont admis
comme preuves numériques de lecture ; `P02` est admis
uniquement pour SEUIL et PORTÉE. `P03/P04` VEILLE restent
`concept-blocked`. Aucun wording de preuve physique, matière ou fabrication
ne doit leur être associé.

Le périmètre automatisable A7 est terminé. Les familles `M01–M03`, les
photographies d'atelier et les clips finaux ne sont libérés qu'après leurs
portes physiques. Leurs protocoles sont définis dans
`a7-material-photography-protocol.md` et `a7-video-shot-plan.md`.
