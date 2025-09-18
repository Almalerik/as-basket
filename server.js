// server.js
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3000;

// Configura Lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Middleware
app.use(express.json());

// Inizializza il database
await db.read();
db.data ||= { messages: [] };

// Rotta principale
app.get('/', (req, res) => {
  res.send('Benvenuto nella tua app Node.js con Lowdb!');
});

// Rotta per aggiungere un messaggio
app.post('/message', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Testo mancante');

  db.data.messages.push({ text, timestamp: Date.now() });
  await db.write();
  res.send('Messaggio salvato!');
});

// Rotta per leggere tutti i messaggi
app.get('/messages', (req, res) => {
  res.json(db.data.messages);
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});