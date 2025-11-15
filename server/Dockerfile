# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install only what's needed to build
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:18-alpine

# Set memory cap (in MB)
ENV NODE_OPTIONS="--max-old-space-size=512"

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled output from the build stage
COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 5000

# Start app
CMD ["node", "dist/index.js"]
