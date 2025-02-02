# Use an official Node.js image
FROM node:18.20.6

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN corepack enable && pnpm install --frozen-lockfile

# Install Chromium (for Puppeteer or Playwright)
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application files
COPY . .

# Expose the server port
EXPOSE 8080

# Command to start the server
CMD ["pnpm", "start"]
