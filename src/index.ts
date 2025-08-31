// Punto de entrada (stub)
import { logger } from './lib/logger';
import { initHttp } from './adapters/http';
import { initDiscord } from './adapters/discord';
import { globalConfig } from './config/global';

async function main() {

  logger.info('Arrancando IAdventure (dev) — entorno: ' + globalConfig.env);
  await initHttp();
  await initDiscord();
}

main().catch((err) => {
  logger.error('Error arranque', err);
  process.exit(1);
});
