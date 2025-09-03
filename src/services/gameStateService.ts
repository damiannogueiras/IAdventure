/**
 * funciones necesarias para la recuperación de y actualizacion del estado del juego
 */

import { logger } from '../lib/logger';
import { getDb } from '../lib/mongoClient';
import { Collection } from 'mongodb';
import { GameState } from '../models/gameState';

const collectionName = 'gameStates';

// Recupera el estado del juego para un canal específico
enum GameStateError {
    NotFound = 'NOT_FOUND',
    AlreadyExists = 'ALREADY_EXISTS',
    Unknown = 'UNKNOWN',
}

async function getGameState(channelId: string): Promise<GameState | null> {
    const db = await getDb();
    const gameStateCollection: Collection<GameState> = db.collection(collectionName);
    const gameState = await gameStateCollection.findOne({ channelId });
    if (!gameState) {
        logger.warn(`[gameStateService] No se encontró estado de juego para el canal ${channelId}`);
        return null;
    }
    logger.debug(`[gameStateService] GameState:${JSON.stringify(gameState)}`);
    return gameState;
}

// Actualiza el estado del juego para un canal específico
async function updateGameState(channelId: string, newState: Partial<GameState>): Promise<any> {
    const db = await getDb();
    const gameStateCollection: Collection<GameState> = db.collection(collectionName);
    const result = await gameStateCollection.updateOne(
        { channelId },
        { $set: { ...newState, lastInteractionTime: new Date().toISOString() } },
        { upsert: true }
    );
    if (result.matchedCount > 0) {
        logger.info(`[gameStateService] Estado de juego actualizado para el canal ${channelId}`);
    } else if (result.upsertedCount > 0) {
        logger.info(`[gameStateService] Nuevo estado para el canal ${channelId}`);
    }
    return result;
}

// Inicializa un nuevo estado de juego para un canal (si no existe)
async function createGameState(gameState: GameState): Promise<GameState | GameStateError> {
    const db = await getDb();
    const gameStateCollection: Collection<GameState> = db.collection(collectionName);
    const exists = await gameStateCollection.findOne({ channelId: gameState.channelId });
    if (exists) {
        logger.warn(`[gameStateService] Ya existe un estado de juego para el canal ${gameState.channelId}`);
        return GameStateError.AlreadyExists;
    }
    await gameStateCollection.insertOne({ ...gameState, lastInteractionTime: new Date().toISOString() });
    logger.info(`[gameStateService] Estado de juego inicializado para el canal ${gameState.channelId}`);
    return gameState;
}

// Borra el estado de juego de un canal
async function deleteGameState(channelId: string): Promise<boolean> {
    const db = await getDb();
    const gameStateCollection: Collection<GameState> = db.collection(collectionName);
    const result = await gameStateCollection.deleteOne({ channelId });
    if (result.deletedCount > 0) {
        logger.info(`[gameStateService] Estado de juego borrado para el canal ${channelId}`);
        return true;
    } else {
        logger.warn(`[gameStateService] No se encontró estado de juego para borrar en el canal ${channelId}`);
        return false;
    }
}

export { getGameState, updateGameState, createGameState, deleteGameState, GameStateError };
