# ⚡ Быстрая справка (TL;DR)

## За 10 минут от нулевого IP к GitHub Pages

### Шаг 1: GitHub Pages репозиторий
```bash
# Создай на https://github.com/new репозиторий:
# Имя: USERNAME.github.io (замени USERNAME)
# Visibility: Public

cd /home/kacher/Projects/Project
git init
git config user.email "ты@example.com"
git config user.name "Твоё имя"
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git add .
git commit -m "Initial"
git branch -M main
git push -u origin main
```

### Шаг 2: Ngrok туннель
```bash
# На сервере
ssh -p 1124 root@144.31.68.248
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
unzip ngrok-v3-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin/

# Запусти
ngrok http 3000 --region eu

# Скопируй URL вида: https://xxxx-xxxx-xxxx.eu.ngrok.io
```

### Шаг 3: Обнови API URL
```bash
# На локальной машине
cd /home/kacher/Projects/Project/frontend

# Замени xxxx на свой ngrok URL
echo 'VITE_API_URL=https://xxxx-xxxx-xxxx.eu.ngrok.io/api' > .env.production.local

npm run build
cd ..
git add .
git commit -m "Add API URL"
git push
```

### Шаг 4: Готово!
- Фронтенд: **https://USERNAME.github.io**
- API: **https://xxxx-xxxx-xxxx.eu.ngrok.io/api**
- IP сервера: 🔒 **СКРЫТ**

---

## Изменение времени активации

**Файл**: `frontend/src/pages/SuccessPage.vue` (строка ~70)

```javascript
activationDateTime: '2025-12-10 08:00:00',  // Измени на своё время
```

Формат: `YYYY-MM-DD HH:mm:ss` в часовом поясе **Yekaterinburg (UTC+5)**

Затем пересобери и загрузи:
```bash
npm run build && git add . && git commit -m "Update time" && git push
```

---

## Проверка что всё работает

1. Открой https://USERNAME.github.io в браузере
2. Откройи DevTools (F12) → Console
3. Должны быть логи про часовой пояс
4. После времени активации - введи имя и нажми кнопку
5. Должна отправиться на API через Ngrok

---

## Если что-то сломалось

| Что сломалось | Что делать |
|---|---|
| 404 на GitHub Pages | Проверь Settings → Pages на GitHub |
| API недоступен | Проверь что контейнер запущен: `docker ps` |
| CORS ошибка | Проверь что Ngrok URL правильный в `.env.production.local` |
| Ngrok заблокирован | Используй Cloudflare Tunnel вместо Ngrok |

---

## Документация

- **Полная инструкция**: `DEPLOYMENT_GUIDE.md`
- **Объяснение часовых поясов**: `TIMEZONE_EXPLANATION.md`
- **GitHub Pages setup**: `GITHUB_PAGES_SETUP.md`
- **Быстрый старт**: `QUICK_START_GITHUB_PAGES.md`
