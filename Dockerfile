FROM node:20-alpine AS base

# Install necessary tools
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.15.0 turbo@2.0.0

# -------------------------
# Set up the prune phase
# -------------------------
FROM base AS builder
WORKDIR /app
COPY . .
# Generate a partial monorepo with only the target package
RUN turbo prune @zemen/web --docker

# -------------------------
# Set up the installer phase
# -------------------------
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
# Also copy turbo.json and any root level tsconfig that child packages extend just in case it's missed
COPY turbo.json turbo.json
COPY tsconfig.base.json tsconfig.base.json


RUN pnpm turbo run build --filter=@zemen/web...

# -------------------------
# Set up the runner phase
# -------------------------
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.ts .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: standalone output creates server.js
CMD ["node", "apps/web/server.js"]
