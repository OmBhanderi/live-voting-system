import React, { useState } from 'react';
import { pollAPI } from '../../services/api';
import Button from '../common/Button';
import { getTotalVotes } from '../../utils/chartHelpers';

const PollManager = ({ poll, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalVotes = getTotalVotes(poll.options);

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      await pollAPI.toggleStatus(poll.id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error toggling poll status:', err);
      alert('Failed to toggle poll status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await pollAPI.delete(poll.id);
      if (onDelete) onDelete(poll.id);
    } catch (err) {
      console.error('Error deleting poll:', err);
      alert('Failed to delete poll');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Poll Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{poll.title}</h3>
          {poll.description && (
            <p className="text-sm text-gray-600 mt-1">{poll.description}</p>
          )}
        </div>
        <div>
          {poll.isActive ? (
            <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Poll Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{totalVotes}</p>
          <p className="text-xs text-gray-600">Total Votes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{poll.options.length}</p>
          <p className="text-xs text-gray-600">Options</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {poll.allowMultipleVotes ? 'Yes' : 'No'}
          </p>
          <p className="text-xs text-gray-600">Multiple Votes</p>
        </div>
      </div>

      {/* Options List */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
        <div className="space-y-2">
          {poll.options.map((option, index) => (
            <div key={option.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{index + 1}. {option.text}</span>
              <span className="text-sm font-medium text-blue-600">{option.votes} votes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Created Date */}
      <p className="text-xs text-gray-400 mb-4">
        Created: {new Date(poll.createdAt).toLocaleString()}
      </p>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={handleToggleStatus}
          disabled={isToggling}
          variant={poll.isActive ? 'secondary' : 'success'}
          className="flex-1"
        >
          {isToggling ? 'Updating...' : poll.isActive ? 'Close Poll' : 'Activate Poll'}
        </Button>
        
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting}
          variant="danger"
        >
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Poll?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{poll.title}"? This action cannot be undone.
              All {totalVotes} votes will be lost.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="danger"
                className="flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollManager;