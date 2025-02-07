# Этап 1: Сборка фронтенда
FROM node:16 AS frontend-build

WORKDIR /app

# Копируем все файлы фронтенда
COPY Frontend ./Frontend

WORKDIR /app/Frontend

# Устанавливаем зависимости
RUN npm ci

# Собираем фронтенд
RUN npm run build

# Копируем папку images в dist после сборки
RUN mkdir -p dist/assets/images && cp -r assets/images dist/assets/

# Этап 2: Настройка финального образа
FROM node:16-alpine

# Устанавливаем nginx и необходимые утилиты
RUN apk add --no-cache nginx curl

WORKDIR /app

# Копируем собранные файлы фронтенда, включая скопированные изображения
COPY --from=frontend-build /app/Frontend/dist ./Frontend/dist

# Копируем файлы бэкенда
COPY server.js ./
COPY package*.json ./
RUN npm ci --only=production

# Копируем конфигурацию nginx и другие необходимые файлы
COPY nginx.conf /etc/nginx/nginx.conf
COPY database.sqlite ./
COPY promoCodes.json ./
COPY start.sh ./
RUN chmod +x start.sh

# Проверка работоспособности
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

EXPOSE 80 3000

CMD ["./start.sh"]