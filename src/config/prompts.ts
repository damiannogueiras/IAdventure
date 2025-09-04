/**
 * Configuración de prompts para la IA
 * Aquí se definen los diferentes prompts y system prompts utilizados en la aplicación
 */

// System prompts
export const SYSTEM_PROMPTS = {
    GAME_MASTER_GENERIC: "Eres un 'game master' experto en juegos de adventure conversacionales. Debes actuar como un narrador experimentado, capaz de crear historias inmersivas y tomar decisiones justas.",

    GAME_MASTER_WITH_STATE: "Eres un 'game master' experto en juegos de adventure conversacionales. Tu tarea es gestionar el estado actual del juego, responder a las acciones de los jugadores y mantener la coherencia del mundo. Debes tener en cuenta el estado actual del juego para todas tus respuestas.",

    GAME_MASTER_COMBAT: "Eres un 'game master' experto en combates de juegos de adventure conversacionales. Debes gestionar los encuentros de manera justa, aplicar las reglas de combate y crear descripciones emocionantes de las acciones.",
} as const;

// Prompt templates
export const PROMPT_TEMPLATES = {
    // Template para incluir el estado del juego en la consulta
    WITH_GAME_STATE: (gameState: any, userMessage: string) => `
Estado actual del juego:
${JSON.stringify(gameState, null, 2)}

Consulta del jugador: ${userMessage}
    `.trim(),

    // Template para consultas de combate
    COMBAT_ACTION: (gameState: any, action: string) => `
Estado actual del combate:
${JSON.stringify(gameState, null, 2)}

Acción del jugador: ${action}

Por favor, describe el resultado de la acción y actualiza el estado del combate.
    `.trim(),

    // Template para consultas sobre el entorno
    ENVIRONMENT_QUERY: (gameState: any, query: string) => `
Estado actual de la sala:
${JSON.stringify(gameState?.salaActual, null, 2)}

Consulta sobre el entorno: ${query}
    `.trim(),
} as const;

// Configuración de parámetros para diferentes tipos de consultas
export const CONSULTATION_PARAMS = {
    GENERIC: {
        maxTokens: 200,
        temperature: 0,
    },
    DETAILED: {
        maxTokens: 400,
        temperature: 0.2,
    },
    CREATIVE: {
        maxTokens: 300,
        temperature: 0.7,
    },
} as const;
