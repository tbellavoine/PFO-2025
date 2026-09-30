# PFO2025 — back

API NestJS servant le contenu dynamique du portfolio et la console d'admin (dossier `back/` du monorepo — voir le [README racine](../README.md) et [le plan complet](../docs/plan-dynamic-backend.md)).

## Stack

NestJS 12 (ESM), TypeORM 1.x + PostgreSQL, Vitest, oxlint. Voir `docs/plan-dynamic-backend.md` pour le détail des décisions (hébergement Supabase, stockage média sur disque, modèle de compétences unifié, etc.).

## Développement local

Nécessite un Postgres accessible (docker recommandé) :

```bash
docker run -d --name pfo2025-pg-dev \
  -e POSTGRES_USER=pfo -e POSTGRES_PASSWORD=pfo_dev_password -e POSTGRES_DB=pfo2025 \
  -p 55432:5432 postgres:17-alpine
```

```bash
cp .env.example .env   # ajuster si besoin ; ADMIN_PASSWORD_HASH doit être généré, voir le commentaire dans le fichier
npm ci
npm run migration:run
npm run seed            # importe le contenu actuel de front/ (idempotent, sûr à relancer)
npm run start:dev
```

- API : http://localhost:3000/v1/...
- Documentation Swagger (hors production) : http://localhost:3000/api/docs

## Scripts

| Commande | Effet |
|---|---|
| `npm run start:dev` | serveur en mode watch |
| `npm run build` | compilation TypeScript (`dist/`) |
| `npm run lint` | oxlint |
| `npm test` | tests unitaires (Vitest) |
| `npm run test:e2e` | tests e2e (nécessite Postgres) |
| `npm run migration:generate -- src/migrations/Nom` | génère une migration à partir des entités |
| `npm run migration:run` | applique les migrations en attente |
| `npm run migration:revert` | annule la dernière migration |
| `npm run seed` | importe/synchronise le contenu depuis front/ (idempotent) |

## Migrations

Le schéma ne passe jamais par `synchronize: true`, même en développement — uniquement par des migrations versionnées dans `src/migrations/`, pour que ce qui est testé en local soit exactement ce qui s'applique en production.
