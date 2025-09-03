import { getDb, closeDb } from '../lib/mongoClient';

async function testDb() {
  try {
    const db = await getDb();
    const collection = db.collection('gameStates');
    const testChannelId = 'ID_del_canal_de_discord';

    // Limpia cualquier documento previo de test
    await collection.deleteOne({ channelId: testChannelId });

    // Inserta un documento de prueba
    const insertResult = await collection.insertOne({
      channelId: testChannelId,
      gameMode: 'IAdventure',
      gameState: {
        posicion: 'sala_entrada',
        inventario: ['llave'],
        eventos: [],
        mapa_dinamico: {},
        historial_comandos: []
      },
      createdAt: new Date()
    });
    console.log('Insertado:', insertResult.insertedId);

    // Recupera el documento
    const found = await collection.findOne({ channelId: testChannelId });
    console.log('Recuperado:', found);

    // Actualiza el documento
    await collection.updateOne(
      { channelId: testChannelId },
      { $set: { 'gameState.inventario': ['llave', 'linterna mágica'] } }
    );
    const updated = await collection.findOne({ channelId: testChannelId });
    console.log('Actualizado:', updated);

    // Elimina el documento
    await collection.deleteOne({ channelId: testChannelId });
    console.log('Eliminado el documento de test.');
    await closeDb();
  } catch (err) {
    console.error('Error al testear la base de datos:', err);
  } finally {
    await closeDb();
    process.exit(0);
  }
}

testDb().then(r => "Test DB script finalizado");

