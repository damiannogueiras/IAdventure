import { secrets } from '../config/secrets';
import { logger } from '../lib/logger';
import Groq from "groq-sdk";

export class AIService {
  private groq: Groq;

  constructor() {
    if (!secrets.apiKeyGroq) {
      logger.error('[AIService] No API key for Groq found in configuration.');
      throw new Error('Missing Groq API key');
    }
    this.groq = new Groq({ apiKey: secrets.apiKeyGroq});
    logger.info('[AIService] Groq client initialized.');
  }

  /**
   * Consulta genérica pasándole todos los parámetros
   */
  public async consultaIAgenerica(
    query: string,
    system: string,
    tokens_max: number = 200,
    temperatura: number = 0.2
  ) {
    const chat_history = [];
    chat_history.push({ role: "user", content: query });
    chat_history.push({ role: "system", content: system });

    return this.groq.chat.completions.create({
      messages: chat_history,
      model: "llama-3.3-70b-versatile",
      max_tokens: tokens_max,
      temperature: temperatura
    });
  }
}