/**
 * Controller for handling AI consultation requests.
 */

import { AIService } from '../services/aiService';
import { getGameState } from '../services/gameStateService';
import { GameState } from '../models/gameState';
import {
    SYSTEM_PROMPTS,
    PROMPT_TEMPLATES,
    CONSULTATION_PARAMS
} from '../config/prompts';
import {logger} from "../lib/logger";

const aiService = new AIService();

/**
* Realiza una consulta genérica a la IA sin contexto de juego
* @param message Mensaje del usuario
* @returns Respuesta de la IA
*/
async function consultaIAgenerica(message: string) {
    try {
        const { maxTokens, temperature } = CONSULTATION_PARAMS.GENERIC;
        const respuesta = await aiService.consultaIAgenerica(
            message,
            SYSTEM_PROMPTS.GAME_MASTER_GENERIC,
            maxTokens,
            temperature
        );

        return {
            success: true,
            response: respuesta.choices[0].message.content
        };
    } catch (error) {
        logger.error('Consulta genérica:', error);
        return {
            success: false,
            error: 'Error procesando la consulta',
            response: 'Lo siento, ha ocurrido un error procesando tu consulta.'
        };
    }
}

/**
* Realiza una consulta a la IA incluyendo el contexto del estado del juego
* @param message Mensaje del usuario
* @param channelId ID del canal para recuperar el estado del juego
* @returns Objeto con la respuesta de la IA y el estado del juego
*/
async function consultaIAconGameState(message: string, channelId: string) {
    try {
        const gameState = await getGameState(channelId);
        const { maxTokens, temperature } = CONSULTATION_PARAMS.DETAILED;

        const messageWithContext = gameState
            ? PROMPT_TEMPLATES.WITH_GAME_STATE(gameState, message)
            : message;

        const respuesta = await aiService.consultaIAgenerica(
            messageWithContext,
            SYSTEM_PROMPTS.GAME_MASTER_WITH_STATE,
            maxTokens,
            temperature
        );

        return {
            success: true,
            gameState,
            response: respuesta.choices[0].message.content
        };
    } catch (error) {
        logger.error('Consulta con gameState:', error);
        return {
            success: false,
            error: 'Error procesando la consulta',
            gameState: null,
            response: 'Lo siento, ha ocurrido un error procesando tu consulta.'
        };
    }
}

export { consultaIAgenerica, consultaIAconGameState }