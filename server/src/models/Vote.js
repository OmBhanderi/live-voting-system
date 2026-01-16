const { generateId } = require('../utils/helpers');

class Vote {
  constructor({ pollId, optionId, voterId }) {
    this.id = generateId();
    this.pollId = pollId;
    this.optionId = optionId;
    this.voterId = voterId;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = Vote;