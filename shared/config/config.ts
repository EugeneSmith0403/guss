/**
 * Centralized configuration for all environment variables
 * This module provides typed access to environment variables with defaults
 * for use across all apps and shared packages.
 */

// Database configuration
export const DATABASE_URL =
  (typeof process !== 'undefined' && process.env?.DATABASE_URL) || 'postgresql://admin:admin@localhost:5432/guss';

// Redis configuration
export const REDIS_URL = (typeof process !== 'undefined' && process.env?.REDIS_URL) || 'redis://localhost:6379';

// RabbitMQ configuration
export const RABBITMQ_URL = (typeof process !== 'undefined' && process.env?.RABBITMQ_URL) || 'amqp://localhost:5672';

// API configuration
export const API_PORT = parseInt(
  (typeof process !== 'undefined' && process.env?.PORT) || '3000',
  10,
);
export const FRONTEND_URL = (typeof process !== 'undefined' && process.env?.FRONTEND_URL) || 'http://localhost:8080';

// Frontend configuration (for Vite, needs VITE_ prefix)
// These are used in frontend code, so they need to be accessed via import.meta.env
// For Node.js environments (build time), fallback to process.env
export const getFrontendApiUrl = (): string => {
  // In browser/Vite environment, use import.meta.env
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore - import.meta.env is available in Vite
      const viteEnv = import.meta?.env;
      if (viteEnv?.VITE_API_URL) {
        return viteEnv.VITE_API_URL;
      }
    } catch {
      // Fall through to default
    }
  }
  // In Node.js environment (e.g., during build), use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:3000';
  }
  // Default fallback
  return 'http://localhost:3000';
};

// Round configuration
export const ROUND_DURATION = parseInt(
  (typeof process !== 'undefined' && process.env?.ROUND_DURATION) || '60',
  10,
);
export const COOLDOWN_DURATION = parseInt(
  (typeof process !== 'undefined' && process.env?.COOLDOWN_DURATION) || '30',
  10,
);

/**
 * Configuration object with all environment variables
 */
export const config = {
  database: {
    url: DATABASE_URL,
  },
  redis: {
    url: REDIS_URL,
  },
  rabbitmq: {
    url: RABBITMQ_URL,
  },
  api: {
    port: API_PORT,
    frontendUrl: FRONTEND_URL,
  },
  frontend: {
    apiUrl: getFrontendApiUrl(),
  },
  rounds: {
    duration: ROUND_DURATION,
    cooldown: COOLDOWN_DURATION,
  },
} as const;

