# --- Stage 1: Build & Dependencies ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Configure npm for corporate proxies & networks
RUN npm config set strict-ssl false

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Next.js standalone bundle using local binary
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN ./node_modules/.bin/next build

# --- Stage 2: Minimal Production Runner ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Run as non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy static assets & standalone bundle
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
