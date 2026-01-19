const express = require('express');
const cors = require('cors');
const { CORS_ORIGIN } = require('./config/constants');

// Import routes
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes');
const realtimeRoutes = require('./routes/realtimeRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const validatePoll = require('./middleware/validatePoll');
const { voteRateLimiter, pollCreationRateLimiter } = require('./middleware/rateLimiter');

// Create Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow frontend to connect
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

// Body parser - Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Live Voting System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/stream', realtimeRoutes);

// Apply rate limiters to specific routes
app.post('/api/votes', voteRateLimiter);
app.post('/api/polls', pollCreationRateLimiter, validatePoll);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;