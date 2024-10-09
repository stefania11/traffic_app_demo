import { RealtimeRelay } from './lib/relay.js';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

dotenv.config({ override: true });

let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    `Environment variable "OPENAI_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

if (!GOOGLE_MAPS_API_KEY) {
  console.error(
    `Environment variable "REACT_APP_GOOGLE_MAPS_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 8081;

const app = express();
app.use(bodyParser.json());

// Endpoint to set the OpenAI API key
app.post('/api/set-api-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  // Update the API key in memory
  OPENAI_API_KEY = apiKey;

  // Update the .env file
  const envPath = path.resolve(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/^OPENAI_API_KEY=.*$/m, `OPENAI_API_KEY=${apiKey}`);
  fs.writeFileSync(envPath, envContent);

  // Restart the RealtimeRelay with the new API key
  relay.updateApiKey(OPENAI_API_KEY);

  res.json({ message: 'API key updated successfully' });
});

const relay = new RealtimeRelay(OPENAI_API_KEY);
relay.listen(PORT);

// Start the Express server
app.listen(3001, () => {
  console.log('Express server listening on port 3001');
});
