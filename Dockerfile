FROM node:lts

WORKDIR /app

# Install system dependencies for Playwright and Python
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  python3-venv \
  python3-pip \
  libnss3 \
  libnspr4 \
  libdbus-1-3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libgbm1 \
  libxrandr2 \
  libxinerama1 \
  libxi6 \
  libxext6 \
  libxfixes3 \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy project files
COPY . .

ENTRYPOINT ["npm", "test"]
