import {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  MessageFlags,
  Partials,
  EmbedBuilder,
  Interaction
} from 'discord.js';
import config from '../../config';
import { logger } from '../../lib/logger';

export async function initDiscord() {
  if (!config.botToken) {
    logger.warn('[discord] No hay BOT_TOKEN en la configuración, omitiendo conexión.');
    return null;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
  });

  // Cambiado a 'ready' y log de guilds
  client.once('ready', () => {
    logger.info('[discord] Conectado como', client.user?.tag);
    const guilds = client.guilds.cache.map(g => `${g.name} (${g.id})`).join(', ');
    logger.info(`[discord] Miembro de los servidores: ${guilds}`);
  });

  /**
   * Interaccion con comandos slash
   */
  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      // Manejo mínimo: solo comandos tipo ChatInput
      // Evitar cargar discord.js types complejos en el skeleton
      // @ts-ignore
      if (!interaction.isChatInputCommand || !interaction.isChatInputCommand()) return;
      // @ts-ignore
      const cmd = interaction.commandName;
      await interaction.deferReply();
      if (cmd === 'ping') {
        await interaction.editReply('Pong!');
      } else {
        await interaction.editReply(`Comando recibido: ${cmd}`);
      }
    } catch (err) {
      logger.error('[discord] error manejo interaction', err);
    }
  });

  /**
   * Interaccion con mensajes
   */
  client.on(Events.MessageCreate, async (message) => {
    try {
      if (message.author.bot) return; // Ignorar bots
      if (message.content.toLowerCase() === 'ping') {
        await message.reply('Pong!');
      }
    } catch (err) {
      logger.error('[discord] error manejo messageCreate', err);
    }
  })

  await client.login(config.botToken).then(r => logger.info("[discord] Logged into Discord")).catch(e => console.log(e));

  return client;
}
