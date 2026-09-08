import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(join(__dirname, 'public')));

// Ultraviolet proxy route
app.use('/uv/', express.static(join(__dirname, 'node_modules', '@titaniumnetwork-dev', 'ultraviolet', 'dist')));

// Proxy endpoint
app.post('/api/proxy', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    // Encode URL for ultraviolet
    const encodedUrl = Buffer.from(url).toString('base64');
    const proxyUrl = `/uv/route/?url=${encodedUrl}`;

    res.json({
      success: true,
      proxyUrl: proxyUrl,
      redirectUrl: `/proxy.html?url=${encodedUrl}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Service worker registration
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(join(__dirname, 'public', 'sw.js'));
});

// Proxy page (iframe container)
app.get('/proxy.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'proxy.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', version: '1.0.0' });
});

// 404 fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🌌 MyXN Proxy running at http://localhost:${PORT}`);
  console.log(`Password: unblock`);
  console.log(`\n`);
});
