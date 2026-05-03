# Chat Bot Starter — Telegram Bot

Working Telegram bot that responds to messages. Deploys as a persistent process — something CLI does that Vercel can't.

## Deploy on CLI

1. Create a bot via [@BotFather](https://t.me/BotFather) and get your token
2. Fork or clone this repo
3. In CLI dashboard: New Deployment → Select Repo → Set env var `BOT_TOKEN` → Deploy
4. Message your bot on Telegram

## Features

- `/start` — Welcome message
- `/help` — Available commands
- `/status` — Bot runtime info
- Echo — Replies to any text message

## What to build next

- **Trading bot** — Add DEX price feeds and swap execution
- **Community mod bot** — Auto-moderate Telegram groups
- **AI assistant** — Connect to an LLM for conversational replies

## Tech stack

- python-telegram-bot 21
- Python 3.11
- Long-running process (no HTTP port needed)
