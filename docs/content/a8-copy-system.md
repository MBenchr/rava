# A8 — Copy deck bilingue canonique

Date : 28 juillet 2026  
Statut : livré, branché au runtime ; revue anglophone native requise avant publication

## Source de vérité

- `content/en.ts` : anglais principal ;
- `content/fr.ts` : français complet ;
- `content/schema.ts` : contrat de parité ;
- `content/index.ts` : point d'accès runtime ;
- `scripts/verify-content-system.ts` : contrôle automatique.

Le catalogue consomme ce deck. Un composant ne doit plus recréer localement une
promesse produit, une note de finition ou une règle de service.

Le header, le footer, la home, les PDP, le buy panel, le panier, le checkout,
la projection et la confirmation de commande consomment désormais ce contrat.
Les anciens tableaux de slogans locaux ont été supprimés du catalogue.

## Histoire

```text
The room continues.
Mass gives chosen objects a place.
Openings keep light, movement and conversation connected.
```

La collection suit trois gestes :

1. SEUIL s'élève et marque un passage ;
2. PORTÉE s'étire et relie deux usages ;
3. VEILLE garde près de soi les derniers objets du jour.

Le récit part toujours de la vie et de l'espace. Il n'explique jamais
l'interface et ne transforme jamais une intention industrielle en preuve.

## Règles

- anglais à `/`, français à `/fr` ;
- 45 mots maximum par bloc éditorial visible ;
- produit, usage, preuve, service et action séparés ;
- aucun faux avis, compteur, succès, presse ou rareté ;
- « imaginé/conceived in France » autorisé ;
- « made/fabriqué en France » bloqué jusqu'à H-004 ;
- « préparé sur commande » ne signifie pas « personnalisé » ;
- les dimensions VEILLE restent masquées jusqu'à H-005 ;
- la matière est décrite comme cible tant que H-009/H-010 restent ouverts.

## Couverture

- metadata et navigation ;
- home et trois produits ;
- quatre finitions ;
- buy panel, panier et checkout ;
- projection, états et erreurs ;
- service, FAQ et entretien ;
- emails transactionnels ;
- presse et prescripteurs ;
- erreurs et glossaire.

## Preuve

```bash
npm run content:verify
```

Le test contrôle `242` champs par langue, la parité des structures, la
couverture produit/finition, les limites de longueur, les anciens noms et les
allégations interdites.
