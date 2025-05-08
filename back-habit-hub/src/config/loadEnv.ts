import { config } from 'dotenv';

console.dir({queue: 1})
console.dir({process: process.env.NODE_ENV})
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