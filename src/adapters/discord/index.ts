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
import { logger } from '../../lib/logger';
import { secrets } from '../../config/secrets';
import { createMsgEmbed } from '../../view/discord';

/**
 * Inicializa el cliente de Discord
 * - Maneja comandos slash básicos
 * - Responde a mensajes específicos (ping, debug on/off)
 * - Usa intents y partials necesarios
 * - Loguea eventos importantes
 */

export async function initDiscord() {
  if (!secrets.botToken) {
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
  client.once('clientReady', () => {
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
      // si recibo un mensage debug, cambio el nivel de log
      if (message.content.toLowerCase() === 'debug on') {
        logger.info('[discord] Activando logs debug por mensaje');
        process.env.DEBUG = 'true';
        return await message.reply('Debug activado');
      }
      if (message.content.toLowerCase() === 'debug off') {
        logger.info('[discord] Desactivando logs debug por mensaje');
        process.env.DEBUG = 'false';
        return await message.reply('Debug desactivado');
      }

      if (message.content.toLowerCase() === 'ping') {
        logger.debug('[discord] msg recibido ' + message.content);
        // ejemplo de embed utilizando view/discord.ts
        const embed = createMsgEmbed('Pong!', 'Respuesta al comando ping', 0x00ff00);
        await message.reply({ embeds: [embed] });
      }
    } catch (err) {
      logger.error('[discord] error manejo messageCreate', err);
    }
  })

  await client.login(secrets.botToken).then(r => logger.info("[discord] Logged into Discord")).catch(e => console.log(e));

  return client;
}
