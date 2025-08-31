**IADVENTURE - ARQUITECTURA GENERAL**

**Propósito:** Un juego de aventura conversacional potenciado por IA, con texto y narración gestionada por un LLM, lógica de juego persistente en MongoDB, e interacción a través de un bot de Discord.

**Componentes Principales:**

1.  **Discord Bot (`IADventureBot`)**
    *   **Responsabilidad:** Interacción con los usuarios, gestión de canales, recepción de comandos, envío de narraciones.
    *   **Tecnologías:** `discord.js` (Node.js), MongoDB Driver.
    *   **Flujo de Comandos:**
        *   Escucha mensajes en canales de Discord.
        *   Identifica menciones al bot o prefijos de comando específicos de IAdventure.
        *   Extrae el comando del jugador.
        *   Recupera el `gameState` de MongoDB para el canal correspondiente.
        *   Si no hay `gameState`, inicializa una nueva partida (carga mapa base, crea documento BBDD).
        *   Construye el `prompt_maestro` para el LLM, incluyendo:
            *   Rol del LLM (Director de Juego / NPC específico).
            *   Descripción del entorno actual (`mapa_dinamico.salas[posicion]`).
            *   Estado actual (`posicion`, `inventario`, `eventos`, `estado_npc`, etc.).
            *   Comando del jugador.
            *   Lista de `acciones_permitidas` (definidas por el bot/MCP).
        *   Envía el prompt a la API del LLM.
        *   Recibe la respuesta JSON del LLM (que incluye `narracion` e `instrucciones_para_app`).
        *   Procesa la `narracion` y la envía de vuelta a Discord.
        *   Procesa las `instrucciones_para_app` y las pasa al **Módulo de Interfaz MCP**.
        *   Persiste el `gameState` actualizado en MongoDB.

2.  **LLM (Modelo de Lenguaje Grande)**
    *   **Rol:** Director de Juego, Narrador, y Planificador de Cambios de Estado a través de "instrucciones de alto nivel". Puede adoptar roles de NPC.
    *   **Input:** `prompt_maestro` (como se describe arriba).
    *   **Output:** Objeto JSON con:
        *   `narracion`: Texto para el jugador.
        *   `instrucciones_para_app`: Lista de operaciones de alto nivel (ej: `ADD_ITEM_TO_INVENTORY`, `UPDATE_NPC_STATE`, `REMOVE_OBJECT_FROM_ROOM`, etc.).
        *   `juego_terminado`: (Opcional) Indicador para finalizar la partida.

3.  **MongoDB MCP Server**
    *   **Rol:** Actúa como el proxy seguro y estructurado entre tu aplicación y MongoDB. Expone una API controlada de operaciones permitidas.
    *   **Responsabilidad:** Ejecuta las operaciones solicitadas por tu bot de Discord (que provienen del LLM) contra la base de datos.
    *   **Integración:** Tu bot de Discord llama al MCP server (probablemente a través de HTTP/REST o gRPC, según la API del servidor) pasándole las `instrucciones_para_app` recibidas del LLM. El MCP server realiza las operaciones en MongoDB.

4.  **Base de Datos MongoDB**
    *   **Responsabilidad:** Almacenamiento persistente del estado de todas las partidas activas de IAdventure.
    *   **Colecciones Principales:**
        *   `gameStates`: Cada documento representa una partida en un canal de Discord. Contiene:
            *   `channelId`: ID del canal de Discord.
            *   `gameMode`: "IAdventure".
            *   `gameState`:
                *   `posicion`: ID de la sala actual.
                *   `inventario`: Lista de IDs de objetos.
                *   `eventos`: Lista de eventos que han ocurrido.
                *   `mapa_dinamico`: El estado mutable del mundo de juego para esa partida (salas, objetos, entorno, salidas, NPCs, sus estados, etc.).
                *   `historial_comandos`: (Opcional) Comandos anteriores para contextualizar.
        *   `mapasBase` (o similar): Para almacenar los archivos Markdown/JSON originales del mapa, que se usan para inicializar nuevas partidas.

