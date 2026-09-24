import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", '*'],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
}));

// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1d',
  etag: false,
}));

// ============================================================================
// LOGGING
// ============================================================================

const logger = {
  info: (msg) => console.log(`[${new Date().toISOString()}] ✓ ${msg}`),
  error: (msg) => console.error(`[${new Date().toISOString()}] ✗ ${msg}`),
  warn: (msg) => console.warn(`[${new Date().toISOString()}] ⚠ ${msg}`),
};

// ============================================================================
// PROXY UTILITIES
// ============================================================================

function encodeUrl(targetUrl) {
  try {
    return Buffer.from(targetUrl).toString('base64');
  } catch (e) {
    return '';
  }
}

function decodeUrl(encoded) {
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch (e) {
    return '';
  }
}

function validateUrl(targetUrl) {
  try {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    const parsed = new URL(targetUrl);
    return parsed.href;
  } catch (e) {
    return null;
  }
}

function injectProxyScript(html) {
  const proxyScript = `
    <script>
      window.__proxyConfig = {
        prefix: '/uv/',
        encodeUrl: (url) => btoa(url),
      };
      (function() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest.prototype.open;
        
        window.fetch = function(resource, ...args) {
          if (typeof resource === 'string' && !resource.startsWith('/') && !resource.startsWith('http://localhost')) {
            resource = '/uv/service?url=' + btoa(resource);
          }
          return originalFetch.call(this, resource, ...args);
        };
        
        window.XMLHttpRequest.prototype.open = function(method, url, ...args) {
          if (typeof url === 'string' && !url.startsWith('/') && !url.startsWith('http://localhost')) {
            url = '/uv/service?url=' + btoa(new URL(url, window.location.href).href);
          }
          return originalXHR.call(this, method, url, ...args);
        };
      })();
    </script>
  `;
  
  if (html && html.includes('</head>')) {
    return html.replace('</head>', proxyScript + '</head>');
  }
  return html;
}

// ============================================================================
// UV PROXY ROUTES
// ============================================================================

/**
 * Main proxy service endpoint
 * GET /uv/service?url=<base64-encoded-url>
 */
app.get('/uv/service', async (req, res) => {
  try {
    const encodedUrl = req.query.url;
    
    if (!encodedUrl) {
      return res.status(400).json({ error: 'No URL provided' });
    }
    
    const targetUrl = decodeUrl(encodedUrl);
    const validatedUrl = validateUrl(targetUrl);
    
    if (!validatedUrl) {
      logger.error(`Invalid URL: ${targetUrl}`);
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    logger.info(`Proxying: ${validatedUrl}`);
    
    const response = await fetch(validatedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    
    const contentType = response.headers.get('content-type') || '';
    const data = await response.text();
    
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('X-Frame-Options', 'ALLOWALL');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'no-cache, no-store');
    
    if (contentType.includes('text/html')) {
      return res.send(injectProxyScript(data));
    }
    
    res.send(data);
  } catch (error) {
    logger.error(`Proxy error: ${error.message}`);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
});

/**
 * Proxy API endpoint
 * POST /uv/api/proxy
 */
app.post('/uv/api/proxy', express.json(), async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }
    
    const validatedUrl = validateUrl(url);
    if (!validatedUrl) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    const options = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers,
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(validatedUrl, options);
    const data = await response.text();
    
    res.json({
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UV health check
 * GET /uv/health
 */
app.get('/uv/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * UV configuration endpoint
 * GET /uv/config
 */
app.get('/uv/config', (req, res) => {
  res.json({
    prefix: '/uv/',
    bare: '/bare/',
    encodeUrl: true,
    routes: {
      service: '/uv/service',
      api: '/uv/api/proxy',
      health: '/uv/health',
    },
  });
});

/**
 * Catch-all for UV static assets
 */
app.use('/uv/assets', express.static(join(__dirname, 'public/uv/assets')));
app.use('/uv/js', express.static(join(__dirname, 'public/uv/js')));
app.use('/uv/css', express.static(join(__dirname, 'public/uv/css')));

// ============================================================================
// API ROUTES
// ============================================================================

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/proxy/config', (req, res) => {
  res.json({
    proxyEnabled: true,
    services: ['uv', 'bare'],
    endpoints: {
      uv: '/uv/service',
      api: '/uv/api/proxy',
    },
  });
});

// ============================================================================
// ROOT ROUTE
// ============================================================================

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

app.get('/proxy.html', (req, res) => {
  res.sendFile(join(__dirname, 'public/proxy.html'));
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

let connectionCount = 0;

app.use((req, res, next) => {
  connectionCount++;
  res.on('finish', () => {
    connectionCount--;
  });
  next();
});

process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});

process.on('SIGINT', () => {
  logger.warn('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access at http://localhost:${PORT}`);
  logger.info(`Proxy service at http://localhost:${PORT}/uv/service`);
  logger.info(`API docs at http://localhost:${PORT}/api/status`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error(`Server error: ${err.message}`);
  }
  process.exit(1);
});

export default app;
