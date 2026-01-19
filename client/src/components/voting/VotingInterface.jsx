import React, { useState, useEffect } from 'react';
import { voteAPI } from '../../services/api';
import Button from '../common/Button';

const VotingInterface = ({ poll, onVoteSuccess }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user has already voted
    const checkVoteStatus = async () => {
      try {
        const response = await voteAPI.checkVoted(poll.id);
        setHasVoted(response.data.hasVoted);
      } catch (err) {
        console.error('Error checking vote status:', err);
      }
    };

    checkVoteStatus();
  }, [poll.id]);

  const handleVote = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await voteAPI.submit(poll.id, selectedOption);
      setHasVoted(true);
      if (onVoteSuccess) onVoteSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll.isActive) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">This poll is closed</p>
      </div>
    );
  }

  if (hasVoted && !poll.allowMultipleVotes) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <p className="text-green-700 font-medium">✓ You have already voted</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Cast Your Vote</h3>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            disabled={isSubmitting}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedOption === option.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedOption === option.id
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium text-gray-900">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </div>
  );
};

export default VotingInterface;