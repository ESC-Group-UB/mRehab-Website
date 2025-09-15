# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN echo "📦 Installing dependencies..." \
 && npm ci \
 && echo "✅ Dependencies installed"

# Copy source and build
COPY . .
RUN echo "🚀 Building app..." \
 && npm run build \
 && echo "✅ Build finished"

# --- Production stage ---
FROM node:18-alpine AS runner
WORKDIR /app

# Install serve and curl for health/debugging
RUN npm install -g serve && apk add --no-cache curl

# Copy build output
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Add healthcheck so Coolify knows app is alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3000/ || exit 1


# Run serve with debug logs
CMD ["serve", "-s", "build", "-l", "0.0.0.0:3000", "--debug"]
