import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { getTotalVotes } from '../../utils/chartHelpers';

const PollCard = ({ poll }) => {
  const navigate = useNavigate();
  const totalVotes = getTotalVotes(poll.options);

  return (
    <Card hover onClick={() => navigate(`/poll/${poll.id}`)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {poll.title}
          </h3>
          {poll.isActive ? (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
              Closed
            </span>
          )}
        </div>

        {poll.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {poll.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {poll.options.length} options
          </div>
          <div className="text-sm font-medium text-blue-600">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Created {new Date(poll.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default PollCard;