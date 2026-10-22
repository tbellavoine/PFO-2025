# syntax=docker/dockerfile:1
# pnpm workspace: build with repo root as context, e.g.
#   docker build -f back/Dockerfile .

FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY back/package.json back/package.json
COPY front/package.json front/package.json
RUN pnpm install --frozen-lockfile
COPY back back
RUN pnpm --filter back run build
# Assembles an isolated, prod-only copy of back (dist + pruned node_modules)
# at /app — avoids shipping the workspace root or front's deps.
RUN pnpm --filter back deploy --prod --legacy /app

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Mount a persistent volume here in production — project preview images
# live on local disk (decision: no S3-compatible bucket), not in the DB.
VOLUME ["/app/uploads"]

EXPOSE 3000
CMD ["node", "dist/main.js"]
