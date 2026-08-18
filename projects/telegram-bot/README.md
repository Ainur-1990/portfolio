# Telegram-бот записи в барбершоп

Демо-бот для малого бизнеса: клиент выбирает услугу, мастера, день и время через inline-кнопки, получает подтверждение.

## Стек

- Node.js 18+
- [grammY](https://grammy.dev) — фреймворк для Telegram Bot API

## Запуск

1. Получи токен у [@BotFather](https://t.me/BotFather): команда `/newbot`, следуй инструкциям
2. Установи зависимости и запусти:

```bash
npm install
BOT_TOKEN=твой_токен npm start
```

В Windows PowerShell: `$env:BOT_TOKEN="токен"; npm start`
В Git Bash: `export BOT_TOKEN=токен && npm start`

## Команды бота

- `/start` — начать запись
- `/bookings` — мои записи
- `/cancel` — отменить запись

## Что можно добавить

- Реальную БД (SQLite/Postgres) вместо in-memory
- Напоминания за час до визита
- Приём оплаты
