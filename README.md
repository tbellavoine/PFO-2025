# PFO2025

Portfolio personnel de Thomas BELLAVOINE. Monorepo :

- [`front/`](front/README.md) — application Angular (portfolio public, statique/prerendu).
- `back/` — API NestJS (contenu dynamique, console d'admin). Voir [`docs/plan-dynamic-backend.md`](docs/plan-dynamic-backend.md) pour l'architecture.

## Installation

Gestionnaire de paquets : [pnpm](https://pnpm.io) (workspace à la racine, un seul lockfile pour `back/` et `front/`).

```bash
corepack enable   # une fois, pour que pnpm utilise la version épinglée dans package.json
pnpm install
```

- `pnpm --filter back <script>` / `pnpm --filter front <script>` — lance un script d'un seul package.
- `pnpm -r lint` / `pnpm -r build` / `pnpm -r test` — lance un script dans tous les packages.

### Réseau GRDF : 404 sur @fortawesome

Sur le réseau interne, le registre scope `@fortawesome` (`grdf-npm-fontawesome` dans le
`.npmrc` utilisateur) ne sert pas tous les tarballs des paquets gratuits FontAwesome et
peut renvoyer des 404 sur `pnpm install`. Si ça arrive, pointer temporairement ce scope
vers le miroir npmjs qui fonctionne, dans **votre** `.npmrc` utilisateur (`~/.npmrc`), pas
dans celui du projet (ça casserait la CI, qui n'a pas cette config) :

```
@fortawesome:registry=https://artifactory.cloud-grdf.fr/artifactory/api/npm/grdf-npm-npmjs/
```

Une fois l'install passée, le store local pnpm garde les paquets en cache : la ligne peut
être retirée ensuite.

## Documentation

- [Plan contenu dynamique / admin / backend](docs/plan-dynamic-backend.md)
