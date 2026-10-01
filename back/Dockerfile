# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

# Mount a persistent volume here in production — project preview images
# live on local disk (decision: no S3-compatible bucket), not in the DB.
VOLUME ["/app/uploads"]

EXPOSE 3000
CMD ["node", "dist/main.js"]
