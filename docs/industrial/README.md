# ISANDRE / ṬĀQA — Dossier industriel A5

Version : 27 juillet 2026  
Statut : consultation et prototypage, jamais bon pour production

## Source de vérité

1. géométrie : `lib/isandre/geometry.data.json` ;
2. décision industrielle : `lib/isandre/industrial.ts` ;
3. plan maître : `docs/research/plan-maitre-final-isandre-taqa.md` ;
4. études matériaux 18, 19 et 20 du corpus de recherche local ;
5. golden sample physique signé ;
6. rapports du laboratoire et premiers articles fournisseur.

Un rendu, un échantillon plat ou un devis ne peut jamais supplanter la géométrie
canonique ni un essai physique.

## Décision actuelle

- voie principale : LLDPE rotomoulé grade mobilier, teinté dans la masse ;
- peau nominale de départ : `7 mm`, minimum local à déterminer ;
- surface : presque lisse, satin bas `8–15 GU à 60°` ;
- relief optique cible à tester : `30–50 µm` ;
- voie de repli : GFRP avec finition minérale, uniquement si un gate dur LLDPE
  échoue ;
- SEUIL et PORTÉE : prototypables ;
- VEILLE : bloquée jusqu’à validation métrique.

L’étude 18, plus ancienne, recommandait le composite pour le lancement. Les
études 19–20 et le plan maître, plus récents, placent désormais le LLDPE en
premier. Le dossier A5 applique cette hiérarchie sans effacer le plan de repli.

## Statuts

| Statut | Sens |
|---|---|
| `target` | intention de conception, non contractualisée |
| `prototype-required` | doit être mesuré sur coupon ou prototype |
| `supplier-required` | nécessite une réponse ou un devis fournisseur |
| `laboratory-required` | méthode et seuil à confirmer par laboratoire |
| `blocked` | aucune promesse, aucun prix industriel ni lancement autorisé |
| `approved` | preuve signée et archivée |

## Livrables

- `rfq-manufacturer.md` : consultation identique pour tous les fournisseurs ;
- `material-test-protocol.md` : coupons, tronçon et prototype ;
- `supplier-scorecard.md` : gates et note sur 100 ;
- `golden-sample-checklist.md` : décision physique ;
- `unit-qc-template.md` : contrôle par unité ;
- `non-conformity-report-template.md` : NCR et CAPA ;
- `packaging-specification.md` : produit + emballage comme système ;
- `cost-margin-model.md` et `isandre-industrial-cost-model.xlsx` : budget,
  devis, landed cost et contribution.

## Interdits

- annoncer `Made in France`, extérieur, charge, conformité ou réparabilité sans
  preuve ;
- commander un moule de série avant DFM, tronçon, prototype et transport ;
- accepter un prix sortie usine sans landed cost ;
- comparer des fournisseurs sur des périmètres différents ;
- combler les inconnues de VEILLE par des valeurs estimées ;
- publier des images atelier ou des certificats non réels.

## Références réglementaires et tests

- GPSR : <https://commission.europa.eu/business-economy-eu/doing-business-eu/eu-product-safety-and-labelling/product-safety_en>
- PPWR, applicable à partir du 12 août 2026 :
  <https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng>
- sélection des protocoles ISTA :
  <https://www.ista.org/test_procedures.php>

Les standards complets sont acquis par le laboratoire. Ce dossier ne prétend
pas en reproduire les méthodes propriétaires.
