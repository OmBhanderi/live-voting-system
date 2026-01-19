const SSE_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createSSEConnection = (pollId, onMessage, onError) => {
  const eventSource = new EventSource(`${SSE_BASE_URL}/stream/${pollId}`);

  // Handle initial data
  eventSource.addEventListener('initial', (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing initial data:', error);
    }
  });

  // Handle updates
  eventSource.addEventListener('update', (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing update data:', error);
    }
  });

  // Handle errors
  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    if (onError) {
      onError(error);
    }
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
};

export default { createSSEConnection };