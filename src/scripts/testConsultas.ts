import { consultaIAgenerica, consultaIAconGameState } from '../controllers/consultaController';
import { createGameState, deleteGameState, GameStateError } from '../services/gameStateService';
import { GameState } from '../models/gameState';
import { logger } from '../lib/logger';

async function testConsultas() {
    try {
        const channelId = 'test-channel';

        // Preparar el estado de juego para las pruebas
        const initialState: GameState = {
            channelId,
            gameName: 'Test Adventure',
            lastInteractionTime: new Date().toISOString(),
            gameState: {
                playerId: 'player1',
                posicion: 'sala_inicio',
                inventario: ['llave'],
                eventos: ['inicio'],
                sala_actual: {
                    id: 'sala_inicio',
                    descripcion: 'Sala de inicio de la aventura.',
                    alias: ['inicio'],
                    objetos_en_sala: ['llave'],
                    entorno_en_sala: {},
                    salidas: { norte: 'sala_norte' },
                    retos_asociados: []
                }
            }
        };

        // Limpiar estado previo y crear nuevo estado
        await deleteGameState(channelId);
        const createResult = await createGameState(initialState);
        logger.info('Estado de juego creado para pruebas:', createResult);

        // Test 1: Consulta genérica
        logger.info('\n=== Test 1: Consulta Genérica ===');
        const consultaGenericaResult = await consultaIAgenerica(
            '¿Qué es un juego de rol?'
        );
        logger.info('Respuesta consulta genérica:', consultaGenericaResult);

        // Test 2: Consulta con estado del juego - Pregunta sobre la sala
        logger.info('\n=== Test 2: Consulta sobre la Sala ===');
        const consultaSalaResult = await consultaIAconGameState(
            '¿Qué hay en esta sala?',
            channelId
        );
        logger.info('Respuesta consulta sala:', consultaSalaResult);

        // Test 3: Consulta con estado del juego - Pregunta sobre el inventario
        logger.info('\n=== Test 3: Consulta sobre Inventario ===');
        const consultaInventarioResult = await consultaIAconGameState(
            '¿Qué objetos llevo encima?',
            channelId
        );
        logger.info('Respuesta consulta inventario:', consultaInventarioResult);

        // Test 4: Consulta con estado del juego - Pregunta sobre posibles acciones
        logger.info('\n=== Test 4: Consulta sobre Acciones Posibles ===');
        const consultaAccionesResult = await consultaIAconGameState(
            '¿Qué puedo hacer en esta sala?',
            channelId
        );
        logger.info('Respuesta consulta acciones:', consultaAccionesResult);

        // Test 5: Consulta con estado inválido
        logger.info('\n=== Test 5: Consulta con Canal Inválido ===');
        const consultaInvalidaResult = await consultaIAconGameState(
            '¿Dónde estoy?',
            'canal-invalido'
        );
        logger.info('Respuesta consulta inválida:', consultaInvalidaResult);

    } catch (error) {
        logger.error('Error en las pruebas:', error);
    } finally {
        process.exit(0);
    }
}

// Ejecutar las pruebas
logger.info('Iniciando pruebas de consultas...');
testConsultas();
