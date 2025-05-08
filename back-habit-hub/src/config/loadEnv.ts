import { config } from 'dotenv';

export function loadEnv() {
  switch (process.env.NODE_ENV) {
    case 'docker':
      config({ path: '.env_docker' });
      break;
    case 'prod':
      config({ path: '.env_prod' });
      break;
    default:
      config({ path: '.env' });
  }
}