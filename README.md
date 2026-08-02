# ISANDRE / ṬĀQA

Boutique internationale Next.js pour la maison ISANDRE et sa collection
ṬĀQA. Le site public est bilingue, piloté par un catalogue serveur canonique,
et prépare Stripe Checkout, la projection OpenAI, les confirmations de
commande, les passeports produit et Merchant Center sans publier de preuve ou
d'offre non validée.

## Architecture

- `lib/isandre/` : identité, catalogue, géométrie, médias, industrie et SEO.
- `content/` : deck éditorial anglais et français.
- `public/isandre/media/manifest.json` : registre des médias publiables.
- `lib/orders/` : projection canonique des commandes Stripe.
- `modules/projection/` : placement, jobs et intégration photographique OpenAI.
- `docs/execution/` : décisions, preuves de recette et blocages humains.
- `docs/research/plan-maitre-final-isandre-taqa.md` : plan directeur.

Règle d'architecture : le catalogue décide, les services calculent et les
composants rendent. Le navigateur ne fournit jamais un prix faisant autorité.

## Développement local

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3010
```

Recette de production isolée d'un éventuel serveur de développement :

```bash
npm run build:qa
npm run start:qa -- --hostname 0.0.0.0 --port 3012
```

## Validation

```bash
npm run brand:verify
npm run content:verify
npm run industrial:verify
npm run media:pilots:verify
npm run media:verify
npm run projection:verify
npm run projection:contract:verify
npm run projection:errors:verify
npm run markets:verify
npm run checkout:verify
npm run orders:verify
npm run passports:verify
npm run seo:verify
npm run launch:verify
npm run accessibility:verify
npm run typecheck
npm run lint
npm run build:qa
```

Puis, avec le serveur QA démarré sur le port `3012` :

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3012 npm run test:e2e -- --workers=1
PERFORMANCE_BASE_URL=http://127.0.0.1:3012 npm run performance:verify
QA_BASE_URL=http://127.0.0.1:3012 npm run qa:screenshots
```

Les scripts de construction média ne doivent être lancés que pour régénérer
les dérivés depuis les sources A7 approuvées :

```bash
npm run media:build
npm run media:qa:boards
```

## Variables d'environnement

Les secrets restent exclusivement côté serveur :

- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL` (optionnel, défaut `gpt-image-2`)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `SENDGRID_API_KEY` et `SENDGRID_FROM_EMAIL` peuvent remplacer Resend
- `ORDER_NOTIFICATION_EMAIL`
- `ISANDRE_DATABASE_URL` (connexion Postgres du rôle ṬĀQA à privilèges minimaux)
- `NEXT_PUBLIC_SITE_URL`

La configuration Stripe Tax utilise également :

- `STRIPE_TAX_HEAD_OFFICE_LINE1`
- `STRIPE_TAX_HEAD_OFFICE_LINE2` (optionnel)
- `STRIPE_TAX_HEAD_OFFICE_CITY`
- `STRIPE_TAX_HEAD_OFFICE_POSTAL_CODE`
- `STRIPE_TAX_HEAD_OFFICE_COUNTRY`
- `STRIPE_TAX_HEAD_OFFICE_STATE` (optionnel)
- `STRIPE_TAX_CODE_FURNITURE` (optionnel)

Le fichier `.env.example` documente les options sans contenir de secret.

## Publication

`CATALOG_RELEASED` reste désactivé tant que les portes juridiques,
industrielles, visuelles, fiscales et logistiques du registre
`docs/execution/blockers.md` ne sont pas levées. Avant libération :

- `robots.txt` bloque l'indexation ;
- le sitemap commercial est vide ;
- Merchant Center répond `404` ;
- aucune donnée structurée `Offer` n'est exposée ;
- le checkout live n'est pas présenté comme disponible.

Les routes historiques RAVA, MURA, FORME OUVERTE et VIAIRE sont uniquement des
frontières de redirection ou d'archive. Aucun ancien nom ni ancien média ne
doit être rendu dans l'interface publique canonique.

Le Blueprint `render.yaml` est préparé avec `autoDeploy: false` et
`CATALOG_RELEASED=false`. Il ne constitue pas une autorisation de publication.
La procédure et les preuves nécessaires sont détaillées dans
`docs/operations/deployment-readiness.md`.
