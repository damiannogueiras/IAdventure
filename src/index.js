require('dotenv').config();
/**
 * Entrypoint mínimo para el bot IAdventure
 * Usa JavaScript con JSDoc y tsconfig (allowJs + checkJs)
 */
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const { handleMessage } = require('./controllers/commandController');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`[IAdventure] Conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  try {
    await handleMessage(client, message);
  } catch (e) {
    console.error('[IAdventure] Error manejando mensaje:', e);
  }
});

client.login(config.BOT_TOKEN).catch(err => console.error('Login fallido:', err));

