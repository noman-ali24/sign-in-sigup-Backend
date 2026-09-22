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
