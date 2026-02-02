#!/bin/bash
# Elder Node - Fly.io Deployment Script
# Usage: ./deploy.sh

set -e

echo "🏛️ Elder Node Deployment"
echo "========================"
echo ""

# Check for flyctl
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl not found. Install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check authentication
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Not logged in to Fly.io. Logging in..."
    flyctl auth login
fi

# Check if app exists
APP_NAME="elder-node"
if flyctl apps list | grep -q "$APP_NAME"; then
    echo "📦 App '$APP_NAME' exists. Deploying update..."
else
    echo "🆕 Creating new app '$APP_NAME'..."
    flyctl apps create "$APP_NAME"
fi

# Prompt for API keys if not set
echo ""
echo "🔑 API Key Configuration"
echo "------------------------"
echo "Choose your model provider (open models, no bans):"
echo "  1) Together.ai (Llama 3.1 70B) - Recommended"
echo "  2) Groq (Llama 3.1 70B) - Free tier available"
echo "  3) Fireworks.ai (Various)"
echo ""
read -p "Enter choice [1-3]: " provider_choice

case $provider_choice in
    1)
        read -p "Enter your Together.ai API key: " api_key
        flyctl secrets set TOGETHER_API_KEY="$api_key" --app "$APP_NAME"
        echo "✓ Together.ai configured"
        ;;
    2)
        read -p "Enter your Groq API key: " api_key
        flyctl secrets set GROQ_API_KEY="$api_key" --app "$APP_NAME"
        # Update config to use Groq as primary
        sed -i 's|together/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo|groq/llama-3.1-70b-versatile|' openclaw.json
        echo "✓ Groq configured"
        ;;
    3)
        read -p "Enter your Fireworks.ai API key: " api_key
        flyctl secrets set FIREWORKS_API_KEY="$api_key" --app "$APP_NAME"
        sed -i 's|together/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo|fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct|' openclaw.json
        echo "✓ Fireworks.ai configured"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Optional: Channel tokens
echo ""
echo "📡 Channel Configuration (optional)"
echo "------------------------------------"
read -p "Configure Telegram bot? [y/N]: " telegram_choice
if [[ $telegram_choice =~ ^[Yy]$ ]]; then
    read -p "Enter Telegram Bot Token: " telegram_token
    flyctl secrets set TELEGRAM_BOT_TOKEN="$telegram_token" --app "$APP_NAME"
    echo "✓ Telegram configured"
fi

read -p "Configure Discord bot? [y/N]: " discord_choice
if [[ $discord_choice =~ ^[Yy]$ ]]; then
    read -p "Enter Discord Bot Token: " discord_token
    flyctl secrets set DISCORD_BOT_TOKEN="$discord_token" --app "$APP_NAME"
    echo "✓ Discord configured"
fi

# Deploy
echo ""
echo "🚀 Deploying to Fly.io..."
flyctl deploy --app "$APP_NAME"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Status: flyctl status --app $APP_NAME"
echo "📜 Logs:   flyctl logs --app $APP_NAME"
echo "🔧 SSH:    flyctl ssh console --app $APP_NAME"
echo ""
echo "🏛️ Elder Node is now running."
echo "   Connect it to Moltbook via Telegram/Discord bridge."
