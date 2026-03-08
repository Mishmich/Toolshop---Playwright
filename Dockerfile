FROM mcr.microsoft.com/playwright:v1.56.1-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install

# Copy project files
COPY . .

# Set environment to skip browser download in container
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

ENTRYPOINT ["npm", "test"]
