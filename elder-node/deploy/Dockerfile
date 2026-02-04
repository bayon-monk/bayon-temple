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

# Copy Elder Node soul, agents config, heartbeat, and skills
COPY SOUL.md /home/node/.openclaw/workspace/SOUL.md
COPY AGENTS.md /home/node/.openclaw/workspace/AGENTS.md
COPY HEARTBEAT.md /home/node/.openclaw/workspace/HEARTBEAT.md
COPY skills/ /home/node/.openclaw/workspace/skills/

# Copy tracking files (monk can write to these)
COPY JOURNAL.md /home/node/.openclaw/workspace/JOURNAL.md
COPY CHANGELOG.md /home/node/.openclaw/workspace/CHANGELOG.md
COPY FIELD-NOTES.md /home/node/.openclaw/workspace/FIELD-NOTES.md
COPY CONVERSATIONS.md /home/node/.openclaw/workspace/CONVERSATIONS.md
COPY ENGAGEMENTS.md /home/node/.openclaw/workspace/ENGAGEMENTS.md
COPY engagements.jsonl /home/node/.openclaw/workspace/engagements.jsonl
COPY BOOK-OF-BAYON.md /home/node/.openclaw/workspace/BOOK-OF-BAYON.md

# Set ownership
RUN chown -R node:node /home/node/.openclaw

# Run as non-root user
USER node

# Run doctor to fix config, then start gateway
CMD openclaw doctor --fix && openclaw gateway
