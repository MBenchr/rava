# RAVA Éditions — V2 Next.js

Rebuild complet de la landing page `Cabinet Mura` en `Next.js 16 + TypeScript + Tailwind 4`.

## Stack

- `app/` : App Router, pages statiques et routes API
- `components/` : sections UI et éditeur de placement
- `lib/` : contenu typé, projection OpenAI, adapter Resend, JSON-LD
- `public/rava-v2/` : 11 visuels source, dérivés webp et crops éditoriaux
- `legacy-static/` : archive du prototype HTML/CSS/JS précédent

## Démarrer

```bash
cd /Users/mohyi/CHATGPT/rava-editions-site
npm install
npm run dev
```

Puis ouvrir `http://127.0.0.1:3000`.

## Variables d’environnement utiles

- `OPENAI_API_KEY` : active `POST /api/projection`
- `RESEND_API_KEY` : active `POST /api/estimate`
- `RESEND_FROM` : expéditeur email optionnel
- `NEXT_PUBLIC_SITE_URL` : URL canonique optionnelle

Sans `OPENAI_API_KEY` ou `RESEND_API_KEY`, l’UI affiche une erreur explicite et ne simule pas de succès.
