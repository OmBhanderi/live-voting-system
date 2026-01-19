const storage = require('../utils/storage');
const { SSE_HEARTBEAT_INTERVAL } = require('../config/constants');

class RealtimeService {




  setupSSE(req, res, pollId) {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial data
    const stats = storage.getPollStates(pollId);
    if (stats) {
      this.sendEvent(res, 'initial', stats);
    }

    // Add client to storage
    storage.addClient(pollId, res);

    // Setup heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, SSE_HEARTBEAT_INTERVAL);

    // Cleanup on close
    req.on('close', () => {
      clearInterval(heartbeat);
      storage.removeClient(pollId, res);
      res.end();
    });
  }

  sendEvent(res, event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  broadcastUpdate(pollId, data) {
    const clients = storage.getClients(pollId);
    
    clients.forEach(client => {
      try {
        this.sendEvent(client, 'update', data);
      } catch (error) {
        console.error('Error broadcasting to client:', error);
        storage.removeClient(pollId, client);
      }
    });
  }

  broadcastToAll(event, data) {
    const allPolls = storage.getAllPolls();
    
    allPolls.forEach(poll => {
      this.broadcastUpdate(poll.id, data);
    });
  }
} 

module.exports = new RealtimeService();