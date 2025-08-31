/**
 * Config simple cargada desde variables de entorno
 */
require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_ENV: process.env.PINECONE_ENV,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  PREFIX: process.env.PREFIX || '!'
};

