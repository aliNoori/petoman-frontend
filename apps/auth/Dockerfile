FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/auth/package.json ./packages/auth/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY apps/auth/package.json ./apps/auth/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/auth ./apps/auth

# Build the application
RUN pnpm --filter auth build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter", "auth", "preview", "--host", "0.0.0.0", "--port", "3000"]
