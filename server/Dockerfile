# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Run the compiled JavaScript file
CMD ["node", "dist/index.js"]
