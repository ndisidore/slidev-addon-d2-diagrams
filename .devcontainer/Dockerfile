FROM mcr.microsoft.com/devcontainers/base:trixie

# Install Node.js 20.x (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install D2 CLI
RUN curl -fsSL https://d2lang.com/install.sh | sh

# Install additional development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g \
    @slidev/cli \
    typescript \
    eslint \
    prettier

# Set working directory
WORKDIR /workspace

# Set environment variables
ENV PATH="/root/.local/bin:${PATH}"
ENV NODE_ENV=development
