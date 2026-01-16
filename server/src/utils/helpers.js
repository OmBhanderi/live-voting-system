const { v4: uuidv4 } = require('uuid');

const generateId = () => uuidv4();

const generateVoterId = (req) => {

  return req.sessionID || req.ip || req.headers['x-forwarded-for'] || 'anonymous';
};

const formatPollResponse = (poll, includeVotes = false) => {
  const response = {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    options: poll.options,
    createdAt: poll.createdAt,
    isActive: poll.isActive,
    allowMultipleVotes: poll.allowMultipleVotes,
  };

  if (includeVotes) {
    response.totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  return response;
};

const validatePollData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.options || !Array.isArray(data.options) || data.options.length < 2) {
    errors.push('At least 2 options are required');
  }

  if (data.options && data.options.some(opt => !opt.text || opt.text.trim().length === 0)) {
    errors.push('All options must have text');
  }

  return errors;
};

module.exports = {
  generateId,
  generateVoterId,
  formatPollResponse,
  validatePollData,
};