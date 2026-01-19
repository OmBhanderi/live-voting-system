const Poll = require("../models/Poll");
const storage = require("../utils/storage");
const { validatePollData } = require("../utils/helpers");

class PollService {
  createPoll(data) {
    // Validate
    // const errors = validatePollData(data);
    // if (errors.length > 0) {
    //   throw new Error(errors.join(", "));
    // }

    // Create poll
    const poll = new Poll(data);
  
    storage.createPoll(poll);
    return poll;
  }

  getPoll(pollId) {
    const poll = storage.getPoll(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }
    return poll;
  }

  getAllPolls(activeOnly = false) {
    let polls = storage.getAllPolls();


    if (activeOnly) {
      polls = polls.filter((p) => p.isActive);
    }

    return polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updatePoll(pollId, updates) {
    const poll = storage.getPoll(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Only allow certain fields to be updated
    const allowedUpdates = {
      title: updates.title,
      description: updates.description,
      isActive: updates.isActive,
    };

    const updated = storage.updatePoll(pollId, allowedUpdates);
    return updated;
  }

  deletePoll(pollId) {
    const deleted = storage.deletePoll(pollId);
    if (!deleted) {
      throw new Error("Poll not found");
    }
    return true;
  }

  togglePollStatus(pollId) {
    const poll = storage.getPoll(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    const updated = storage.updatePoll(pollId, { isActive: !poll.isActive });
    return updated;
  }

  getPollResults(pollId) {
    const stats = storage.getPollStates(pollId);
    if (!stats) {
      throw new Error("Poll not found");
    }
    return stats;
  }
}

module.exports = new PollService();
