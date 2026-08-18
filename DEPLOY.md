# Публикация портфолио

## 1. GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Портфолио: 4 демо-проекта + сайт"
```

Создай репозиторий на github.com (например, `portfolio`), затем:

```bash
git remote add origin https://github.com/ТВОЙ_НИК/portfolio.git
git branch -M main
git push -u origin main
```

⚠️ Перед пушем проверь, что в `.gitignore` сайта попали `node_modules/` (create-next-app его уже создал).

## 2. Сайт-портфолио на Vercel (бесплатно)

1. Зайди на [vercel.com](https://vercel.com) через GitHub-аккаунт
2. Add New → Project → выбери репозиторий `portfolio`
3. Root Directory: `site` (важно!)
4. Deploy — через минуту получишь адрес вида `portfolio-xxx.vercel.app`

Перед деплоем замени плейсхолдеры в `site/app/layout.tsx`, `page.tsx` и `projects/[slug]/page.tsx`:
- «Имя Фамилия» → твоё имя
- `https://t.me/username` → твой Telegram
- `https://github.com/username` → твой GitHub

## 3. Telegram-бот

1. В Telegram найди [@BotFather](https://t.me/BotFather) → `/newbot`
2. Придумай имя и username (должен заканчиваться на `bot`)
3. Скопируй токен и запусти бота локально:

```bash
cd projects/telegram-bot
npm install
export BOT_TOKEN="твой_токен" && npm start
```

4. Открой бота в Telegram, нажми Start, пройди сценарий записи

Чтобы бот работал 24/7, нужен VPS (от ~200 ₽/мес) — для демо достаточно запускать локально и записывать скринкаст.

## 4. Демо статических проектов

Лендинг, магазин и дашборд можно тоже показать онлайн через GitHub Pages:

1. Отдельный репозиторий или ветка `gh-pages` с файлами проекта
2. Settings → Pages → Source: эта ветка
3. Ссылка вида `username.github.io/landing`

## Чек-лист перед показом клиенту

- [ ] Заменены все плейсхолдеры имён и ссылок
- [ ] Сайт открывается на Vercel
- [ ] Бот отвечает, сценарий записи проходит до конца
- [ ] Скринкасты/GIF работы бота и дашборда (для сайта-витрины)
- [ ] В README каждого проекта понятное описание для нетехнического клиента