### Flujo General de Un Turno de Juego

```
Jugador (en Discord) -> Comando de Texto
       |
       v
IADventureBot (Discord Bot)
  |  1. Recibe comando de IA (mención/prefijo)
  |  2. Recupera gameState de MongoDB para este canal
  |  3. Construye prompt para LLM (incluye info de sala, estado, etc.)
  |  4. Envía prompt a API del LLM
  v
LLM (Planificador de Estado / Director de Juego)
  |  5. Interpreta comando, consulta "conocimiento" de juego
  |  6. Determina acciones necesarias (ej: coger manzana)
  |  7. Genera JSON de respuesta: {"narracion": "...", "instrucciones_para_app": [...]}
  v
IADventureBot (Discord Bot)
  |  8. Envía `narracion` a Discord
  |  9. Parsea `instrucciones_para_app`
  | 10. Llama al MongoDB MCP Server con esas instrucciones
  v
MongoDB MCP Server
  | 11. Traduce instrucciones a operaciones MongoDB
  | 12. Ejecuta operaciones en MongoDB (ej: updateOne en gameStates)
  v
MongoDB Database
  | 13. Persiste el estado del juego actualizado
```

### El Prompt Maestro (Ejemplo con la opción MCP)

```
Eres un experto Director de Juego para IAdventure. Tu rol es interpretar los comandos del jugador, narrar la historia y, CRUCIALMENTE, especificar las operaciones necesarias en MongoDB para actualizar el estado del juego. Sigue siempre los protocolos de seguridad de MongoDB al formular tus instrucciones. Solo puedes usar las siguientes acciones de alto nivel para modificar el estado, y debes mapear la intención del jugador a una o varias de estas:

Acciones Permitidas (Formato JSON con el KEY "action" y el VALUE del tipo de acción):
- ADD_ITEM_TO_INVENTORY({ itemId: string, playerId: string })
- REMOVE_ITEM_FROM_INVENTORY({ itemId: string, playerId: string })
- REMOVE_OBJECT_FROM_ROOM({ itemId: string, roomId: string })
- ADD_OBJECT_TO_ROOM({ itemId: string, roomId: string, objData: object })
- UPDATE_NPC_STATE({ npcId: string, newState: object })
- ADD_EVENT({ eventId: string })
- SET_ROOM_DESCRIPTION({ roomId: string, description: string })
- UNLOCK_EXIT({ roomId: string, direction: string, destinationRoomId: string })
- GAME_OVER({win: boolean, message: string})
// ... etc. (Define todas las acciones posibles del juego)

Estado actual del juego:
- Jugador: {{playerId}}
- Posición actual: {{gameState.posicion}}
- Inventario del jugador: [{{gameState.inventario.join(', ')}}]
- Eventos ocurridos: [{{gameState.eventos.join(', ')}}]

Detalles de tu ubicación actual ({{gameState.posicion}}):
- Descripción: {{sala_actual.descripcion}}
- Objetos en la sala: [{{sala_actual.objetos_en_salas.join(', ')}}]
- Entorno: [{{sala_actual.entorno_en_salas.join(', ')}}]
- Salidas disponibles: {{sala_actual.salidas | format_salidas}}
- NPC presentes: {{sala_actual.npcs_presentes}}

Comando del jugador:
> {{comando_del_jugador}}

Por favor, responde con un objeto JSON que contenga:
1.  "narracion": La descripción narrativa del resultado de la acción.
2.  "instrucciones_para_app": Un ARREGLO de objetos, cada uno representando una acción de alto nivel que debe ser ejecutada en MongoDB (siguiendo el formato especificado). Asegúrate de que las acciones del LLM coincidan EXACTAMENTE con los nombres y parámetros que tu bot puede interpretar y ejecutar. Por ejemplo, si el jugador recoge una manzana, debes generar una instrucción para REMOVER_OBJECT_FROM_ROOM y otra para ADD_ITEM_TO_INVENTORY.
```
