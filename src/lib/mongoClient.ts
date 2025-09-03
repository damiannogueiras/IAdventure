import { MongoClient, Db } from 'mongodb';
import { secrets } from '../config/secrets';
import { logger } from "./logger";

const mongoHost = secrets.mongoHost || 'localhost';
const mongoUser = secrets.mongoUsername || 'admin';
const mongoPassword = secrets.mongoPassword || 'password';
const dbName = secrets.dbName || 'rpg_game';
const options = secrets.mongoOptions || '';

const mongoUri = 'mongodb+srv://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + '/' + dbName + '?' + options;

let db: Db | null = null;
let client: MongoClient | null = null;

/**
 * Singleton para conexion base de datos
 * @return {Promise<Db>} La instancia de la base de datos
 */
export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(mongoUri);
  await client.connect();
  logger.info('Connected to MongoDB');
  db = client.db(dbName);
  return db;
}

/**
 * Cierra la conexion a la base de datos
 */
export async function closeDb() {
  if (client) {
    await client.close();
    logger.info('MongoDB connection closed');
    db = null;
    client = null;
  }
}