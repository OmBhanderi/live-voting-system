const express = require('express');
const router = express.Router();
const pollService = require('../services/pollService');

// GET /api/polls - Get all polls
router.get('/', (req, res, next) => {
  try {
    const activeOnly = req.query.active === 'true';
  
    const polls = pollService.getAllPolls(activeOnly);
    res.json({ success: true, data: polls });
  } catch (error) {
    next(error);
  }
});

// GET /api/polls/:id - Get single poll
router.get('/:id', (req, res, next) => {
  try {
    const poll = pollService.getPoll(req.params.id);
    res.json({ success: true, data: poll });
  } catch (error) {
    next(error);
  }
});

// GET /api/polls/:id/results - Get poll results
router.get('/:id/results', (req, res, next) => {
  try {
    const results = pollService.getPollResults(req.params.id);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

// POST /api/polls - Create new poll
router.post('/', (req, res, next) => {
  try {
    const poll = pollService.createPoll(req.body);
    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    next(error);
  }
});

// PUT /api/polls/:id - Update poll
router.put('/:id', (req, res, next) => {
  try {
    const updated = pollService.updatePoll(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/polls/:id/status - Toggle poll active status
router.patch('/:id/status', (req, res, next) => {
  try {
    const updated = pollService.togglePollStatus(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/polls/:id - Delete poll
router.delete('/:id', (req, res, next) => {
  try {
    pollService.deletePoll(req.params.id);
    res.json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;