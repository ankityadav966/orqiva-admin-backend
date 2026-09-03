import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import apiRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration
const allowedOrigins = [
  'https://www.orqivatech.com',
  'https://orqivatech.com',
  ENV.FRONTEND_URL,
  ENV.ADMIN_FRONTEND_URL,
  ENV.PUBLIC_WEBSITE_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed explicit origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Check Vercel deployed previews and production frontend domains
      if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) return callback(null, true);

      // Allow localhost and local development in non-production or dev ports
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);

      // Fallback allowed for existing public website domains
      if (origin.includes('orqivatech.com')) return callback(null, true);

      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request Logger
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiting to all API requests
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'ORQIVA Tech Backend API',
  });
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 & Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
