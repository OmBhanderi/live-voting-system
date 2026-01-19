const express = require('express');
const router = express.Router();
const voteService = require('../services/voteService');
const realtimeService = require('../services/realtimeService');

// POST /api/votes - Submit a vote
router.post('/', (req, res, next) => {
  try {
    const { pollId, optionId } = req.body;

    // Validate request
    if (!pollId || !optionId) {
      return res.status(400).json({
        success: false,
        error: 'pollId and optionId are required'
      });
    }

    // Submit vote
    const result = voteService.submitVote(pollId, optionId, req);

    // Broadcast update to all connected clients
    realtimeService.broadcastUpdate(pollId, result.results);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/votes/:pollId/check - Check if user has voted
router.get('/:pollId/check', (req, res, next) => {
  try {
    const hasVoted = voteService.hasUserVoted(req.params.pollId, req);
    res.json({
      success: true,
      data: { hasVoted }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/votes/:pollId/stats - Get vote statistics
router.get('/:pollId/stats', (req, res, next) => {
  try {
    const stats = voteService.getVoteStats(req.params.pollId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;