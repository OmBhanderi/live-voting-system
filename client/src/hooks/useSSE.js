import { useEffect, useState, useRef } from 'react';
import { createSSEConnection } from '../services/realtime';

export const useSSE = (pollId) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!pollId) return;

    setIsConnected(true);
    setError(null);

    const handleMessage = (newData) => {
      setData(newData);
    };

    const handleError = (err) => {
      setError(err);
      setIsConnected(false);
    };

    // Create SSE connection
    cleanupRef.current = createSSEConnection(pollId, handleMessage, handleError);

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        setIsConnected(false);
      }
    };
  }, [pollId]);

  return { data, isConnected, error };
};

export default useSSE;