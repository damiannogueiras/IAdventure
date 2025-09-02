import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../.env.secrets') });

// Configuración secreta (tokens, claves)
export const secrets = {
  botToken: process.env.BOT_TOKEN || '',
  apiKeyGroq: process.env.APIKEY_GROQ || '',
};
