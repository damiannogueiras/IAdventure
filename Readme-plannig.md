# Planning de Desarrollo para IAdventure

---

## FASE 1: Preparación y Base del Proyecto

### 1.1. Estructura y configuración inicial
- [x] Definir estructura de carpetas y archivos (ya está avanzada).
- [x] Separar variables de entorno en `.env.global` y `.env.secrets`.
- [x] Configurar logger y modo debug.
- [x] Configurar TypeScript, `tsconfig` y scripts de build/start.
- [x] Añadir README con arquitectura y flujo general.

### 1.2. Control de versiones y seguridad
- [x] Añadir `.gitignore` para proteger secretos.
- [x] Documentar en README cómo gestionar variables de entorno y secretos.

---

## FASE 2: Discord Bot y Comandos Básicos

### 2.1. Bot de Discord
- [x] Crear y registrar el bot en Discord Developer Portal.
- [x] Implementar conexión básica y eventos (`ready`, `messageCreate`).
- [x] Comprobar permisos e intents necesarios.
- [x] Añadir comandos básicos de prueba (`ping`, `debug on/off`).

### 2.2. Gestión de comandos de usuario
- [ ] Implementar sistema de prefijos/menciones para identificar comandos dirigidos al bot.
- [ ] Parsear comandos y argumentos del usuario.
- [ ] Añadir sistema de ayuda (`!help` o similar).

---

## FASE 3: Persistencia y Estado de Juego

### 3.1. Modelo de datos y MongoDB
- [ ] Definir modelos de `gameState` y `mapasBase` (TypeScript o JSON Schema).
- [ ] Implementar conexión y pruebas con MongoDB (local o Atlas).
- [ ] Crear el MCP Server (API REST o gRPC) para exponer operaciones seguras sobre la BBDD.
- [ ] Implementar endpoints para:
  - Recuperar/crear `gameState` por canal.
  - Actualizar `gameState` según instrucciones.
  - Recuperar mapas base.

### 3.2. Integración bot <-> MCP Server
- [ ] El bot debe llamar al MCP Server para leer/escribir estado de juego.
- [ ] Añadir lógica para inicializar partida si no existe `gameState`.

---

## FASE 4: Lógica de Juego y LLM

### 4.1. Construcción del prompt maestro
- [ ] Implementar función para construir el `prompt_maestro` con toda la información relevante (estado, sala, inventario, eventos, etc.).
- [ ] Definir y documentar todas las acciones de alto nivel permitidas (`ADD_ITEM_TO_INVENTORY`, etc.).

### 4.2. Integración con LLM
- [ ] Implementar servicio para enviar el prompt al LLM (OpenAI u otro).
- [ ] Parsear la respuesta JSON del LLM (narración + instrucciones).
- [ ] Validar que las instrucciones sean seguras y estén bien formadas.

### 4.3. Procesamiento de instrucciones
- [ ] Procesar las instrucciones recibidas y traducirlas a llamadas al MCP Server.
- [ ] Manejar errores y respuestas inesperadas del LLM.

---

## FASE 5: Interacción y Experiencia de Usuario

### 5.1. Narración y feedback
- [ ] Enviar la narración del LLM al canal de Discord.
- [ ] Añadir feedback visual (embeds, reacciones, etc.) para mejorar la experiencia.

### 5.2. Gestión de partidas
- [ ] Permitir reiniciar partida, consultar estado, historial de comandos, etc.
- [ ] Soporte para múltiples partidas (por canal o por usuario).

---

## FASE 6: Testing, Seguridad y Despliegue

### 6.1. Testing
- [ ] Tests unitarios para lógica de comandos, integración con MCP y LLM.
- [ ] Pruebas de integración end-to-end (simulación de turnos completos).

### 6.2. Seguridad
- [ ] Validar y sanear todos los inputs del usuario y del LLM.
- [ ] Limitar acciones peligrosas en la BBDD.
- [ ] Revisar permisos del bot en Discord.

### 6.3. Despliegue
- [ ] Documentar despliegue en producción (env, build, start).
- [ ] Automatizar backups de la BBDD.
- [ ] Monitorización básica (errores, uso, etc.).

---

## FASE 7: Mejoras y Extensiones

- [ ] Añadir soporte para comandos slash de Discord.
- [ ] Mejorar la interfaz visual (embeds avanzados, imágenes, etc.).
- [ ] Soporte para varios idiomas.
- [ ] Editor de mapas y herramientas para creadores.
- [ ] Analítica de partidas y feedback de usuarios.

---

## Siguientes pasos recomendados

1. **Completar la Fase 2:** Termina la gestión de comandos y asegúrate de que el bot responde correctamente.
2. **Avanzar con la Fase 3:** Define el modelo de datos y pon en marcha el MCP Server.
3. **Iterar con la Fase 4:** Integra el LLM y valida el flujo de turnos.
4. **Testea y refina:** Haz pruebas reales con usuarios y ajusta la experiencia.

