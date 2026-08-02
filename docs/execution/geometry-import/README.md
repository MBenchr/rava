# Import contrôlé de la géométrie VEILLE 03

Ce formulaire prépare H-005 sans autoriser une cote inventée.

## Procédure

1. Dupliquer `veille-03-input.template.json`.
2. Reporter uniquement les valeurs du plan fabricant signé.
3. Passer `status` à `approved-manufacturer-drawing`.
4. Renseigner les dimensions externes, l'épaisseur, le socle et exactement deux
   ouvertures `upper` et `lower`.
5. Renseigner l'approbateur, la date ISO et le SHA-256 du plan signé.
6. Exécuter `npm run geometry:import -- chemin/vers/le-fichier.json`.
7. Faire relire le rapport dans `output/geometry/` avant toute mutation du
   manifeste canonique.

Le script ne modifie jamais `geometry.data.json`. Cette séparation impose une
revue humaine et une nouvelle version du kit avant publication.
