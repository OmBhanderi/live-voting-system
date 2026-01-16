const Vote = require('../models/Vote');
const storage = require('../utils/storage');
const { generateVoterId } = require('../utils/helpers');

class VoteService {
  submitVote(pollId, optionId, req) {

    const poll = storage.getPoll(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    if (!poll.isActive) {
      throw new Error('Poll is not active');
    }

    // Validate option exists
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error('Invalid option');
    }

    // Generate voter ID
    const voterId = generateVoterId(req);

    // Check if already voted
    if (!poll.allowMultipleVotes && storage.hasVoted(pollId, voterId)) {
      throw new Error('You have already voted in this poll');
    }

    // Create and store vote
    const vote = new Vote({ pollId, optionId, voterId });
    storage.addVote(pollId, vote);

    // Update poll option count
    poll.incrementVote(optionId);
    storage.updatePoll(pollId, poll);

    return {
      vote,
      results: storage.getPollStats(pollId)
    };
  }

  getVoteStats(pollId) {
    return storage.getPollStats(pollId);
  }

  hasUserVoted(pollId, req) {
    const voterId = generateVoterId(req);
    return storage.hasVoted(pollId, voterId);
  }
}

module.exports = new VoteService();