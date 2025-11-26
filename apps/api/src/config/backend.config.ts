import { registerAs } from '@nestjs/config';

const createBackendConfig = () => {
  const getRabbitmqUrl = () => {
    const envUrl = process.env.RABBITMQ_URL;
    if (!envUrl) {
      return 'amqp://admin:admin@localhost:5672';
    }
    if (!envUrl.includes('@')) {
      return envUrl.replace(/^amqp:\/\//, 'amqp://admin:admin@');
    }
    return envUrl;
  };

  return {
    database: {
      url: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/guss',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    rabbitmq: {
      url: getRabbitmqUrl(),
    },
    api: {
      port: parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
    },
    rounds: {
      duration: parseInt(process.env.ROUND_DURATION || '60', 10),
      cooldown: parseInt(process.env.COOLDOWN_DURATION || '30', 10),
    },
  };
};

export const backendConfig = registerAs('backend', createBackendConfig);

