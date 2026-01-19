class Storage {
  constructor() {
    this.polls = new Map();
    this.votes = new Map();
    this.voterHistory = new Map();
    this.clients = new Map();
  }

  createPoll(poll) {
    
    this.polls.set(poll.id, poll);
    this.votes.set(poll.id, []);
    this.voterHistory.set(poll.id, new Set());
    
    return poll;
  }

  getPoll(pollId) {
    const poll = this.polls.get(pollId);
    if (!poll) {
      return {}
    } 

    return poll
  }

  getAllPolls() {
    const polls =  Array.from(this?.polls?.values());
    if (polls.length === 0 ) {
      return []
    }
    return polls
  }

  updatePoll(pollId, updates) {
    const poll = this.polls.get(pollId);
    if (!poll) return null;
    const updatedPoll = { ...poll, ...updates };
    this.polls.set(pollId,updatedPoll);
    return updatedPoll;
  }

  deletePoll(pollId) {
    const deleted = this.polls.delete(pollId);
    this.votes.delete(pollId);
    this.voterHistory.delete(pollId);
    this.clients.delete(pollId);
    return deleted;
  }

  addVote(pollId, vote) {
    const votes = this.votes.get(pollId) || [];

    votes.push(vote);
    this.votes.set(pollId, votes);

    const voters = this.voterHistory.get(pollId) || new Set();
    voters.add(vote.voterId);
    this.voterHistory.set(pollId, voters);
  }

  getVotes(pollId) {
    return this.votes.get(pollId) || [];
  }

  hasVoted(pollId, voterId) {
    const voters = this.voterHistory.get(pollId);
    return voters ? voters.has(voterId) : false;
  }

  addClient(pollId, client) {
    const clients = this.clients.get(pollId) || [];
    clients.push(client);
    this.clients.set(pollId, clients);
  }

  removeClient(pollId, client) {
    const clients = this.clients.get(pollId) || [];
    const filtered = clients.filter((c) => c !== client);
    this.clients.set(pollId, filtered);
  }

  getClients(pollId) {
    return this.clients.get(pollId) || [];
  }

  getPollStates(pollId) {
    const poll = this.polls.get(pollId);
    let votes = []
    const res = this.votes.get(pollId);
    if (res?.length === 0) {
      votes = []
    } else {
      votes = res
    }

    return {
      pollId,
      totalVotes: votes?.length,
      uniqueVotes: this.voterHistory.get(pollId)?.size || 0,
      options: poll?.options.map((opt) => ({
        ...opt,
        votes: votes?.filter((v) => v?.optionId === opt?.id)?.length,
      })),
    };
  }
}


const storage = new Storage();
module.exports = storage;   