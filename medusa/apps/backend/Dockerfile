# syntax=docker/dockerfile:1

# node:22-alpine (musl libc) can hang during Medusa's full module bootstrap —
# musl's getaddrinfo has known issues with the concurrent DNS lookups Medusa
# does while loading ~20+ modules, observed as `medusa db:migrate` never
# reaching the database no matter how long the connection timeout is set.
# node:22-bookworm-slim (glibc) does not have this problem.
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Install the whole workspace so the backend's local deps resolve, then
# build only the backend.
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm ci --workspace=@dtc/backend --include-workspace-root

COPY apps/backend apps/backend
WORKDIR /app/apps/backend
RUN npm run build

# `medusa build` emits a self-contained app in .medusa/server with its own
# package.json — install its production deps there.
WORKDIR /app/apps/backend/.medusa/server
RUN npm install --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd -r medusa && useradd -r -g medusa medusa
COPY --from=build --chown=medusa:medusa /app/apps/backend/.medusa/server /app

USER medusa
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
