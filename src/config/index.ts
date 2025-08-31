import dotenv from 'dotenv';

// Cargar variables de entorno desde .env (si existe)
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  botToken: process.env.BOT_TOKEN || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

export default config;
