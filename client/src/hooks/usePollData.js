import { useState, useEffect } from 'react';
import { pollAPI } from '../services/api';

export const usePollData = (pollId) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pollId) return;

    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await pollAPI.getById(pollId);
        setPoll(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  return { poll, loading, error, refetch: () => pollAPI.getById(pollId) };
};

export default usePollData;