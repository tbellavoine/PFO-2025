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
pnpm install
pnpm run migration:run
pnpm run seed            # importe le contenu actuel de front/ (idempotent, sûr à relancer)
pnpm run start:dev
```

- API : http://localhost:3000/v1/...
- Documentation Swagger (hors production) : http://localhost:3000/api/docs

## Scripts

| Commande | Effet |
|---|---|
| `pnpm run start:dev` | serveur en mode watch |
| `pnpm run build` | compilation TypeScript (`dist/`) |
| `pnpm run lint` | oxlint |
| `pnpm test` | tests unitaires (Vitest) |
| `pnpm run test:e2e` | tests e2e (nécessite Postgres) |
| `pnpm run migration:generate -- src/migrations/Nom` | génère une migration à partir des entités |
| `pnpm run migration:run` | applique les migrations en attente |
| `pnpm run migration:revert` | annule la dernière migration |
| `pnpm run seed` | importe/synchronise le contenu depuis front/ (idempotent) |

## Migrations

Le schéma ne passe jamais par `synchronize: true`, même en développement — uniquement par des migrations versionnées dans `src/migrations/`, pour que ce qui est testé en local soit exactement ce qui s'applique en production.
