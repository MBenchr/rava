# Vague A5 — Dossier industriel et golden sample

Date : 27 juillet 2026  
Statut : porte numérique passée ; preuves physiques ouvertes

## Décisions

- LLDPE rotomoulé teinté dans la masse est la voie principale.
- GFRP + finition minérale est le plan de repli.
- La peau nominale de départ est `7 mm` ; le minimum local reste fournisseur.
- La surface cible est presque lisse, `8–15 GU à 60°`, relief `30–50 µm`.
- SEUIL précède PORTÉE dans le prototypage.
- VEILLE reste bloquée jusqu’à validation métrique.
- Le choix fournisseur se fait sur gates, golden sample et landed cost.
- Le produit et l’emballage sont testés comme un système.

## Livrables

- vérité technique typée : `lib/isandre/industrial.ts` ;
- RFQ commun ;
- protocole coupons/tronçon/prototypes/transport ;
- grille fournisseur et gates ;
- golden sample checklist ;
- fiche QC unitaire ;
- NCR/CAPA ;
- spécification emballage ;
- classeur coûts, marges et score fournisseur ;
- vérificateur automatisé.

## Preuves numériques

- `npm run industrial:verify` contrôle la couverture produits/finitions, les
  dimensions canoniques, la voie matière, le statut bloqué de VEILLE et la
  présence des livrables.
- Le classeur contient neuf feuilles, des entrées fournisseur séparées des
  hypothèses de planification et un contrôle des erreurs de formule.
- La copie de travail et la copie canonique du classeur ont le même checksum.
- Aucun terme de marque historique n’est admis dans le dossier industriel
  canonique.

## Recherche actualisée

- le GPSR confirme l’exigence générale de sécurité des produits mis sur le
  marché de l’Union ;
- le PPWR `2025/40` s’applique à partir du 12 août 2026 ;
- ISTA distingue le développement mobilier `2C` et la simulation LTL `3B` ;
- le laboratoire sélectionne les méthodes complètes selon la distribution
  réelle.

## Vérités non établies

- minimum local d’épaisseur ;
- résine et pigment ;
- Delta E de série ;
- coefficient de frottement ;
- flèche et fluage acceptables ;
- masse réelle ;
- besoin de lest de PORTÉE ;
- coût outillage et unité ;
- dimensions de VEILLE ;
- conformité finale ;
- origine de fabrication.

## Porte A5

La porte numérique A5 est franchie. Le produit ne peut devenir
`production-approved` qu’après :

1. RFQ fournisseurs ;
2. coupons instrumentés ;
3. tronçon `640 mm` ;
4. prototype SEUIL ;
5. laboratoire ;
6. emballage qualifié ;
7. golden sample signé ;
8. devis et landed cost confirmés.
