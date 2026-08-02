# Préparation au déploiement

Date : 2 août 2026
État : `REMOTE PREVIEW CONFIGURED / PUBLIC COMMERCE GATED`

## Contrat

Le dépôt peut être construit et exécuté sur Render, mais ne doit pas être
publié comme boutique active tant que les preuves de
`docs/execution/blockers.md` ne sont pas levées. Le Blueprint maintient donc :

- `autoDeploy: false` ;
- `CATALOG_RELEASED=false` ;
- `ALLOW_VOLATILE_ORDER_STORE=false`.

Dans cet état, l'indexation, Merchant Center, les données structurées `Offer`
et le checkout live restent fermés.

## Build reproductible

```text
npm ci --include=dev
npm run build
npm run start -- --hostname 0.0.0.0 --port $PORT
```

La recette locale isolée utilise `.next-qa` afin de ne pas écraser le serveur
de développement.

## Variables obligatoires avant une recette distante

### Publiques

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `CATALOG_RELEASED=false`

### Paiement et fiscalité

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PAYMENT_METHOD_CONFIGURATION_ID`
- `STRIPE_TAX_CODE_FURNITURE`
- les variables `STRIPE_TAX_HEAD_OFFICE_*`

### Commandes et email

- `ISANDRE_DATABASE_URL`, fourni par le pooler Supabase et authentifié par le
  rôle dédié `isandre_taqa_render_login` ; la connexion reste chiffrée en mode
  libpq `require` ; passer à `verify-full` dès que le certificat CA du projet
  est monté dans le runtime ;
- `RESEND_API_KEY` et `RESEND_FROM`, ou `SENDGRID_API_KEY` et
  `SENDGRID_FROM_EMAIL` ;
- `ORDER_NOTIFICATION_EMAIL`

### Projection

- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL=gpt-image-2`

Les valeurs ne sont jamais stockées dans Git. Le rôle ṬĀQA ne possède pas la
clé service-role et ne peut ni écrire dans l'univers Eclipse, ni utiliser les
parcours de propriété encore fermés. Les preuves commerciales encore requises
sont H-011 à H-015 et H-017 à H-021 du registre des blocages.

## Ordre de mise en service

1. Lever H-001 à H-010 et libérer catalogue, claims, géométries et médias.
2. Configurer stockage, email, Stripe, Tax, transport et politiques.
3. Déployer une preview non indexée avec `CATALOG_RELEASED=false`.
4. Rejouer les contrats, les 17 parcours Playwright et les cinq profils
   performance contre la preview.
5. Tester un paiement de faible montant, un webhook dupliqué, une annulation,
   une confirmation email et une commande persistée.
6. Lever H-019 et H-020, puis seulement basculer
   `CATALOG_RELEASED=true`.
7. Déclencher un déploiement manuel et contrôler robots, sitemap, feed,
   données structurées, paiement et monitoring.

## Rollback

- remettre `CATALOG_RELEASED=false` ;
- désactiver le déploiement automatique ;
- restaurer la dernière version Render validée ;
- conserver les commandes et événements Stripe, sans rejouer un webhook déjà
  traité ;
- suivre `docs/execution/rollback.md`.

## Preuves locales

- build Next.js réussi avec endpoint de santé ;
- Playwright production : 18/18 ;
- responsive : 1440, 1280, 834, 390 et 360 px ;
- LCP ≤ 120 ms, CLS ≤ 0,015, INP ≤ 56 ms dans la recette locale ;
- contrats identité, contenu, industrie, médias, commerce, commandes,
  passeports, SEO, projection et lancement réussis ;
- trois captures pleine page et quatre PDF de travail contrôlés visuellement.

Le service Render existant est conservé sur le plan gratuit et configuré comme
preview non indexée. Le domaine canonique est `https://taqa.isandre.com` ;
`https://taka.isandre.com` reste un alias de redirection.
