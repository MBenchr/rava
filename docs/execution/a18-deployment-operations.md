# A18 — Déploiement et exploitation

Date : 29 juillet 2026  
Statut : `LOCAL PREPARED / REMOTE BLOCKED`

## Livré localement

- Blueprint Render canonique, sans auto-déploiement ;
- catalogue et stockage volatil fermés par défaut ;
- endpoint `/api/health` sans fuite de secrets ;
- deux migrations Supabase versionnées ;
- inventaire des variables ;
- ordre de preview, recette et release ;
- runbooks commande, données, remboursement, monitoring et rollback ;
- contrat automatique `npm run deployment:verify`.

## Non exécuté

- création ou mutation du service Render ;
- push Git ;
- domaine et HTTPS ;
- secrets distants ;
- webhook Stripe live ;
- projet et sauvegardes Supabase ;
- alertes et observabilité ;
- bascule `CATALOG_RELEASED=true`.

Ces actions dépendent de H-001 à H-020 et doivent rester séquencées par
`docs/operations/deployment-readiness.md`.

## Preuves

```text
npm run deployment:verify
npm run build:qa
curl http://127.0.0.1:3012/api/health
```

La release publique ne peut commencer que lorsque le registre des blocages
contient les preuves réelles correspondantes.
