# A16 — Dossier de lancement

Statut : **outil interne prêt ; diffusion externe bloquée par les portes
humaines du registre d’exécution**.

Ce dossier transforme les corpus image et marketing en outils opérationnels. Il
ne remplace ni les clearances, ni les prototypes, ni les photographies de
preuve.

## Livrables

| Fichier | Usage | Porte avant diffusion |
|---|---|---|
| `press-release-en.md` | Communiqué anglais | H-001–H-004, H-009, H-010 |
| `press-release-fr.md` | Communiqué français | H-001–H-004, H-009, H-010 |
| `press-kit-index.md` | Index des médias et faits | droits + libération asset |
| `trade-pack.md` | Architectes et prescripteurs | specs, transport, marge |
| `campaign-toolkit.md` | Film, social, paid, CRM | droits + consentement |
| `launch-calendar.md` | Séquence à gates | capacité réelle de livrer |
| `media-rights-register.csv` | Droits par asset | validation juridique |
| `contact-register.csv` | Presse et prescripteurs | base légale et opt-out |
| `campaign-test-register.csv` | Expérimentation | CMP + instrumentation |

## PDF de travail

La commande `npm run launch:pdf` génère dans `output/pdf/` :

- `isandre-press-kit-working.pdf` ;
- `isandre-trade-deck-working.pdf` ;
- `isandre-lookbook-working.pdf` ;
- `isandre-catalogue-working.pdf`.

Ces PDF portent la mention `INTERNAL PRE-RELEASE`. Ils emploient uniquement les
études numériques libérées par le pipeline A7 et signalent chaque preuve
physique, identité légale ou donnée industrielle encore à fournir. Ils ne sont
pas destinés à la diffusion avant les portes indiquées dans le registre.

## Sources canoniques

- `docs/research/cahier-images-luxe-corpus-200.md`
- `docs/research/cahier-marketing-externe-corpus-200.md`
- `docs/research/plan-maitre-final-isandre-taqa.md`
- `content/en.ts` et `content/fr.ts`
- `docs/media/a7-media-manifest.json`
- `docs/execution/blockers.md`

## Règle de publication

Une phrase émotionnelle doit rester associée à un fait. Un média inspirant ne
devient pas une preuve d’atelier, de matière, de propriété, de presse ou de
succès commercial. Les champs non établis restent absents ou explicitement
marqués comme internes.
