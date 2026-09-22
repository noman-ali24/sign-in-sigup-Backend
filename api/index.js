require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('../src/routes/authRoutes');

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AutoPulse Auth API',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AutoPulse Authentication Backend API',
    endpoints: {
      health: 'GET /api/health',
      signup: 'POST /api/auth/signup',
      signin: 'POST /api/auth/signin',
      profile: 'GET /api/auth/profile',
    },
  });
});

// Auth Routes (Mount on /api/auth and fallback /auth)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

module.exports = app;
