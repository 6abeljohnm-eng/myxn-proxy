// ============ DEPENDENCIES ============
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';
import fs from 'fs';

// ============ CONFIGURATION ============
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const CONFIG = {
  environment: process.env.NODE_ENV || 'production',
  port: PORT,
  host: HOST,
  proxySecret: process.env.PROXY_SECRET || 'default_secret',
  logLevel: process.env.LOG_LEVEL || 'info',
  maxConnections: parseInt(process.env.MAX_CONNECTIONS) || 1000,
  proxyTimeout: parseInt(process.env.PROXY_TIMEOUT) || 30000,
  enableCors: process.env.ENABLE_CORS === 'true',
  allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
};

// ============ LOGGING ============

class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
  }

  log(level, message, data = '') {
    if (this.levels[level] < this.levels[this.level]) return;

    const timestamp = new Date().toISOString();
    const prefix = {
      debug: chalk.gray('[DEBUG]'),
      info: chalk.blue('[INFO]'),
      warn: chalk.yellow('[WARN]'),
      error: chalk.red('[ERROR]'),
    }[level];

    const formattedMessage = `${prefix} ${chalk.gray(timestamp)} ${message}`;
    
    if (data) {
      console.log(formattedMessage, chalk.cyan(data));
    } else {
      console.log(formattedMessage);
    }
  }

  debug(message, data) { this.log('debug', message, data); }
  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
}

const logger = new Logger(CONFIG.logLevel);

// ============ MIDDLEWARE ============

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", '*'],
      frameSrc: ["'self'", '*'],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

if (CONFIG.enableCors) {
  app.use(cors({
    origin: CONFIG.allowedOrigins === '*' ? '*' : CONFIG.allowedOrigins.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}

// ============ REQUEST LOGGING ============

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? chalk.red : chalk.green;
    logger.debug(
      `${req.method} ${req.path} ${statusColor(res.statusCode)} (${duration}ms)`
    );
  });

  next();
});

// ============ STATIC FILES ============

app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1h',
  etag: false,
}));

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: CONFIG.environment,
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'StudyHub v4',
    online: true,
    proxy: 'Ultraviolet',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
    connections: req.app.get('activeConnections') || 0,
    maxConnections: CONFIG.maxConnections,
  });
});

// Proxy configuration endpoint
app.get('/api/proxy/config', (req, res) => {
  res.json({
    enabled: true,
    type: 'ultraviolet',
    timeout: CONFIG.proxyTimeout,
    secure: true,
    encryption: 'TLS 1.3',
  });
});

// Proxy stats
app.get('/api/proxy/stats', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatUptime(uptime),
    },
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
      unit: 'MB',
    },
    connections: {
      active: req.app.get('activeConnections') || 0,
      max: CONFIG.maxConnections,
    },
    cpu: process.cpuUsage(),
  });
});

// Proxy endpoint
app.post('/api/proxy', (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body = null } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Missing URL parameter',
        code: 'INVALID_REQUEST',
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format',
        code: 'INVALID_URL',
      });
    }

    res.json({
      status: 'proxied',
      url,
      method,
      timestamp: new Date().toISOString(),
      message: 'Use browser proxy endpoint for actual proxying',
    });
  } catch (error) {
    logger.error('Proxy error:', error.message);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      code: 'PROXY_ERROR',
    });
  }
});

// Ultraviolet proxy path
app.use('/uv/', express.static(join(__dirname, 'public', 'uv')));

// Service configuration for Ultraviolet
app.get('/uv-config.json', (req, res) => {
  res.json({
    prefix: '/uv/',
    codec: 'xor',
    loglevel: 'debug',
    handler: '/uv/service-worker.js',
    bundle: '/uv/bundle.js',
    config: '/uv/config.js',
    sw: '/uv/sw.js',
  });
});

// Proxy HTML handler
app.get('/proxy.html', (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  res.sendFile(join(__dirname, 'public', 'proxy.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Catch-all for single-page app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  
  res.status(500).json({
    error: 'Internal server error',
    message: CONFIG.environment === 'development' ? err.message : 'An error occurred',
    code: 'INTERNAL_ERROR',
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    code: 'NOT_FOUND',
  });
});

// ============ UTILITY FUNCTIONS ============

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${secs}s`;
}

// ============ CONNECTION TRACKING ============

const connections = new Set();

app.get('/api/connections', (req, res) => {
  res.json({
    active: connections.size,
    max: CONFIG.maxConnections,
    percentage: Math.round((connections.size / CONFIG.maxConnections) * 100),
  });
});

// Track active connections
const server = app.listen(PORT, HOST, () => {
  logger.info(chalk.bold.cyan('╔════════════════════════════════════════╗'));
  logger.info(chalk.bold.cyan('║     StudyHub v4 - Learning Platform    ║'));
  logger.info(chalk.bold.cyan('║         Ultraviolet Proxy Active        ║'));
  logger.info(chalk.bold.cyan('╚════════════════════════════════════════╝'));
  logger.info(`Server running on ${chalk.yellow(`http://${HOST}:${PORT}`)}`);
  logger.info(`Environment: ${chalk.cyan(CONFIG.environment)}`);
  logger.info(`Max Connections: ${chalk.cyan(CONFIG.maxConnections)}`);
  logger.info(`CORS: ${chalk.cyan(CONFIG.enableCors ? 'Enabled' : 'Disabled')}`);
  logger.info('Press Ctrl+C to stop');
});

server.on('connection', (conn) => {
  connections.add(conn);
  app.set('activeConnections', connections.size);
  
  conn.on('close', () => {
    connections.delete(conn);
    app.set('activeConnections', connections.size);
  });
});

// ============ GRACEFUL SHUTDOWN ============

process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('Forced shutdown');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  logger.warn('SIGINT received, shutting down');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

export default app;
