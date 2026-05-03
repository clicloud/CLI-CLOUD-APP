import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("BOT_TOKEN", "your_bot_token_here")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Hey! I'm running on CLI. 🚀\n\n"
        "Send me any message and I'll echo it back.\n"
        "Use /help to see what I can do."
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "/start — Welcome message\n"
        "/help — This message\n"
        "/status — Bot status\n"
        "Any other text — Echo reply"
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    import platform
    await update.message.reply_text(
        f"Bot is running on CLI ✅\n"
        f"Python: {platform.python_version()}\n"
        f"Host: container"
    )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"You said: {update.message.text}")

def main():
    if BOT_TOKEN == "your_bot_token_here":
        logger.error("BOT_TOKEN not set! Set it in your CLI container environment variables.")
        return

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    logger.info("Bot starting — deployed on CLI")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
