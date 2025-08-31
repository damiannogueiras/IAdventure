import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../.env.global') });

// Configuración global (no sensible)
export const globalConfig = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  debug: process.env.DEBUG === 'true',
};
