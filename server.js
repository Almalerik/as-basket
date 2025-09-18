import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Serve React statico
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all per routing React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const adapter = new JSONFile('db.json');
const db = new Low(adapter, { messages: [] }); // 👈 modello iniziale
await db.read();
db.data ||= { messages: [] };

const PASSWORD = process.env.API_PASSWORD;

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Password errata' });
  }
});

app.get('/api/messages', (req, res) => {
  const { password } = req.query;
  if (password !== PASSWORD) return res.status(403).json({ error: 'Accesso negato' });
  res.json(db.data.messages);
});

app.post('/api/messages', async (req, res) => {
  const { password, message } = req.body;
  if (password !== PASSWORD) return res.status(403).json({ error: 'Accesso negato' });
  db.data.messages.push(message);
  await db.write();
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server attivo su http://127.0.0.1:${PORT}`));