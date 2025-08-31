// Punto de entrada (stub)
import config from './config';
import { logger } from './lib/logger';
import { initHttp } from './adapters/http';
import { initDiscord } from './adapters/discord';

async function main() {

  logger.info('Arrancando IAdventure (dev) — entorno: ' + config.env);
  await initHttp();
  await initDiscord();
}

main().catch((err) => {
  logger.error('Error arranque', err);
  process.exit(1);
});

