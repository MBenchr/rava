# Procédure de rollback

## Principe

Chaque vague doit être réversible sans effacer les documents de recherche ni
les médias sources. Aucun `git reset --hard` et aucun remplacement destructif
des assets ne sont autorisés.

## Point de départ

- Commit de référence : `c5d0757`
- Baseline : `docs/execution/baseline.md`
- Médias live avant migration : `public/viaire/`
- Kits avant migration : `public/projection-kits/elan-o1/` et
  `public/projection-kits/portee-o2/`

## Stratégie par vague

1. Introduire les nouveaux modules et contrats à côté des adaptateurs
   historiques.
2. Tester la normalisation des anciens IDs avant de changer les consommateurs.
3. Migrer un consommateur à la fois : contenu, schémas, routes, commerce,
   projection.
4. Conserver les chemins médias historiques tant que le nouveau manifeste
   n'est pas validé.
5. Ne supprimer les façades de compatibilité qu'après passage complet des
   tests et vérification des anciennes URLs.
6. Ne jamais éditer directement un master de marque généré : revenir au
   générateur, régénérer, puis vérifier les checksums.

## Retour arrière ciblé

En cas d'échec :

- rétablir le consommateur vers la façade de compatibilité ;
- conserver les nouveaux modules non utilisés pour diagnostic ;
- remettre les redirects vers les routes actuellement fonctionnelles ;
- relancer l'ensemble de la baseline ;
- documenter l'écart dans `decision-log.md`.

Pour A4, le rollback ciblé consiste à rétablir le wordmark texte et les anciennes
variables CSS sans supprimer `brand/`. Les fichiers A4 restent disponibles pour
comparaison tant que la cause visuelle ou technique n’est pas comprise.

Pour A5, le rollback ciblé consiste à retirer les consommateurs éventuels de
`lib/isandre/industrial.ts` sans supprimer le dossier `docs/industrial/`.
Le classeur, les RFQ, les protocoles et les preuves restent archivés. Une valeur
mesurée ou un devis fournisseur ne doit jamais être remplacé par une ancienne
hypothèse `PLANNING` lors d’un retour arrière.

Pour A6, les pilotes restent isolés dans `media/a6-pilots/` et ne sont jamais
servis. Annuler une sélection consiste à modifier le manifeste et les rapports,
sans supprimer les trois directions sources. Le contrat est contrôlé avec
`npm run media:pilots:verify`.

Pour A7, les masters restent dans `media/a7-sources/`. Le dossier
`public/isandre/media/` est intégralement régénérable par
`npm run media:build`. Un rollback média restaure le dernier
`a7-media-source-plan.json` et régénère les dérivés ; il ne réintroduit jamais
les anciens dossiers VIAIRE supprimés.

Le rollback ne doit jamais restaurer une assertion de marque, d'origine ou de
géométrie qui aurait été identifiée comme non validée.

## Rollback A17 — Durcissement de release

Le rollback de la recette finale est ciblé et ne réintroduit aucun ancien
runtime :

1. conserver `CATALOG_RELEASED=false` ;
2. revenir au dernier bundle `.next-qa` ayant passé la matrice complète ;
3. ne restaurer ni `lib/rava-content.ts`, ni les composants
   `rava-*`, ni `public/viaire/` ;
4. si une optimisation média régresse, désactiver uniquement le
   préchargement à l'intention et conserver le registre A7 ;
5. si Stripe Express Checkout régresse sur mobile, conserver le checkout
   hébergé et retirer seulement le montage inline ;
6. si le routage linguistique régresse, préserver `/` en anglais et `/fr` en
   français sans redirection fondée sur `Accept-Language`.

La preuve minimale après rollback reste : `typecheck`, `lint`, `build:qa`,
les vérificateurs de domaine et la matrice Playwright. Un bundle qui passe les
tests mais ouvre l'indexation ou les offres avant les portes humaines est
considéré comme invalide.
