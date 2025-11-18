## Описание

## Настройка проекта

```bash
$ npm install
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте по необходимости.

```
cp .env.example .env
```

Важные настройки:
- `DATABASE_URL` – строка подключения к Postgres (по умолчанию используется локальный сервис из docker-compose).
- `REDIS_URL` – строка подключения к Redis.
- `RABBITMQ_URL` – строка подключения к RabbitMQ.
- `ROUND_DURATION` / `COOLDOWN_DURATION` – длительность раунда и кулдауна в секундах; планировщик использует их для автоматического создания новых раундов.

## Настройка базы данных

1. Убедитесь, что Postgres запущен (для локальной разработки можно запустить из корня репозитория:\
   `docker compose -f docker-compose.dev.yml up -d postgres`).
2. Примените схему Prisma и создайте таблицы:
   ```bash
   cd apps/api
   pnpm prisma migrate dev --schema prisma/schema.prisma --name init
   ```
   (используйте `pnpm prisma migrate deploy` для общих/staging баз данных).
3. Заполните начальными данными, чтобы в приложении были примеры пользователей/раундов:
   ```bash
   pnpm prisma db seed --schema prisma/schema.prisma
   ```
   Скрипт находится в `prisma/seed.ts`; измените его, если нужны другие тестовые данные.

## Компиляция и запуск проекта

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск тестов

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Развертывание

Когда вы готовы развернуть ваше NestJS приложение в продакшн, есть несколько ключевых шагов, которые можно предпринять, чтобы обеспечить максимально эффективную работу. Ознакомьтесь с [документацией по развертыванию](https://docs.nestjs.com/deployment) для получения дополнительной информации.

Если вы ищете облачную платформу для развертывания вашего NestJS приложения, обратите внимание на [Mau](https://mau.nestjs.com), нашу официальную платформу для развертывания NestJS приложений на AWS. Mau делает развертывание простым и быстрым, требуя всего несколько простых шагов:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

С Mau вы можете развернуть ваше приложение всего за несколько кликов, позволяя вам сосредоточиться на разработке функций, а не на управлении инфраструктурой.

## Ресурсы

Ознакомьтесь с несколькими ресурсами, которые могут пригодиться при работе с NestJS:

- Посетите [документацию NestJS](https://docs.nestjs.com), чтобы узнать больше о фреймворке.
- По вопросам и поддержке посетите наш [канал Discord](https://discord.gg/G7Qnnhy).
- Чтобы углубиться и получить больше практического опыта, ознакомьтесь с нашими официальными видео [курсами](https://courses.nestjs.com/).
- Разверните ваше приложение на AWS с помощью [NestJS Mau](https://mau.nestjs.com) всего за несколько кликов.
- Визуализируйте граф вашего приложения и взаимодействуйте с NestJS приложением в реальном времени, используя [NestJS Devtools](https://devtools.nestjs.com).
- Нужна помощь с вашим проектом (от частичной до полной занятости)? Ознакомьтесь с нашей официальной [корпоративной поддержкой](https://enterprise.nestjs.com).
- Чтобы быть в курсе и получать обновления, подписывайтесь на нас в [X](https://x.com/nestframework) и [LinkedIn](https://linkedin.com/company/nestjs).
- Ищете работу или есть вакансия? Ознакомьтесь с нашей официальной [доской вакансий](https://jobs.nestjs.com).

## Поддержка

Nest — это проект с открытым исходным кодом, лицензированный MIT. Он может развиваться благодаря спонсорам и поддержке удивительных сторонников. Если вы хотите присоединиться к ним, пожалуйста, [узнайте больше здесь](https://docs.nestjs.com/support).

## Связь

- Автор - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Веб-сайт - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Лицензия

Nest распространяется под [лицензией MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
