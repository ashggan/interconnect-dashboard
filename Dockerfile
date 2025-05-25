# Debug version to identify the issue
FROM node:18-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Debug: Check if files exist
RUN echo "=== Checking workspace ==="
RUN ls -la /app/

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Debug: Check copied files
RUN echo "=== Files after copy ==="
RUN ls -la /app/
RUN echo "=== Package.json content ==="
RUN cat package.json

# Install dependencies with verbose output
RUN echo "=== Installing dependencies ==="
RUN pnpm install --frozen-lockfile --reporter=append-only || \
    (echo "Frozen lockfile failed, trying without..." && pnpm install --reporter=append-only)

# Debug: Check if node_modules was created
RUN echo "=== Checking node_modules ==="
RUN ls -la /app/
RUN ls -la /app/node_modules/ | head -20

# Continue with builder stage
FROM node:18-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Final stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"