const { generateId } = require('../utils/helpers');

class Poll {
  constructor({ title, description = '', options, allowMultipleVotes = false }) {
    this.id = generateId();
    this.title = title;
    this.description = description;
    this.options = options.map((opt, index) => ({
      id: generateId(),
      text: typeof opt === 'string' ? opt : opt.text,
      votes: 0,
      order: index
    }));
    this.createdAt = new Date().toISOString();
    this.isActive = true;
    this.allowMultipleVotes = allowMultipleVotes;
  }

  incrementVote(optionId) {
    const option = this.options.find(opt => opt.id === optionId);

    if (option) {
      option.votes += 1;
      return true;
    }
    return false;
  }

  getTotalVotes() {
    return this.options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  getResults() {
    const total = this.getTotalVotes();
    return this.options.map(opt => ({
      ...opt,
      percentage: total > 0 ? ((opt.votes / total) * 100).toFixed(2) : 0
    }));
  }
}

module.exports = Poll;