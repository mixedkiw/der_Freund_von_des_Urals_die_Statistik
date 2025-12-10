# Multistage build для оптимизации размера образа
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Финальный образ
FROM node:18-alpine

WORKDIR /app

# Устанавливаем dumb-init для правильной обработки сигналов
RUN apk add --no-cache dumb-init

# Копируем установленные зависимости из builder
COPY --from=builder /app/node_modules ./node_modules

# Копируем исходный код
COPY package*.json ./
COPY src ./src
COPY .env ./.env

# Создаём директорию для database
RUN mkdir -p /app/data

# Устанавливаем права на выполнение
RUN chmod +x /app/src/index.js || true

# Переводим database в /app/data для сохранения данных между перезагрузками
ENV DB_STORAGE=/app/data/database.sqlite

# Exposing port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/status', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Используем dumb-init для запуска приложения
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
