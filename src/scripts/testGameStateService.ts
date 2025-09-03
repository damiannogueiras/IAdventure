import { createGameState, getGameState, updateGameState, deleteGameState, GameStateError } from '../services/gameStateService';
import { GameState } from '../models/gameState';

async function testGameStateService() {
  const channelId = 'test-channel';
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

  // Borra cualquier estado previo
  await deleteGameState(channelId);

  // Crea un nuevo estado
  const createResult = await createGameState(initialState);
  if (createResult === GameStateError.AlreadyExists) {
    console.log('Ya existía un estado para este canal.');
  } else {
    console.log('Estado creado:', createResult);
  }

  // Recupera el estado
  const fetched = await getGameState(channelId);
  console.log('Estado recuperado:', fetched);

  // Actualiza el estado
  const updateResult = await updateGameState(channelId, {
    gameState: {
      ...initialState.gameState,
      inventario: ['llave', 'linterna']
    }
  });
  console.log('Resultado de actualización:', updateResult.result || updateResult);

  // Recupera el estado actualizado
  const updated = await getGameState(channelId);
  console.log('Estado actualizado:', updated);

  // Borra el estado
  // const deleteResult = await deleteGameState(channelId);
  // console.log('Estado borrado:', deleteResult);

  process.exit(0);
}

testGameStateService();

