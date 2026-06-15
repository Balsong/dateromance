# 💕 Date Invitation

Персональный сайт-приглашение на свидание с интеграцией Telegram-бота.

## Как работает

1. Открываешь сайт — видишь вопрос "Пойдёшь со мной на свидание?"
2. Кнопка "Нет" убегает от курсора и не даёт нажать на неё
3. После "Да" — выбор активности, даты и времени (19:00–22:30)
4. Ответ сразу приходит в Telegram

## Запуск

```bash
npm install
npm run dev
```

## Telegram-бот

Создай файл `.env.local` в корне проекта:

```
VITE_TELEGRAM_BOT_TOKEN=твой_токен
VITE_TELEGRAM_CHAT_ID=твой_chat_id
```

**Как получить токен:** напиши `@BotFather` в Telegram → `/newbot`

**Как получить chat_id:** напиши своему боту любое сообщение, затем открой:
`https://api.telegram.org/bot<ТОКЕН>/getUpdates` — найди `"chat":{"id": ...}`

## Стек

- React + Vite
- Tailwind CSS
- Telegram Bot API

## Основа

За основу взят проект [Anish Biswas (Xeven777)](https://github.com/Xeven777/valentine) — оригинальная идея с кнопкой "Will you be my Valentine?" и анимациями.

- кнопка "Нет" убегает от курсора вместо простого изменения текста
- пошаговое меню после "Да": выбор активности, даты и времени
- интеграция с Telegram-ботом — ответ приходит в личку
- деплой на GitHub Pages через GitHub Actions
