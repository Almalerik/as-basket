import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, { messages: [] });
await db.read();

const PASSWORD = process.env.API_PASSWORD;

// API
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

// Serve React
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server attivo su http://localhost:${PORT}`));