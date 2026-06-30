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
COPY apps/film/package.json ./apps/film/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/film ./apps/film

# Build the application
RUN pnpm --filter film build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter", "film", "preview", "--host", "0.0.0.0", "--port", "3000"]
