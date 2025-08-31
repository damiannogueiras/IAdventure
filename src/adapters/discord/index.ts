import { Client, GatewayIntentBits, Partials, Interaction } from 'discord.js';
import config from '../../config';
import { logger } from '../../lib/logger';

export async function initDiscord() {
  if (!config.discordToken) {
    logger.warn('[discord] No hay DISCORD_TOKEN en la configuración, omitiendo conexión.');
    return null;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

  client.once('ready', () => {
    logger.info('[discord] Conectado como', client.user?.tag);
  });

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

  await client.login(config.discordToken);
  return client;
}
