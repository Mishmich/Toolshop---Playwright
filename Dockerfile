FROM mcr.microsoft.com/playwright:v1.48.1-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./


# Install npm dependencies
RUN npm ci

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Update snapshots
RUN npx playwright test tests/UI --update-snapshots


# Copy project files
COPY . .

ENTRYPOINT ["npm", "test"]
