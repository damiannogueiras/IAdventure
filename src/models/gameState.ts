/**
 * GameState model
 * Definición de la estructura del estado de la partida para IAdventure
 */

export interface EntornoEnSala {
    id: string;
    alias: string[];
    descripcion: string;
    estado_operacional: string;
    interacciones: any[]; // Puedes definir un tipo más específico si lo necesitas
}

export interface SalaActual {
    id: string;
    descripcion: string;
    alias: string[];
    objetos_en_sala: string[];
    entorno_en_sala: { [key: string]: EntornoEnSala };
    salidas: { [direccion: string]: string };
    retos_asociados: RetoAsociado[];
}

export interface RetoAsociado {
    id: string;
    gatillo: string[];
    condiciones: { [key: string]: any };
    efectos: { [key: string]: any };
}

export interface GameStateData {
    playerId: string;
    posicion: string;
    inventario: string[];
    eventos: string[];
    sala_actual: SalaActual;
}

export interface GameState {
    _id?: string; // ID de MongoDB, opcional al crear
    channelId: string;
    gameName: string;
    lastInteractionTime: string;
    gameState: GameStateData;
}
