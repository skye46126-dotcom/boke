import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import articlesRouter from './routes/articles';
import adminRouter from './routes/admin';
import uploadRouter from './routes/upload';
import tagsRouter from './routes/tags';
import statsRouter from './routes/stats';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requireAdmin, logSuspiciousAccess } from './middleware/adminAuth';
import { csrfProtection, getCSRFToken } from './middleware/csrf';
import { xssProtection, requestSizeLimit } from './middleware/validation';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Log suspicious access attempts
app.use(logSuspiciousAccess);

// XSS protection
app.use(xssProtection);

// Request size limit (1MB for regular requests)
app.use(requestSizeLimit(1024 * 1024));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Stricter rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Blog API',
    version: '1.0.0',
  });
});

// CSRF token endpoint
app.get('/api/csrf-token', getCSRFToken);

// Public API routes
app.use('/api/articles', articlesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/stats', statsRouter);

// Admin routes (protected by hidden path and CSRF)
app.use(`/${config.admin.path}`, adminLimiter, requireAdmin, csrfProtection, adminRouter);

// Upload routes (protected by hidden path and CSRF)
app.use(`/${config.admin.path}/upload`, adminLimiter, requireAdmin, csrfProtection, uploadRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Admin path: /${config.admin.path}`);
  console.log(`IMPORTANT: Keep your admin path secret!`);
});

export default app;
