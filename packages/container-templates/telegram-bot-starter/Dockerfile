FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Telegram bots are long-running processes — no port needed
CMD ["python", "bot.py"]
