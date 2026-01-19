import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePollData } from '../hooks/usePollData';
import { useSSE } from '../hooks/useSSE';
import VotingInterface from '../components/voting/VotingInterface';
import LiveChart from '../components/voting/LiveChart';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const PollView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { poll, loading, error } = usePollData(id);
  const { data: liveData, isConnected } = useSSE(id);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (poll) {
      // Auto-show chart after voting or if poll is closed
      if (!poll.isActive) {
        setShowChart(true);
      }
    }
  }, [poll]);

  if (loading) {
    return <Loading message="Loading poll..." />;
  }

  if (error || !poll) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error || 'Poll not found'}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="secondary" onClick={() => navigate('/')}>
        ← Back to Polls
      </Button>

      {/* Poll Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{poll.title}</h1>
            {poll.description && (
              <p className="text-gray-600 mt-2">{poll.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            {poll.isActive ? (
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                Closed
              </span>
            )}
            {isConnected && (
              <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                🔴 Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Voting and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Interface */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <VotingInterface 
            poll={poll} 
            onVoteSuccess={() => setShowChart(true)}
          />
        </div>

        {/* Live Results */}
        {showChart && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <LiveChart poll={poll} liveData={liveData} />
          </div>
        )}
      </div>

      {/* Toggle Results Button (if voting is active) */}
      {poll.isActive && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? 'Hide Results' : 'Show Results'}
          </Button>
        </div>
      )}

      {/* Poll Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>Created: {new Date(poll.createdAt).toLocaleString()}</p>
        <p>Poll ID: {poll.id}</p>
      </div>
    </div>
  );
};

export default PollView;