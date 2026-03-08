FROM node:lts-alpine

WORKDIR /app

# Install system dependencies for Playwright
RUN apk add --no-cache \
  chromium \
  firefox \
  webkit \
  tzdata

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Install Playwright browsers (already available via system packages above)
RUN npx playwright install

# Copy project files
COPY . .

# Set environment to skip browser download in container
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

ENTRYPOINT ["npm", "test"]
