const express = require('express');
const router = express.Router();
const realtimeService = require('../services/realtimeService');
const storage = require('../utils/storage');

// GET /api/stream/:pollId - SSE endpoint for live updates
router.get('/:pollId', (req, res, next) => {
  try {
    const { pollId } = req.params;

    // Verify poll exists
    const poll = storage.getPoll(pollId);
    if (!poll) {
      return res.status(404).json({     
        success: false,
        error: 'Poll not found'
      });
    }

    // Setup SSE connection
    realtimeService.setupSSE(req, res, pollId);

  } catch (error) {
    next(error);
  }
});

// GET /api/stream/all - SSE for all polls (optional - for admin dashboard)
router.get('/', (req, res, next) => {

  
  try {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial data
    const allPolls = storage.getAllPolls();
    res.write(`event: initial\n`);
    res.write(`data: ${JSON.stringify(allPolls)}\n\n`);

    // Keep connection alive
    const heartbeat = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 30000);

    // Cleanup on close
    req.on('close', () => {
      clearInterval(heartbeat);
      res.end();
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;