# VIAIRE

International storefront and exact product-projection engine for VIAIRE.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Three.js for offline metric reference-kit generation only
- Stripe Checkout
- OpenAI image integration

## Canonical Assets

- `assets/viaire-visuals-source/final/`: complete coherent source photographs for every product and finish
- `public/viaire/`: optimized storefront images generated from the new masters
- `modules/projection/core/reference-kits.data.json`: canonical product dimensions and openings
- `public/projection-kits/`: exact GLB, USDZ and identity-board outputs

The storefront must not read images from any legacy RAVA, MURA or TRAVERSÉE directory.

## Commands

```bash
npm install
npm run assets:storefront
npm run projection:kits
npm run dev
```

Validation:

```bash
npm run lint
npm run typecheck
npm run projection:verify
npm run build
```

## Environment

Runtime secrets are loaded from the environment. Required integrations use:

- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `NEXT_PUBLIC_SITE_URL`

Stripe Tax also requires a real business address. Define:

- `STRIPE_TAX_HEAD_OFFICE_LINE1`
- `STRIPE_TAX_HEAD_OFFICE_CITY`
- `STRIPE_TAX_HEAD_OFFICE_POSTAL_CODE`
- `STRIPE_TAX_HEAD_OFFICE_COUNTRY`
- `STRIPE_TAX_HEAD_OFFICE_LINE2` (optional)
- `STRIPE_TAX_HEAD_OFFICE_STATE` (optional)
- `STRIPE_TAX_CODE_FURNITURE` (optional)

Then configure the active Stripe mode without exposing the address:

```bash
npm run stripe:tax:configure
```

Stripe must have Apple Pay, Google Pay, Link, PayPal and Klarna enabled for the
relevant countries. Stripe only displays methods supported by the current
browser, currency, country and customer eligibility. Register the final HTTPS
domain in both Stripe test mode and live mode.

The projection route deliberately fails instead of returning an unverified
image when the OpenAI account has no image-generation credit or when the
geometry quality gate rejects the result.

## Markets

The storefront exposes 30 curated delivery markets. Product prices use fixed,
rounded commercial anchors per market, derived from the canonical EUR catalog
but protected from exchange-rate drift. For example, the EUR 3,000 base piece
is CHF 3,000 in Switzerland. Delivery remains tiered from EUR 60 to EUR 90
before local-currency rounding. Stripe Checkout collects the delivery address,
calculates tax and localizes payment methods.
