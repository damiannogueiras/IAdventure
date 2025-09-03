import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../.env.secrets') });

// Configuración secreta (tokens, claves)
export const secrets = {
  botToken: process.env.BOT_TOKEN || '',
  apiKeyGroq: process.env.APIKEY_GROQ || '',
  mongoUsername: process.env.MONGO_USERNAME || '',
  mongoPassword: process.env.MONGO_PASSWORD || '',
  mongoHost: process.env.MONGO_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'iadventure',
  mongoOptions: process.env.MONGO_OPTIONS  || '',
};
