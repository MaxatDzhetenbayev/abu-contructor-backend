# Используем базовый образ
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код приложения
COPY . .

# Создаем .env файл из переменной окружения
# Переменные окружения должны быть переданы на этапе сборки

ARG DB
ARG DB_HOST
ARG DB_USER
ARG DB_PASS
ARG DB_PORT

RUN echo "DB=$DB" > .env && \
    echo "DB_HOST=$DB_HOST" > .env && \
    echo "DB_USER=$DB_USER" >> .env && \
    echo "DB_PASS=$DB_PASS" >> .env && \
    echo "DB_PORT=$DB_PORT" >> .env

# Собираем проект (если необходимо)
RUN npm run build

# Экспонируем порт, который будет использоваться приложением
EXPOSE 3003

CMD ["npm","run","start"]
