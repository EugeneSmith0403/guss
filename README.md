# GUSS Project

Монорепозиторий для проекта GUSS, состоящий из нескольких приложений:
- **API** - NestJS backend приложение
- **Frontend** - React frontend приложение
- **Round Processor** - NestJS микросервис для обработки раундов

## Архитектура системы

![Архитектура системы](design.png)

## Требования

- Node.js (рекомендуется LTS версия)
- pnpm 9.15.0
- Docker и Docker Compose

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка переменных окружения

Скопируйте файл `.env.example` в `.env` в корне проекта:

```bash
cp .env.example .env
```

При необходимости отредактируйте `.env` файл под ваши настройки.

### 3. Запуск Docker контейнеров

Запустите необходимые сервисы (PostgreSQL, Redis, RabbitMQ):

```bash
docker compose -f docker-compose.dev.yml up -d
```

Это запустит следующие сервисы:
- **PostgreSQL** на порту `5432`
  - Пользователь: `admin`
  - Пароль: `admin`
  - База данных: `guss`
- **Redis** на порту `6379`
- **RabbitMQ** на портах `5672` (AMQP) и `15672` (Management UI)
  - Пользователь: `admin`
  - Пароль: `admin`

Для остановки контейнеров:

```bash
docker compose -f docker-compose.dev.yml down
```

Для просмотра логов:

```bash
docker compose -f docker-compose.dev.yml logs -f
```

### 4. Генерация Prisma схемы

После запуска PostgreSQL, необходимо применить миграции и сгенерировать Prisma Client:

```bash
pnpm prisma:migrate
```

Это выполнит:
- Применение всех миграций к базе данных
- Генерацию Prisma Client

Для генерации только Prisma Client (без миграций):

```bash
pnpm prisma:generate
```

Для заполнения базы данных начальными данными:

```bash
pnpm prisma:seed
```

### 5. Запуск всех проектов

Из корня проекта запустите все приложения одновременно:

```bash
pnpm dev
```

Это запустит:
- **API** на `http://localhost:3000`
- **Frontend** на `http://localhost:8080` (или другой порт, указанный Vite)
- **Round Processor** в режиме разработки

## Переменные окружения

Основные переменные окружения (определены в `.env.example`):

### База данных
- `DATABASE_URL` - строка подключения к PostgreSQL (по умолчанию: `postgresql://admin:admin@localhost:5432/guss`)

### Redis
- `REDIS_URL` - строка подключения к Redis (по умолчанию: `redis://localhost:6379`)

### RabbitMQ
- `RABBITMQ_URL` - строка подключения к RabbitMQ (по умолчанию: `amqp://localhost:5672`)

### API
- `PORT` - порт для API сервера (по умолчанию: `3000`)
- `FRONTEND_URL` - URL фронтенд приложения (по умолчанию: `http://localhost:8080`)

### Frontend
- `VITE_API_URL` - URL API сервера для фронтенда (по умолчанию: `http://localhost:3000`)

### Конфигурация раундов
- `ROUND_DURATION` - длительность раунда в секундах (по умолчанию: `60`)
- `COOLDOWN_DURATION` - длительность перерыва между раундами в секундах (по умолчанию: `30`)

## Полезные команды

### Запуск отдельных приложений

```bash
# API
cd apps/api
pnpm dev

# Frontend
cd apps/frontend
pnpm dev

# Round Processor
cd apps/round-processor
pnpm dev
```

### Сборка проекта

```bash
pnpm build
```

### Линтинг

```bash
pnpm lint
```

### Очистка

```bash
pnpm clean
```

### Prisma команды

Все команды Prisma выполняются из корня проекта:

```bash
# Применить миграции
pnpm prisma:migrate

# Сгенерировать Prisma Client
pnpm prisma:generate

# Заполнить базу данных
pnpm prisma:seed

# Открыть Prisma Studio (GUI для базы данных)
pnpm prisma:studio
```

## Структура проекта

```
guss/
├── apps/
│   ├── api/              # NestJS API приложение
│   ├── frontend/         # React frontend приложение
│   └── round-processor/  # NestJS микросервис
├── shared/               # Общие пакеты
│   ├── config/          # Конфигурация
│   ├── db/              # Prisma модуль
│   └── redis/           # Redis модуль
├── docker-compose.dev.yml # Docker Compose конфигурация
└── package.json         # Корневой package.json
```

## Доступ к сервисам

После запуска Docker контейнеров:

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **RabbitMQ Management UI**: `http://localhost:15672` (admin/admin)
- **API**: `http://localhost:3000`
- **Frontend**: `http://localhost:8080` (или другой порт Vite)

## Разработка

Проект использует:
- **Turbo** для управления монорепозиторием
- **pnpm** для управления пакетами
- **Prisma** для работы с базой данных
- **NestJS** для backend приложений
- **React + Vite** для frontend приложения

## Масштабирование с несколькими инстансами

Если планируете запускать приложение в продакшн с высокой нагрузкой, то на мой взгляд имеет смысл масштабировать API горизонтально. Я рекомендую использовать балансировщик нагрузки и несколько инстансов API. Вот как это выглядит на схеме:

![Масштабирование с несколькими инстансами](multiInstances.png)

### Как это работает

**Load Balancer** - это первое, что нужно настроить. Я использую Nginx или HAProxy, но можно взять и облачное решение. Все запросы от фронтенда идут через балансировщик, который распределяет их между инстансами API. Обычно использую round-robin или least connections - оба варианта работают хорошо.

**Несколько инстансов API** - запускаю обычно 3 инстанса (можно и больше, зависит от нагрузки). Каждый инстанс подключается к общим PostgreSQL и Redis:
- В PostgreSQL хранятся пользователи (`user`, `user_auth`) и раунды (`round`, `round_user`)
- В Redis лежат счета в реальном времени:
  - `round:<roundId>:user:<userId>:scores` - счет конкретного пользователя
  - `round:<roundId>:totalScore` - общий счет раунда

**Round Processor** - это отдельный сервис, который не нужно масштабировать. Он один на всю систему, потому что cron должен выполняться только один раз. Каждые 10 секунд он обновляет PostgreSQL и Redis напрямую, а также отправляет события в RabbitMQ для асинхронной обработки.

**База данных** - все инстансы API используют одну и ту же PostgreSQL и Redis. Это важно, иначе данные будут рассинхронизированы. RabbitMQ нужен для асинхронной обработки событий между round-process и базами данных.

### Пример конфигурации

Вот пример того, как можно настроить несколько инстансов через docker-compose:

```yaml
# docker-compose.prod.yml (пример)
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
  
  api-1:
    build: ./apps/api
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
  
  api-2:
    build: ./apps/api
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
  
  api-3:
    build: ./apps/api
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
```
