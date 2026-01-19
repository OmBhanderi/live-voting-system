const app = require('./src/app');
const { PORT } = require('./src/config/constants');

// Start server
const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Live Voting System - Backend         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔄 SSE endpoint: http://localhost:${PORT}/api/stream`);
  console.log('');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('');
  console.log('Press CTRL+C to stop the server');
  console.log('════════════════════════════════════════');
});



module.exports = server;