# A14 — Passeport produit et service long

Statut : **registre, numéro de série et lecture publique implémentés ; activation
propriétaire bloquée par H-008, H-016 et H-018**.

## Architecture

```text
pièce physique validée
  → numéro TAQA produit par le registre canonique
  → puce NFC associée par empreinte
  → passeport Supabase privé
  → lecture publique filtrée
  → entretien, réparation et transfert authentifiés
```

Le numéro inclut la famille produit, l’année, une séquence et un caractère de
contrôle. Le navigateur ne crée ni série, ni propriété, ni événement de
service.

## Livré

- contrat `ProductReferenceKit → ProductPassport` ;
- séries `TAQA-S01`, `TAQA-P02` et `TAQA-V03` vérifiables ;
- migration Supabase pour passeports, réparations et transferts ;
- contraintes de catalogue, unicité, clés étrangères et RLS ;
- lecture publique filtrée, sans identité propriétaire ;
- exclusion des brouillons ;
- route courte NFC `/p/[serial]` ;
- page publique `/passport/[serial]` non indexée avant libération ;
- historique public de réparation séparé des notes internes ;
- vérificateur de série et d’unicité ;
- contrats Zod d’activation, transfert et récupération ;
- secret d’activation HMAC et comparaison en temps constant ;
- tables de challenge à usage unique et journal owner append-only sous RLS ;
- export propriétaire versionné sans secret NFC, token ni note interne ;
- porte statique `enabled=false` impossible à contourner par une simple env.

## Limites volontaires

L’espace propriétaire n’est pas simulé avec un secret dans l’URL ou un token
maison. Il exige une identité authentifiée, une politique de transfert et une
procédure de récupération validées. Les migrations ne définissent
volontairement aucune policy client avant le choix du fournisseur d’identité.
Aucun passeport n’est activé avant la fabrication et l’association NFC réelles.

## Preuves

```text
npm run passports:verify
npm run typecheck
npm run lint
```
