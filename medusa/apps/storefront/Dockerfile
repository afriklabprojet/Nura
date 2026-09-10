# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/storefront/package.json apps/storefront/package.json
RUN npm ci --workspace=@dtc/storefront --include-workspace-root

COPY apps/storefront apps/storefront
WORKDIR /app/apps/storefront

# NEXT_PUBLIC_* values are baked into the client bundle at build time, so
# they must be passed as build args, not just runtime env vars.
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=fr
ARG NEXT_PUBLIC_STRIPE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION \
    NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY

RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8000 HOSTNAME=0.0.0.0

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/apps/storefront/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=build --chown=nextjs:nextjs /app/apps/storefront/public ./apps/storefront/public

USER nextjs
EXPOSE 8000

CMD ["node", "apps/storefront/server.js"]
