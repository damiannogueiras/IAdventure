/**
 * Modulo para la elaboración de los embeds de Discord
 * @param {string} title - Título del mensaje
 * @param {string} description - Descripción del embed
 * @param {number} [color=0x0099ff] - Color del embed en formato hexadecimal
 * @returns {EmbedBuilder} - Objeto EmbedBuilder de Discord.js
 */

import { EmbedBuilder } from 'discord.js';

export function createMsgEmbed(title: string, description: string, color = 0x0099ff) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Game Master Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
}