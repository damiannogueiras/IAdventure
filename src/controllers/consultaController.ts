/**
 * Controller for handling AI consultation requests.
 */

import { AIService } from '../services/aiService';

const aiService = new AIService();

/**
* Handle a generic AI consultation request.
*/
async function consultaIAgenerica(message) {
  const system = "Eres un 'game master' experto en juegos de rol."
  const respuesta = await aiService.consultaIAgenerica(message, system, 200, 0);
  return respuesta.choices[0].message.content;
};

export { consultaIAgenerica }