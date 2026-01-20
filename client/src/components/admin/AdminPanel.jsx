import React, { useState, useEffect } from 'react';
import { pollAPI } from '../../services/api';
import CreatePoll from './CreatePoll';
import PollManager from './PollManager';
import Loading from '../common/Loading';
import Button from '../common/Button';

const AdminPanel = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'closed'

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await pollAPI.getAll();
      setPolls(response.data);
    } catch (err) {
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handlePollCreated = () => {
    setShowCreateForm(false);
    fetchPolls();
  };

  const handlePollDeleted = (pollId) => {
    setPolls(polls.filter(p => p.id !== pollId));
  };

  const filteredPolls = polls.filter(poll => {
    if (filter === 'active') return poll.isActive;
    if (filter === 'closed') return !poll.isActive;
    return true;
  });


  if (loading) {
    return <Loading message="Loading admin panel..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
 
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage your polls</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Create New Poll'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-3xl font-bold text-blue-600">{polls.length}</p>
          <p className="text-sm text-gray-600">Total Polls</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-3xl font-bold text-green-600">
            {polls.filter(p => p.isActive).length}
          </p>
          <p className="text-sm text-gray-600">Active Polls</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-3xl font-bold text-gray-600">
            {polls.filter(p => !p.isActive).length}
          </p>
          <p className="text-sm text-gray-600">Closed Polls</p>
        </div>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <CreatePoll
          onSuccess={handlePollCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({polls.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active ({polls.filter(p => p.isActive).length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'closed'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Closed ({polls.filter(p => !p.isActive).length})
        </button>
      </div>

      {/* Polls List */}
      {filteredPolls.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No polls found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map(poll => (
            <PollManager
              key={poll.id}
              poll={poll}
              onUpdate={fetchPolls}
              onDelete={handlePollDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;