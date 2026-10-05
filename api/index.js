require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('../src/routes/index');
const errorHandler = require('../src/middlewares/error.middleware');
const ApiError = require('../src/utils/apiError');
const ApiResponse = require('../src/utils/apiResponse');

const app = express();

// Enable CORS for mobile apps and web clients
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed HTTP Request & Response Logger
app.use((req, res, next) => {
  const start = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const time = new Date().toLocaleTimeString();

  console.log(`\n📨 [${time}] --> ${req.method} ${req.originalUrl} (Client: ${clientIp})`);
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***hidden***';
    console.log(`   📦 Body:`, JSON.stringify(sanitizedBody));
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const icon = status >= 500 ? '🔥' : status >= 400 ? '❌' : '✅';
    console.log(`${icon} [${time}] <-- ${req.method} ${req.originalUrl} | Status: ${status} | ${duration}ms`);
  });

  next();
});

// Health check endpoint (supports both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  return ApiResponse.success(
    res,
    {
      service: 'AutoPulse Auth API',
      timestamp: new Date().toISOString(),
    },
    'Service is healthy'
  );
});

// Root welcome route
app.get('/', (req, res) => {
  return ApiResponse.success(
    res,
    {
      endpoints: {
        health: 'GET /api/health',
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
      },
    },
    'Welcome to AutoPulse Authentication Backend API'
  );
});

// Mount Central Auth Routes (Supports both /api/auth and /auth)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Catch-all 404 handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Global Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
