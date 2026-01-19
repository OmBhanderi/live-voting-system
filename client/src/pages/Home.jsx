import React, { useState, useEffect } from 'react';
import { pollAPI } from '../services/api';
import PollCard from '../components/voting/PollCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await pollAPI.getAll(showActive);
      setPolls(response.data);
    } catch (err) {
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [showActive]);

  if (loading) {
    return <Loading message="Loading polls..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Live Voting System
        </h1>
        <p className="text-lg text-gray-600">
          Vote on polls and see results update in real-time
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={() => navigate('/admin')}>
          Admin Panel
        </Button>
        <Button variant="secondary" onClick={fetchPolls}>
          Refresh
        </Button>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-300">
          <button
            onClick={() => setShowActive(true)}
            className={`px-6 py-2 font-medium rounded-l-lg ${
              showActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active Polls
          </button>
          <button
            onClick={() => setShowActive(false)}
            className={`px-6 py-2 font-medium rounded-r-lg ${
              !showActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Polls
          </button>
        </div>
      </div>

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No polls available</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Create Your First Poll
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;