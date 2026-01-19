export const calculatePercentage = (votes, total) => {
  if (total === 0) return 0;
  return ((votes / total) * 100).toFixed(1);
};

export const getChartColor = (index) => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];
  return colors[index % colors.length];
};

export const formatChartData = (options) => {
  return options?.map((option, index) => ({
    name: option.text,
    votes: option.votes,
    id: option.id,
    color: getChartColor(index),
  }));
};

export const getTotalVotes = (options) => {
  return options?.reduce((sum, option) => sum + option.votes, 0);
};