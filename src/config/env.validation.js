import dotenv from 'dotenv';
import { z } from 'zod';
import { Logger } from './logger.js';

dotenv.config();

const logger = new Logger('env-validation');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  
  PORT: z.string().default('5000').transform(val => parseInt(val, 10)),
  
  DATABASE_URL: z.string().min(1, 'DATABASE_URL required'),
  
  API_URL: z.string().url(),
  
  CLIENT_URLS: z.string().transform(val => val.split(',').map(url => url.trim())),
  
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  
  ADMIN_EMAIL: z.string().email(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  logger.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;