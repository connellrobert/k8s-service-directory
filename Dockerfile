# Use Node.js LTS version
FROM node:22-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Create directory for service configuration
RUN mkdir -p /etc/service-directory

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"] 