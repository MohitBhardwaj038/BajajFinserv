const express = require('express');
const cors = require('cors');

// Import routes
const indexRoutes = require('./routes/index');
const bfhlRoutes = require('./routes/bfhl');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --------------- Global Middleware ---------------

// Enable CORS — uses FRONTEND_URL env var in production, allows all in dev
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------

app.use('/api', indexRoutes);
app.use('/api/bfhl', bfhlRoutes);

// Vercel-friendly route — POST /bfhl accessible without /api prefix
app.use('/bfhl', bfhlRoutes);

// --------------- Error Handling ---------------

// 404 handler – catches requests to undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
