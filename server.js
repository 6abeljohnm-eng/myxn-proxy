import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBareServer } from '@tomphttp/bare-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { barePath } from '@mercuryworkshop/bare-mux';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bare = createBareServer('/bare/');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uv/', express.static(uvPath));
app.use('/baremux/', express.static(barePath));

app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const server = http.createServer((req, res) => {
  if (bare.shouldRoute(req)) return bare.routeRequest(req, res);
  app(req, res);
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) return bare.routeUpgrade(req, socket, head);
  socket.end();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`MyXN Proxy live → http://localhost:${PORT}`));
