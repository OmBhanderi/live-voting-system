module.exports = {
  PORT: process.env.PORT || 5000,
  
  // CORS settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate limiting
  VOTE_RATE_LIMIT: 10, // votes per minute
  POLL_CREATION_LIMIT: 5, // polls per hour
  
  // Poll settings
  MAX_POLL_OPTIONS: 10,
  MIN_POLL_OPTIONS: 2,
  MAX_OPTION_LENGTH: 200,
  MAX_POLL_TITLE_LENGTH: 200,
  MAX_POLL_DESCRIPTION_LENGTH: 1000,
  
  // SSE settings
  SSE_HEARTBEAT_INTERVAL: 30000, // 30 seconds
  
  // Vote tracking
  VOTE_TRACKING_METHOD: 'session', // 'ip' or 'session'
};