# Vague A10 — Fiches produit partagées

Date : 28 juillet 2026  
Statut : terminé et validé

## Architecture

Les six routes produit, anglaises et françaises, utilisent un seul template et
trois zones :

1. **Commerce** : galerie courte, produit, finition, prix, pays, quantité,
   panier, achat direct et projection ;
2. **Pièce et preuves** : une scène D02/D03, la profondeur ou le dos traversant,
   puis la planche dimensionnelle P03 lorsque la géométrie est approuvée ;
3. **Détails et projet** : dimensions, construction, fabrication, livraison,
   fiche technique, contact studio et deux pièces associées.

Le `BuyPanel` est strictement le même que sur la home. Aucune logique de prix,
de marché, de finition, de panier ou de projection n’est reconstruite dans la
PDP.

## Règles média

- le fold ne garde que D01, C01, C02 et une scène D02/D03 ;
- le packshot utilise `object-fit: contain` et les scènes `object-fit: cover` ;
- SEUIL et PORTÉE montrent P02 puis P03 ;
- VEILLE, encore `concept-blocked`, montre P01 puis P04 et ne rend pas sa
  planche dimensionnelle vide ;
- les images sous la ligne de flottaison restent lazy-loadées et sont vérifiées
  après scroll réel ;
- aucune macro matière ni preuve physique synthétique n’est introduite.

## Comportement

- la finition met à jour l’URL, le prix, les médias et le panier ;
- le panneau d’achat ouvre le drawer global ;
- les liens de fiche technique et projet sont proches des données techniques ;
- le mobile conserve le média, les options d’achat puis les preuves dans cet
  ordre ;
- les données structurées `ProductGroup` gardent les quatre variantes et leurs
  prix canoniques.

## Cas VEILLE

VEILLE reste commercialement visible, mais ses dimensions et sa projection
exacte restent bloquées. L’interface dit explicitement que les dimensions sont
en validation et ne publie aucun nombre. Sa troisième image de preuve est une
scène d’échelle P04, pas une fausse planche cotée.

## Preuves

```bash
npm run typecheck
npm run lint
npm run build:qa
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npm run test:e2e
```

Résultat : `9/9` scénarios Playwright réussis.

Captures :

- `output/playwright/a10/seuil-desktop.png`
- `output/playwright/a10/portee-desktop.png`
- `output/playwright/a10/veille-desktop.png`
- `output/playwright/a10/seuil-mobile-fr.png`
- `output/playwright/a10/portee-mobile.png`
- `output/playwright/a10/veille-mobile-v2.png`
