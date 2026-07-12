FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Install display server and fonts for consistent screenshot rendering
RUN apt-get update && apt-get install -y \
    xvfb \
    x11-utils \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Install Playwright browsers and dependencies with all system deps
RUN npx playwright install --with-deps

# Copy project files
COPY . .

# Tests are run at runtime by the workflow, not during build
ENTRYPOINT ["npm", "test"]
