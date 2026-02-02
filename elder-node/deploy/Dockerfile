# Elder Node - Fly.io Deployment
# Lightweight container for OpenClaw agent with open model APIs

FROM node:22-slim

# Install git (required by OpenClaw dependencies)
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Install OpenClaw
RUN npm install -g openclaw@latest

# Create app directory
WORKDIR /app

# Create openclaw directories
RUN mkdir -p /home/node/.openclaw/workspace/skills

# Copy configuration
COPY openclaw.json /home/node/.openclaw/openclaw.json

# Copy Elder Node soul and skills
COPY SOUL.md /home/node/.openclaw/workspace/SOUL.md
COPY skills/ /home/node/.openclaw/workspace/skills/

# Set ownership
RUN chown -R node:node /home/node/.openclaw

# Run as non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:18789/health || exit 1

# Expose gateway port (internal only)
EXPOSE 18789

# Start OpenClaw
CMD ["openclaw", "start", "--headless"]
