# Vague A4 - Système d'identité

Date : 27 juillet 2026  
Statut : implémenté numériquement, portes physiques ouvertes

## Source de vérité

- Plan maître : `docs/research/plan-maitre-final-isandre-taqa.md`
- Recherche identité : documents 11, 14 et 17 de `DA Rava 2040`
- Tokens runtime : `lib/isandre/brand.ts`
- Générateur : `scripts/generate-brand-assets.mjs`
- Manifest : `brand/brand-assets.manifest.json`

## Livrables produits

### Masters

- wordmark positif, négatif et monochrome ;
- L’ENTAILLE positive, négative et monochrome ;
- lockup ISANDRE / ṬĀQA positif et négatif ;
- favicon canonique ;
- copies publiques vérifiées.

### Marque d’origine

- preuve couleur ;
- prototype de gravure monochrome ;
- feuille A4 à l’échelle 1:1 avec barre de contrôle ;
- protocole de prototypage et d’acceptation.

### Applications

- carte d’authenticité recto/verso ;
- certificat A4 ;
- étiquette emballage A6 ;
- couverture presse ;
- couverture trade ;
- template social 4:5 ;
- template présentation 16:9.

### Guides

- charte anglaise ;
- charte française ;
- guide de crédits et signatures ;
- guide web interne `/brand`, marqué `noindex` ;
- charte PDF bilingue de huit pages, versionnée dans
  `brand/guidelines/isandre-brand-guidelines-a4-1.pdf`.

## Contrats

- L’ENTAILLE : `100 × 155`, retrait `34 × 34`, centre vertical `96,1`.
- Plaque : `42,07 × 26,00 × 1,20 mm`, rayon `0,8 mm`.
- Wordmark : master vectoriel, minimum `90 px` écran et `18 mm` impression.
- Typographie : Bodoni Moda / Manrope / Manrope Medium tabulaire.
- Origine : `Designed in France. Made to order in Italy.` ; les preuves de la
  chaîne France/Italie restent conditionnées par H-004.

## Commandes de preuve

```bash
npm run brand:assets
npm run brand:verify
npm run brand:guide:pdf
```

Le contrôle compare chaque copie publique à son master par SHA-256 et refuse
une plaque qui ne porte plus le statut `prototype-required`.

## Résultats QA

- 22 assets de marque vérifiés ;
- charte PDF rendue en PNG et inspectée visuellement ;
- pages sombres corrigées après détection d’un contraste invalide ;
- wordmark exact intégré au PDF et au shell du site ;
- favicon remplacé par L’ENTAILLE ;
- contrôles responsive passés à `1440 px` et `390 px`, sans débordement ;
- plaque chargée et décodée à `159 × 98 px` puis rendue à `520 × 321 px`,
  sans erreur console ;
- `lint`, `typecheck`, `build` et les quatre parcours Playwright passent ;
- aucune assertion d’origine non prouvée ajoutée.

## Portes non automatisables

- impression 1:1 ;
- prototype bronze ;
- lisibilité à 50 cm ;
- gravure réelle ;
- fixation et abrasion ;
- NFC avec ferrite sur cinq téléphones.

Ces portes sont regroupées dans H-008. Aucun fichier A4 n’est présenté comme
bon à produire avant leur validation.
