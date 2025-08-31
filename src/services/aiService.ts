import config from '../config';
import { logger } from '../lib/logger';

export class AIService {
  constructor(private apiKey = config.openaiApiKey) {}

  async generateCompletion(prompt: string) {
    logger.info('[ai] generateCompletion prompt len:', prompt.length);
    // Stub: en producción llamarías al proveedor LLM
    return `Respuesta simulada para: ${prompt.slice(0, 120)}`;
  }

  async embeddings(text: string) {
    logger.info('[ai] embeddings for text len:', text.length);
    // Stub: devolver vector dummy
    return Array(8).fill(0).map(() => Math.random());
  }
}

export default new AIService();

