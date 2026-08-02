# Vague A9 — Storefront commerce

Date : 28 juillet 2026  
Statut : terminé et validé

## Résultat

La home ISANDRE est désormais un storefront de quatre blocs réels :

1. `Storefront Fold` : scène D01, promesse, packshot C01, sélecteur produit,
   finition, prix, quantité, panier, projection et preuves de service ;
2. `Collection Switcher` : les trois pièces restent visibles et la sélection
   met à jour la home sans navigation imposée ;
3. `Living With Open Form` : trois scènes fonctionnelles D04, une par pièce ;
4. `Proof + Service` : profondeur P01, dos traversant P02 lorsque validé,
   planche technique P03, fabrication, livraison et accès projet.

Les scènes D02/D03 constituent la bibliothèque acquisition/story. D04 est la
scène fonctionnelle sélectionnée pour le storefront et les PDP. Les preuves
physiques manquantes ne sont pas remplacées par des images synthétiques.

## Hiérarchie commerce

- le prix, la finition, la quantité et `Add to bag` sont accessibles dans le
  premier écran utile ;
- la projection est une validation secondaire et hérite de la sélection ;
- le changement de produit ou de finition met à jour média, prix, URL, panier
  et contexte projection depuis le catalogue canonique ;
- les trois cartes de collection utilisent D01 et C01, sans inventer de média ;
- le mobile conserve un achat rapide, un switcher horizontal et une barre
  d’achat fixe.

## Système visuel

Le storefront utilise uniquement les surfaces sémantiques suivantes :

| Token | Valeur claire | Usage |
|---|---:|---|
| `background` | `#F3F1EB` | papier minéral |
| `card` | `#FCFBF7` | surface commerce |
| `secondary` | `#E8E8E2` | surface discrète |
| `muted` | `#DEDED7` | fond média |
| `foreground` | `#121311` | encre |
| `charcoal` | `#171815` | séquence narrative ponctuelle |
| `cobalt` | `#244B72` | accent d’action |

Aucun grand module brun, aucune grille décorative et aucun halo permanent ne
structurent la page.

## Résilience des médias

- hero D01 rendu avec art direction responsive ;
- packshot C01 piloté par finition ;
- `pointer-events: none` sur les images des sélecteurs pour garantir les gestes
  tactiles ;
- chargement différé vérifié après scroll réel ;
- aucun média cassé sur les recettes desktop et mobile.

## Isolation de la recette

Un serveur `next dev` actif écrit continuellement dans `.next`. Lancer en
parallèle un build puis `next start` sur ce même répertoire corrompait les
manifests de production. La recette utilise donc un répertoire dédié :

```bash
npm run build:qa
npm run start:qa -- --hostname 127.0.0.1 --port 3012
```

`NEXT_DIST_DIR` reste configurable pour les autres environnements. Le runtime
normal continue d’utiliser `.next`.

## Preuves

```bash
npm run content:verify
npm run media:verify
npm run typecheck
npm run lint
npm run build:qa
npm run test:e2e
```

Résultats :

- `242` champs éditoriaux vérifiés par langue ;
- `71` masters médias vérifiés ;
- build de `30` routes réussi ;
- `4/4` scénarios Playwright réussis ;
- pages desktop et mobile sans image cassée.

Captures :

- `output/playwright/a9/home-desktop-v3.png`
- `output/playwright/a9/home-mobile-v3.png`
