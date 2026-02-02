# Elder Node - Fly.io Deployment

Deploy an Elder Node to Fly.io using open models. Isolated, cheap, no ban risk.

## Why This Setup?

| Concern | Solution |
|---------|----------|
| **Ban risk** | Uses open models (Llama, Mixtral) not Claude/GPT |
| **Security** | Runs in isolated cloud VM, not your computer |
| **Cost** | ~$6-10/mo hosting + ~$5-20/mo API (vs $50-100+ for closed models) |
| **Always on** | Fly.io keeps it running 24/7 |

## Prerequisites

1. **Fly.io account** — [Sign up free](https://fly.io)
2. **flyctl installed:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
3. **API key from ONE of:**
   - [Together.ai](https://together.ai) — Recommended, good quality
   - [Groq](https://groq.com) — Has free tier
   - [Fireworks.ai](https://fireworks.ai) — Good balance

## Quick Deploy

```bash
cd elder-node/deploy
./deploy.sh
```

The script will:
1. Log you into Fly.io
2. Create the app
3. Ask for your API key
4. Optionally configure Telegram/Discord
5. Deploy

## Manual Deploy

If you prefer manual steps:

```bash
# 1. Login to Fly.io
flyctl auth login

# 2. Create app
flyctl apps create elder-node

# 3. Set secrets (choose your provider)
flyctl secrets set TOGETHER_API_KEY=your_key_here

# Or for Groq:
# flyctl secrets set GROQ_API_KEY=your_key_here

# 4. Deploy
flyctl deploy
```

## Model Options

Edit `openclaw.json` to change models:

### Together.ai (Recommended)
```json
"model": "together/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
```
- ~$0.88/M tokens
- Excellent quality
- Reliable

### Groq (Free Tier)
```json
"model": "groq/llama-3.1-70b-versatile"
```
- Free tier: 14,400 requests/day
- Very fast inference
- Good for testing

### Fireworks.ai
```json
"model": "fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct"
```
- ~$0.90/M tokens
- Good quality
- Reliable

### Mixtral (Cheaper)
```json
"model": "together/mistralai/Mixtral-8x7B-Instruct-v0.1"
```
- ~$0.60/M tokens
- Slightly lower quality
- More affordable

## Connecting to Moltbook

Moltbook uses OpenClaw agents. Connect via:

### Option 1: Telegram Bridge
1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Add token to secrets: `flyctl secrets set TELEGRAM_BOT_TOKEN=your_token`
3. Connect your Moltbook agent to the Telegram bot

### Option 2: Discord Bridge
1. Create a Discord bot at [Discord Developer Portal](https://discord.com/developers)
2. Add token to secrets: `flyctl secrets set DISCORD_BOT_TOKEN=your_token`
3. Invite bot to your server

### Option 3: Direct API (Advanced)
If Moltbook exposes an API, configure in `openclaw.json`:
```json
"channels": {
  "moltbook": {
    "type": "webhook",
    "url": "https://moltbook.com/api/v1/...",
    "token": "${MOLTBOOK_TOKEN}"
  }
}
```

## Cost Estimation

| Component | Monthly Cost |
|-----------|--------------|
| Fly.io VM (512MB) | ~$7 |
| Together.ai (moderate use) | ~$10-20 |
| **Total** | **~$17-27** |

Compare to using Claude Opus directly: $50-150+/mo

## Monitoring

```bash
# Check status
flyctl status

# View logs
flyctl logs

# SSH into container
flyctl ssh console

# Scale up if needed
flyctl scale memory 1024
```

## Spending Limits

The `openclaw.json` includes a daily spend cap:
```json
"limits": {
  "max_daily_spend_usd": 5.00
}
```

Adjust as needed. This prevents runaway costs if the agent gets busy.

## Security Notes

- ✅ Runs in isolated VM (not your computer)
- ✅ Secrets stored encrypted in Fly.io
- ✅ Sandbox mode restricts filesystem/system access
- ✅ No access to your personal accounts
- ⚠️ Still uses OpenClaw — monitor for prompt injection
- ⚠️ Use dedicated/throwaway API keys with spend limits

## Updating

To update the Elder Node:

```bash
# Pull latest
git pull

# Redeploy
cd elder-node/deploy
flyctl deploy
```

## Destroying

If you need to tear it down:

```bash
flyctl apps destroy elder-node
```

This removes everything — VM, secrets, all data.

## Files

```
deploy/
├── Dockerfile       # Container definition
├── fly.toml         # Fly.io configuration
├── openclaw.json    # OpenClaw + model config
├── deploy.sh        # One-command deployment
├── SOUL.md          # Elder Node personality
└── skills/          # E-Score, Council, Reflect
    ├── escore/
    ├── council/
    └── reflect/
```

## Troubleshooting

**App won't start:**
```bash
flyctl logs  # Check for errors
flyctl ssh console  # Debug inside container
```

**API key issues:**
```bash
flyctl secrets list  # Verify secrets are set
flyctl secrets set TOGETHER_API_KEY=new_key  # Update
```

**Out of memory:**
```bash
flyctl scale memory 1024  # Increase to 1GB
```

**High costs:**
- Check `max_daily_spend_usd` in openclaw.json
- Review logs for unusual activity
- Consider using Groq's free tier for testing

---

*"Hold the mirror. Don't dictate what's seen in it."*
