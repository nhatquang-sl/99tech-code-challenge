import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '99tech-credentials', '.development.env') });
if (process.env.NODE_ENV?.trim() == 'production')
  dotenv.config({
    path: path.join(__dirname, '99tech-credentials', '.env'),
    override: true,
  });

const envSchema = z.object({
  // See https://cjihrig.com/node_env_considered_harmful
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  APP_VERSION: z.string().optional(),
  APP_HOST: z.string().optional(),
  PORT: z.number().default(3500),

  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
});
const ENV = Object.freeze(envSchema.parse(process.env));

export default ENV;
