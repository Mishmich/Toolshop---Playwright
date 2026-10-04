# Used only for local baseline-screenshot generation (scripts/generate-snapshots.mjs).
# CI runs tests directly against the mcr.microsoft.com/playwright image in
# .github/workflows/playwright.yml, installing these same packages inline.
# Keep this base image tag in sync with that workflow's `container.image`.
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

# No ENTRYPOINT/CMD: generate-snapshots.mjs always passes the full command
# it wants to run (e.g. `npx playwright test tests/UI --update-snapshots`).
# An ENTRYPOINT here would have `docker run` APPEND that command to it
# instead of replacing it (e.g. `npm test npx playwright test ...`), which
# npm silently mangles into a plain `npm test` run with no update flag.
