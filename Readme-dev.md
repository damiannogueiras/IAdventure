# IAdventure — Arquitectura (dev)

Índice

- Principios
- Arquitectura recomendada (capas)
- Estructura de carpetas sugerida
- Diseño IA (prácticas)
- Discord: mejores prácticas
- Persistencia & rendimiento
- Escalado y despliegue
- Observabilidad y costes
- Calidad y mantenimiento
- Roadmap incremental (priorizado)
- Tecnologías / Librerías sugeridas
- Servicios que puedo ofrecer

---

## Principios

- Separación de responsabilidades: comandos/handlers, controladores, servicios (negocio), repositorios (DB), adaptadores externos (Discord, LLM, VectorDB).
- Inyección de dependencias para facilitar tests y swaps (awilix/inversify o pasar dependencias manualmente).
- Tipado: TypeScript para seguridad y refactor seguro.
- Observabilidad: logs estructurados (pino/winston), métricas, captura de errores (Sentry).
- Seguridad y límites: variables de entorno, rotación de tokens, rate limiting, validación y filtrado de outputs IA.
- Testabilidad: unit + integración (jest, msw/nock para mocks HTTP, test doubles para discord.js).

## Arquitectura recomendada (capas)

- Entry points
  - adapters/discord: maneja eventos y transforma a comandos internos.
  - adapters/http: webhooks, healthchecks.
- Controllers: orquestan la lógica por caso de uso (ej. ConsultaController).
- Services: lógica IA, manejo de sesiones, caching, prompts, coste/token management.
- Repositories: abstracción DB (Mongo/Mongoose o Prisma) y cache (Redis).
- Providers / Adapters: LLM provider (OpenAI/Anthropic), Embeddings provider, Vector DB adapter (Pinecone, Weaviate, Milvus).
- Utils / common: validadores, plantillas de prompt, middlewares.

## Estructura de carpetas sugerida

```
src/
  adapters/
    discord/
      index.ts        # conector a discord.js
    http/
    llm/
      openaiAdapter.ts
      providerFactory.ts
    vector/
      pineconeAdapter.ts
  controllers/
    consultaController.ts
    dmController.ts
  services/
    aiService.ts      # RAG, prompts, streaming
    sessionService.ts # historial, tokens
    commandService.ts
  repositories/
    simpleRepo.ts
    sinergiaRepo.ts
    userRepo.ts
  models/             # Mongoose / Prisma
  jobs/               # queues, workers
  config/
    index.ts
  lib/
    logger.ts
    errorHandler.ts
  commands/           # definiciones de comandos
  types/
  tests/
  index.ts
```

> Nota: adaptar nombres y extensiones (.js/.ts) según migración a TypeScript.

## Diseño IA (prácticas)

- Abstracción del proveedor: poder intercambiar OpenAI/Cohere/Anthropic sin tocar la lógica de negocio.
- Plantillas de prompt y tests automáticos: versionar templates y validar salidas esperadas.
- RAG: indexar documentos/embeddings en Vector DB; recuperar top-K por similitud y anexar contexto.
- Cache de embeddings y respuestas (Redis) para consultas frecuentes.
- Chunking y metadata por documento; usar embeddings por fragmento.
- Controles: classifier de toxicidad + verificación final antes de enviar a Discord.
- Límite de tokens y coste por usuario: contabilizar y avisar.
- Conversación: session id por usuario/hilo y políticas de retención (TTL).

## Discord: mejores prácticas

- Un único router de Interactions en vez de múltiples listeners duplicados.
- Registrar comandos automáticamente con scripts de deploy.
- Manejar botones/modals con customId scheme: `prefijo:tipo:id` (ej. `ai_reply:12345`).
- Respuestas diferidas y streaming: `deferReply` + enviar fragments con `editReply` o `followUp`.
- Uso mínimo de intents necesarios y manejo de partials.

## Persistencia & rendimiento

- DB primaria: MongoDB (+ Mongoose) o PostgreSQL (Prisma) si necesitas relaciones.
- Cache y cola: Redis + BullMQ para jobs de embeddings, reindex, generación larga.
- Vector DB: Pinecone, Weaviate o Milvus para búsquedas semánticas.
- Indexa y crea índices DB (text/compound) para rendimiento.

## Escalado y despliegue

- Docker + GitHub Actions para CI/CD.
- Separar procesos: bot process (event loop) + workers (cola/embeddings).
- Supervisión: Prometheus + Grafana (o servicios SaaS).
- Sharding si crece (discord.js sharding manager).
- Healthchecks y readiness probes.

## Observabilidad y costes

- Loggeo estructurado y con niveles.
- Telemetría de requests hacia LLMs (latencia, tokens, costes).
- Alertas por uso anómalo y límites diarios de tokens.

## Calidad y mantenimiento

- TypeScript + ESLint + Prettier.
- Contract tests para adaptadores externos (usar mocks de LLM).
- Documentación de prompts y decisiones de diseño.
- Suites de tests: unitarios (services/repos), integración (discord adapter stubs).

## Roadmap incremental (priorizado)

1. Migrar a TypeScript (opcional pero recomendado) y añadir lint/format.
2. Extraer adaptador Discord: desacoplar `index.js` en adapter + router.
3. Implementar capa de Services para IA con abstracción de provider.
4. Añadir cache Redis y manejo de sessions básico.
5. Integrar Vector DB con un pipeline de embeddings y búsqueda RAG.
6. Mover jobs pesados a workers (BullMQ).
7. Añadir observabilidad (logger + Sentry) y tests.
8. Revisar despliegue (Docker + GH Actions) y monitoreo.

## Tecnologías / Librerías sugeridas

- Node.js + TypeScript, discord.js v14+
- Mongoose o Prisma + MongoDB/Postgres
- Redis + BullMQ
- Pinecone / Weaviate / Milvus
- OpenAI / Anthropic / Cohere (con adapter)
- pino / winston, Sentry
- jest, msw/nock para tests
- awilix / inversify para DI (opcional)

## Qué puedo hacer por ti

- a) Un esqueleto de proyecto con la estructura propuesta (archivos iniciales en TS).
- b) Una propuesta de refactor paso a paso aplicable a tu repo actual (patches).
- c) Un ejemplo de `aiService` con RAG y adaptador a OpenAI.

---

Si quieres que aplique alguna de las opciones (a / b / c) directamente al repo, dime cuál y me pongo a ello.
