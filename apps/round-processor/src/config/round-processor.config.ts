import { registerAs } from '@nestjs/config';

const createRoundProcessorConfig = () => {
  const roundDuration = process.env.ROUND_DURATION;
  const cooldownDuration = process.env.COOLDOWN_DURATION;
  
  const roundsConfig = {
    duration: roundDuration ? parseInt(roundDuration, 10) : 60,
    cooldown: cooldownDuration ? parseInt(cooldownDuration, 10) : 30,
  };
  
  return {
    database: {
      url: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/guss',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    rabbitmq: {
      url: (() => {
        const envUrl = process.env.RABBITMQ_URL;
        if (envUrl) {
          const urlPattern = /^amqp:\/\/([^:]+:[^@]+@)?/;
          if (!urlPattern.test(envUrl) || !envUrl.includes('@')) {
            const urlWithAuth = envUrl.replace(/^amqp:\/\//, 'amqp://admin:admin@');
            console.warn(
              `RABBITMQ_URL не содержит учетные данные. Используется: ${urlWithAuth.replace(/:[^:@]+@/, ':***@')}`,
            );
            return urlWithAuth;
          }
          return envUrl;
        }
        return 'amqp://admin:admin@localhost:5672';
      })(),
    },
    api: {
      port: parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
    },
    rounds: roundsConfig,
  };
};

export const roundProcessorConfig = registerAs('roundProcessor', createRoundProcessorConfig);

