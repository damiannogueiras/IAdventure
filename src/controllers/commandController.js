/**
 * Controlador de comandos/mensajes para IAdventure
 * - Extrae la intención básica y llama al servicio IA
 */

// const { generateAnswer } = require('../services/aiService');
const config = require('../config');

/**
 * Maneja mensajes entrantes simples
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */

async function handleMessage(client, message) {
  // prefijo simple para comandos por ahora
  const content = message.content.trim();
  /*if (content.startsWith(config.PREFIX)) {
    const cmd = content.slice(config.PREFIX.length).trim().split(/\s+/)[0];
    const rest = content.slice(config.PREFIX.length + cmd.length).trim();*/
    /*if (cmd === 'ia') {
      await message.channel.sendTyping();
      const reply = await generateAnswer(rest || 'Hola');
      await message.reply(reply);
      return;
    }*/
    if (content === 'ping') {
      await message.reply('pong');
      return;
    }
  //}
}

module.exports = { handleMessage };


