import { env } from './env.validation.js';
import { Logger } from './logger.js';

class Config {
  NODE_ENV = env.NODE_ENV;
  PORT = env.PORT;
  API_URL = env.API_URL;
  CLIENT_URL = env.CLIENT_URLS[0];

  DATABASE_URL = env.DATABASE_URL;

  // Email
  EMAIL_USER = env.EMAIL_USER;
  EMAIL_PASS = env.EMAIL_PASS;

  ADMIN_EMAIL = env.ADMIN_EMAIL;

  logger;

  constructor() {
    this.logger = new Logger('Config');
  }

  initialize() {
    try {
      this.logger.info('Configuration initialized', {
        env: this.NODE_ENV,
        port: this.PORT,
        apiUrl: this.API_URL,
      });
    } catch (error) {
      this.logger.error('Failed to initialize config', error);
      throw error;
    }
  }

  validateRequired() {
    const required = ['DATABASE_URL'];
    const missing = required.filter(key => !this[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required config: ${missing.join(', ')}`);
    }
    return true;
  }
}

export const config = new Config();