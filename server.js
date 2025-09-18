// server.js
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorso assoluto al file db.json
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);

// ⚠️ Qui passiamo i dati di default al costruttore di Low
const db = new Low(adapter, { messages: [] });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Leggi il file e inizializza se vuoto
await db.read();
db.data ||= { messages: [] }; // fallback se il file è vuoto

// Rotta GET
app.get('/', (req, res) => {
  res.send('App funzionante con Lowdb!');
});

// Rotta POST per aggiungere un messaggio
app.post('/message', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Testo mancante');

  db.data.messages.push({ text, timestamp: Date.now() });
  await db.write();
  res.send('Messaggio salvato!');
});

// Rotta GET per leggere i messaggi
app.get('/messages', (req, res) => {
  res.json(db.data.messages);
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});